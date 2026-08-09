import { OrderStatus, PaymentMethod, PaymentProvider, PaymentStatus, Prisma, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { emailService } from "../email/email.service.js";
import { mercadoPagoGateway, type ProviderPayment } from "./mercadopago.gateway.js";

const publicPaymentSelect = {
  id: true,
  provider: true,
  providerPaymentId: true,
  providerPreferenceId: true,
  status: true,
  amount: true,
  currency: true,
  paidAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PaymentSelect;

const mapStatus = (status: string): PaymentStatus => ({
  approved: PaymentStatus.APPROVED,
  pending: PaymentStatus.PENDING,
  in_process: PaymentStatus.IN_PROCESS,
  rejected: PaymentStatus.REJECTED,
  cancelled: PaymentStatus.CANCELLED,
  refunded: PaymentStatus.REFUNDED,
}[status] ?? PaymentStatus.PENDING);

type PaymentAccess = { id: number; role: UserRole } | undefined;
type GuestAccess = { trackingCode?: string | undefined; email?: string | undefined };

const ensureOrderAccess = (order: { userId: number | null; trackingCode: string; guestEmail: string | null }, guest: GuestAccess, user: PaymentAccess) => {
  if (user?.role === UserRole.ADMIN || (user && order.userId === user.id)) return;
  if (!order.userId && guest.trackingCode === order.trackingCode && guest.email?.toLowerCase() === order.guestEmail?.toLowerCase()) return;
  throw new ApiError(user ? 403 : 401, "No autorizado para acceder a esta orden");
};

const ensureOrderStatusAccess = (order: { userId: number | null; trackingCode: string }, guest: { trackingCode?: string | undefined }, user: PaymentAccess) => {
  if (user?.role === UserRole.ADMIN || (user && order.userId === user.id)) return;
  if (!order.userId && guest.trackingCode === order.trackingCode) return;
  throw new ApiError(user ? 403 : 401, "No autorizado para acceder a esta orden");
};

const createPreference = async (input: { orderId: number } & GuestAccess, user: PaymentAccess) => {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    include: { items: true, user: { select: { email: true } } },
  });
  if (!order) throw new ApiError(404, "Orden no encontrada");
  ensureOrderAccess(order, input, user);
  if (order.paymentMethod !== PaymentMethod.MERCADOPAGO) throw new ApiError(409, "La orden no usa Mercado Pago");
  if (order.status !== OrderStatus.PENDING_PAYMENT) throw new ApiError(409, "La orden no esta pendiente de pago");
  if (order.paymentStatus === PaymentStatus.APPROVED) throw new ApiError(409, "La orden ya esta pagada");
  if (!order.items.length) throw new ApiError(409, "La orden no tiene items");

  let result;
  try {
    result = await mercadoPagoGateway.createPreference({
      orderId: order.id,
      orderNumber: order.orderNumber,
      trackingCode: order.trackingCode,
      payerEmail: order.guestEmail ?? order.user?.email ?? "",
      items: order.items.map((item) => ({
        id: String(item.productId),
        title: item.productName,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, `No se pudo crear la preferencia: ${error instanceof Error ? error.message : "error desconocido"}`);
  }

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: PaymentProvider.MERCADOPAGO,
      providerPreferenceId: result.id,
      externalReference: String(order.id),
      status: PaymentStatus.PENDING,
      amount: order.total,
      currency: "ARS",
      rawResponse: result.raw as Prisma.InputJsonValue,
    },
  });
  await prisma.order.update({ where: { id: order.id }, data: { paymentReference: result.id } });
  return { preferenceId: result.id, initPoint: result.initPoint, sandboxInitPoint: result.sandboxInitPoint };
};

const processVerifiedPayment = async (providerPayment: ProviderPayment) => {
  const orderId = Number(providerPayment.externalReference);
  if (!Number.isInteger(orderId)) throw new ApiError(400, "Referencia externa de pago invalida");
  const status = mapStatus(providerPayment.status);

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new ApiError(404, "Orden asociada al pago no encontrada");
    if (Number(order.total) !== providerPayment.amount) throw new ApiError(409, "El monto del pago no coincide con la orden");

    const existing = await tx.payment.findUnique({ where: { providerPaymentId: providerPayment.id } });
    const alreadyApproved = order.paymentStatus === PaymentStatus.APPROVED || existing?.status === PaymentStatus.APPROVED;
    const shouldSendApprovedEmail = status === PaymentStatus.APPROVED && !alreadyApproved;
    let stockError: string | null = existing?.processingError ?? null;
    let stockProcessedAt = existing?.stockProcessedAt ?? order.stockProcessedAt ?? null;

    if (status === PaymentStatus.APPROVED && !alreadyApproved && !stockProcessedAt) {
      const products = await tx.product.findMany({
        where: { id: { in: order.items.map((item) => item.productId) } },
        select: { id: true, isActive: true, stock: true },
      });
      const unavailable = order.items.find((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        return !product?.isActive || product.stock < item.quantity;
      });
      if (unavailable) {
        stockError = `Stock insuficiente para productId ${unavailable.productId}`;
      } else {
        for (const item of order.items) {
          await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
        }
      }
      stockProcessedAt = new Date();
    }

    const payment = await tx.payment.upsert({
      where: { providerPaymentId: providerPayment.id },
      create: {
        orderId: order.id,
        providerPaymentId: providerPayment.id,
        externalReference: providerPayment.externalReference,
        status,
        amount: providerPayment.amount.toFixed(2),
        currency: providerPayment.currency,
        rawResponse: providerPayment.raw as Prisma.InputJsonValue,
        paidAt: providerPayment.paidAt,
        stockProcessedAt,
        processingError: stockError,
      },
      update: {
        status,
        rawResponse: providerPayment.raw as Prisma.InputJsonValue,
        paidAt: providerPayment.paidAt,
        stockProcessedAt,
        processingError: stockError,
      },
      select: publicPaymentSelect,
    });

    await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: status,
        paymentMethod: PaymentMethod.MERCADOPAGO,
        paymentReference: providerPayment.id,
        ...(stockProcessedAt && !order.stockProcessedAt && { stockProcessedAt }),
        ...(status === PaymentStatus.APPROVED && { status: OrderStatus.PAID }),
      },
    });
    return { payment, shouldSendApprovedEmail, orderId: order.id };
  });
  if (result.shouldSendApprovedEmail) {
    const order = await prisma.order.findUnique({
      where: { id: result.orderId },
      include: { user: { select: { email: true } } },
    });
    if (order) {
      await emailService.safeSend(
        "payment-approved",
        () => emailService.sendPaymentApprovedEmail(order),
        { orderId: order.id, to: order.guestEmail ?? order.user?.email ?? null },
      );
    }
  }
  return result.payment;
};

const processWebhook = async (type: string | undefined, paymentId: string | undefined) => {
  if (type && type !== "payment") return { ignored: true };
  if (!paymentId) return { ignored: true };
  const verified = await mercadoPagoGateway.getPayment(paymentId);
  await processVerifiedPayment(verified);
  return { processed: true };
};

const getById = async (id: number, user: PaymentAccess) => {
  const payment = await prisma.payment.findUnique({ where: { id }, select: { ...publicPaymentSelect, order: { select: { userId: true, trackingCode: true } } } });
  if (!payment) throw new ApiError(404, "Pago no encontrado");
  ensureOrderStatusAccess(payment.order, {}, user);
  const { order: _order, ...result } = payment;
  return result;
};

const getByOrder = async (orderId: number, guest: { trackingCode?: string | undefined }, user: PaymentAccess) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true, orderNumber: true, trackingCode: true, status: true, paymentStatus: true,
      userId: true, deliveryMethod: true, paymentMethod: true, total: true,
      payments: { select: publicPaymentSelect, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!order) throw new ApiError(404, "Orden no encontrada");
  ensureOrderStatusAccess(order, guest, user);
  const { userId: _userId, payments, ...safeOrder } = order;
  return { ...safeOrder, payment: payments[0] ?? null };
};

export const paymentsService = { createPreference, processWebhook, processVerifiedPayment, getById, getByOrder, mapStatus };
