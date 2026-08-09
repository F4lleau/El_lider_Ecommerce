import { randomBytes } from "node:crypto";
import { DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus, type Prisma } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { cartService } from "../cart/cart.service.js";
import { emailService } from "../email/email.service.js";
import type { AdminOrdersQuery, CheckoutInput } from "./orders.schema.js";

const orderInclude = {
  user: { select: { id: true, firstName: true, lastName: true, email: true } },
  items: { include: { product: { select: { id: true, name: true, slug: true, images: { where: { isPrimary: true }, take: 1 } } } } },
  payments: {
    select: {
      id: true, provider: true, providerPaymentId: true, providerPreferenceId: true,
      status: true, amount: true, currency: true, paidAt: true, createdAt: true, updatedAt: true,
    },
    orderBy: { createdAt: "desc" as const },
  },
};

const code = (prefix: string) => `${prefix}-${new Date().getFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`;

const resolveCart = async (userId: number | undefined, payload: CheckoutInput) => {
  if (userId) return cartService.getByUser(userId);
  if (!payload.items?.length) throw new ApiError(400, "El carrito esta vacio");
  return cartService.validateGuest(payload.items);
};

const resolveCustomer = async (userId: number | undefined, payload: CheckoutInput) => {
  if (!userId) {
    if (!payload.customer) throw new ApiError(400, "Nombre, email y telefono son requeridos");
    return payload.customer;
  }
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true, email: true } });
  if (!user) throw new ApiError(404, "Usuario no encontrado");
  const phone = payload.customer?.phone ?? payload.address?.phone;
  if (!phone) throw new ApiError(400, "El telefono es requerido");
  return { name: `${user.firstName} ${user.lastName}`, email: user.email, phone };
};

const calculate = async (userId: number | undefined, payload: CheckoutInput) => {
  const cart = await resolveCart(userId, payload);
  if (cart.items.length === 0) throw new ApiError(400, "El carrito esta vacio");
  const customer = await resolveCustomer(userId, payload);
  const subtotal = Number(cart.summary.subtotal.toFixed(2));
  const shippingCost = payload.deliveryMethod === DeliveryMethod.SHIPPING ? env.DEFAULT_SHIPPING_COST : 0;
  return {
    customer,
    deliveryMethod: payload.deliveryMethod,
    paymentMethod: payload.paymentMethod,
    items: cart.items,
    summary: { subtotal, shippingCost, total: Number((subtotal + shippingCost).toFixed(2)) },
    ...(payload.deliveryMethod === DeliveryMethod.PICKUP ? { pickupAddress: env.PICKUP_ADDRESS } : {}),
  };
};

const decreaseStock = async (tx: Prisma.TransactionClient, items: Array<{ productId: number; quantity: number }>) => {
  for (const item of items) {
    const updated = await tx.product.updateMany({
      where: { id: item.productId, isActive: true, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } },
    });
    if (updated.count !== 1) throw new ApiError(409, `Stock insuficiente para productId ${item.productId}`);
  }
};

const checkout = async (userId: number | undefined, payload: CheckoutInput) => {
  const validated = await calculate(userId, payload);
  const created = await prisma.$transaction(async (tx) => {
    const isCash = payload.paymentMethod === PaymentMethod.CASH;
    const stockAlreadyReserved = Boolean(userId);
    if (isCash && !stockAlreadyReserved) await decreaseStock(tx, validated.items);
    const order = await tx.order.create({
      data: {
        orderNumber: code("ORD"),
        trackingCode: code("EL"),
        userId: userId ?? null,
        guestName: userId ? null : validated.customer.name,
        guestEmail: userId ? null : validated.customer.email,
        guestPhone: userId ? null : validated.customer.phone,
        status: isCash ? OrderStatus.CONFIRMED : OrderStatus.PENDING_PAYMENT,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: payload.paymentMethod,
        stockProcessedAt: isCash || stockAlreadyReserved ? new Date() : null,
        deliveryMethod: payload.deliveryMethod,
        subtotal: validated.summary.subtotal.toFixed(2),
        shippingCost: validated.summary.shippingCost.toFixed(2),
        total: validated.summary.total.toFixed(2),
        totalAmount: validated.summary.total.toFixed(2),
        notes: payload.notes ?? null,
        ...(payload.address && {
          shippingRecipient: payload.address.recipient,
          shippingPhone: payload.address.phone,
          shippingStreet: payload.address.street,
          shippingNumber: payload.address.number,
          shippingFloor: payload.address.floor ?? null,
          shippingApartment: payload.address.apartment ?? null,
          shippingCity: payload.address.city,
          shippingProvince: payload.address.province,
          shippingPostalCode: payload.address.postalCode,
          shippingReferences: payload.address.references ?? null,
        }),
        items: {
          create: validated.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productSlug: item.product.slug,
            productSku: item.product.sku,
            quantity: item.quantity,
            unitPrice: Number(item.product.price).toFixed(2),
            totalPrice: item.subtotal.toFixed(2),
          })),
        },
      },
      include: orderInclude,
    });
    if (userId) {
      const cart = await tx.cart.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" } });
      if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return order;
  });
  await emailService.safeSend(
    "order-confirmed",
    () => emailService.sendOrderConfirmedEmail(created),
    { orderId: created.id, to: created.guestEmail ?? created.user?.email ?? null },
  );
  return created;
};

const track = async (trackingCode: string) => {
  const order = await prisma.order.findUnique({ where: { trackingCode }, include: orderInclude });
  if (!order) throw new ApiError(404, "Pedido no encontrado");
  return {
    orderNumber: order.orderNumber, trackingCode: order.trackingCode, status: order.status,
    paymentMethod: order.paymentMethod, paymentStatus: order.paymentStatus, deliveryMethod: order.deliveryMethod, items: order.items,
    subtotal: order.subtotal, shippingCost: order.shippingCost, total: order.total, createdAt: order.createdAt,
    shipping: order.deliveryMethod === DeliveryMethod.SHIPPING ? { city: order.shippingCity, province: order.shippingProvince } : null,
    pickupAddress: order.deliveryMethod === DeliveryMethod.PICKUP ? env.PICKUP_ADDRESS : null,
  };
};

const listByUser = (userId: number) => prisma.order.findMany({ where: { userId }, include: orderInclude, orderBy: { createdAt: "desc" } });
const getById = async (userId: number, id: number) => {
  const order = await prisma.order.findFirst({ where: { id, userId }, include: orderInclude });
  if (!order) throw new ApiError(404, "Orden no encontrada");
  return order;
};
const listAdmin = (query: AdminOrdersQuery) => prisma.order.findMany({
  where: {
    ...(query.status && { status: query.status }), ...(query.deliveryMethod && { deliveryMethod: query.deliveryMethod }),
    ...((query.from || query.to) && { createdAt: { ...(query.from && { gte: query.from }), ...(query.to && { lte: query.to }) } }),
  },
  include: orderInclude, orderBy: { createdAt: "desc" },
});
const getAdminById = async (id: number) => {
  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });
  if (!order) throw new ApiError(404, "Orden no encontrada");
  return order;
};
const updateStatus = async (id: number, status: OrderStatus) => {
  const current = await getAdminById(id);
  const transitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
    PENDING_PAYMENT: [OrderStatus.CANCELLED],
    PAID: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
    CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
    PREPARING: [OrderStatus.READY_FOR_PICKUP, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    READY_FOR_PICKUP: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
    SHIPPED: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  };
  if (status !== current.status && !transitions[current.status]?.includes(status)) {
    throw new ApiError(409, `No se puede cambiar la orden de ${current.status} a ${status}`);
  }
  const updated = await prisma.$transaction(async (tx) => {
    if (status === OrderStatus.CANCELLED && current.stockProcessedAt && !current.stockRestoredAt) {
      for (const item of current.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
      }
      return tx.order.update({ where: { id }, data: { status, stockRestoredAt: new Date() }, include: orderInclude });
    }
    return tx.order.update({ where: { id }, data: { status }, include: orderInclude });
  });
  if (current.status !== updated.status && updated.status === OrderStatus.READY_FOR_PICKUP) {
    await emailService.safeSend(
      "order-ready-for-pickup",
      () => emailService.sendOrderReadyForPickupEmail(updated),
      { orderId: updated.id, to: updated.guestEmail ?? updated.user?.email ?? null },
    );
  }
  if (current.status !== updated.status && updated.status === OrderStatus.SHIPPED) {
    await emailService.safeSend(
      "order-shipped",
      () => emailService.sendOrderShippedEmail(updated),
      { orderId: updated.id, to: updated.guestEmail ?? updated.user?.email ?? null },
    );
  }
  return updated;
};

export const ordersService = { calculate, checkout, track, listByUser, getById, listAdmin, getAdminById, updateStatus };
