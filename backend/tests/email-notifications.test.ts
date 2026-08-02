import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus, StockRequestStatus, UserRole } from "@prisma/client";
import { env } from "../src/config/env.js";
import { emailService, resetEmailSenderForTests, setEmailSenderForTests } from "../src/modules/email/email.service.js";
import { ordersService } from "../src/modules/orders/orders.service.js";
import { paymentsService } from "../src/modules/payments/payments.service.js";
import { stockRequestsService } from "../src/modules/stock-requests/stock-requests.service.js";
import { prisma } from "../src/lib/prisma.js";
import { hashValue } from "../src/utils/hash.js";

const marker = `email-test-${Date.now()}`;
const sentEmails: Array<{ to: string; subject: string; text: string }> = [];

let previousEmailEnabled = false;
let categoryId = 0;
let productId = 0;
let readyOrderId = 0;
let shippedOrderId = 0;
let paymentOrderId = 0;
let stockRequestId = 0;

const providerPayment = (orderId: number, idSuffix: string) => ({
  id: `${marker}-payment-${idSuffix}`,
  status: "approved",
  externalReference: String(orderId),
  amount: 100,
  currency: "ARS",
  paidAt: new Date(),
  raw: { id: `${marker}-payment-${idSuffix}`, status: "approved" },
});

const createOrder = (suffix: string, status = OrderStatus.CONFIRMED) =>
  prisma.order.create({
    data: {
      orderNumber: `${marker}-${suffix}`,
      trackingCode: `${marker}-${suffix}-track`,
      guestName: "Email Test",
      guestEmail: `${marker}-${suffix}@example.com`,
      guestPhone: "1112345678",
      status,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.CASH,
      deliveryMethod: DeliveryMethod.PICKUP,
      subtotal: "100.00",
      shippingCost: "0.00",
      total: "100.00",
      totalAmount: "100.00",
      items: { create: { productId, productName: `${marker}-product`, productSlug: `${marker}-product`, quantity: 1, unitPrice: "100.00", totalPrice: "100.00" } },
    },
  });

before(async () => {
  previousEmailEnabled = env.EMAIL_ENABLED;
  env.EMAIL_ENABLED = true;
  setEmailSenderForTests(async (payload) => {
    sentEmails.push({ to: payload.to, subject: payload.subject, text: payload.text });
    return { skipped: false, messageId: `email-test-${sentEmails.length}` };
  });

  const passwordHash = await hashValue("EmailPassword123!");
  const [category, user] = await Promise.all([
    prisma.category.create({ data: { name: marker, slug: marker } }),
    prisma.user.create({ data: { firstName: "Email", lastName: "User", email: `${marker}-user@example.com`, passwordHash, role: UserRole.USER } }),
  ]);
  categoryId = category.id;
  const product = await prisma.product.create({ data: { name: `${marker}-product`, slug: `${marker}-product`, price: "100.00", stock: 20, categoryId } });
  productId = product.id;

  const [readyOrder, shippedOrder, paymentOrder] = await Promise.all([
    createOrder("ready"),
    createOrder("shipped"),
    prisma.order.create({
      data: {
        orderNumber: `${marker}-payment-order`,
        trackingCode: `${marker}-payment-track`,
        userId: user.id,
        status: OrderStatus.PENDING_PAYMENT,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.MERCADOPAGO,
        deliveryMethod: DeliveryMethod.PICKUP,
        subtotal: "100.00",
        shippingCost: "0.00",
        total: "100.00",
        totalAmount: "100.00",
        items: { create: { productId, productName: product.name, productSlug: product.slug, quantity: 1, unitPrice: "100.00", totalPrice: "100.00" } },
      },
    }),
  ]);
  readyOrderId = readyOrder.id;
  shippedOrderId = shippedOrder.id;
  paymentOrderId = paymentOrder.id;

  const stockRequest = await prisma.stockRequest.create({
    data: { productId, email: `${marker}-stock@example.com`, name: "Stock User", phone: "1112345678", status: StockRequestStatus.PENDING },
  });
  stockRequestId = stockRequest.id;
});

after(async () => {
  env.EMAIL_ENABLED = previousEmailEnabled;
  resetEmailSenderForTests();
  await prisma.stockRequest.deleteMany({ where: { email: { contains: marker } } });
  await prisma.order.deleteMany({ where: { OR: [{ orderNumber: { startsWith: marker } }, { guestEmail: { contains: marker } }, { user: { email: { startsWith: marker } } }] } });
  await prisma.product.deleteMany({ where: { slug: `${marker}-product` } });
  await prisma.category.deleteMany({ where: { id: categoryId } });
  await prisma.user.deleteMany({ where: { email: { startsWith: marker } } });
  await prisma.$disconnect();
});

describe("email service configuration", () => {
  test("EMAIL_ENABLED=false no envia", async () => {
    const previous = env.EMAIL_ENABLED;
    env.EMAIL_ENABLED = false;
    sentEmails.length = 0;
    const result = await emailService.sendEmail({ to: "disabled@example.com", subject: "No enviar", text: "No enviar" });
    assert.equal(result.skipped, true);
    assert.equal(sentEmails.length, 0);
    env.EMAIL_ENABLED = previous;
  });
});

describe("order and stock notification triggers", () => {
  test("READY_FOR_PICKUP envia email una vez cuando cambia el estado", async () => {
    sentEmails.length = 0;
    await ordersService.updateStatus(readyOrderId, OrderStatus.PREPARING);
    await ordersService.updateStatus(readyOrderId, OrderStatus.READY_FOR_PICKUP);
    await ordersService.updateStatus(readyOrderId, OrderStatus.READY_FOR_PICKUP);
    assert.equal(sentEmails.filter((email) => email.subject.includes("listo para retirar")).length, 1);
  });

  test("SHIPPED envia email cuando cambia el estado", async () => {
    sentEmails.length = 0;
    await ordersService.updateStatus(shippedOrderId, OrderStatus.PREPARING);
    await ordersService.updateStatus(shippedOrderId, OrderStatus.SHIPPED);
    assert.equal(sentEmails.filter((email) => email.subject.includes("en camino")).length, 1);
  });

  test("stock request NOTIFIED envia email con producto", async () => {
    sentEmails.length = 0;
    await stockRequestsService.updateStatus(stockRequestId, StockRequestStatus.NOTIFIED);
    assert.equal(sentEmails.filter((email) => email.subject.includes("Producto nuevamente disponible")).length, 1);
    assert.match(sentEmails[0]?.text ?? "", new RegExp(`${marker}-product`));
  });
});

describe("email errors do not revert business flows", () => {
  test("error de email no revierte orden creada", async () => {
    setEmailSenderForTests(async () => {
      throw new Error("SMTP test failure");
    });
    const created = await ordersService.checkout(undefined, {
      deliveryMethod: DeliveryMethod.PICKUP,
      paymentMethod: PaymentMethod.CASH,
      customer: { name: "Email Failure", email: `${marker}-failure@example.com`, phone: "1112345678" },
      items: [{ productId, quantity: 1 }],
    });
    const saved = await prisma.order.findUnique({ where: { id: created.id } });
    assert.ok(saved);
    assert.equal(saved?.status, OrderStatus.CONFIRMED);
  });

  test("error de email no revierte pago aprobado", async () => {
    setEmailSenderForTests(async () => {
      throw new Error("SMTP test failure");
    });
    await paymentsService.processVerifiedPayment(providerPayment(paymentOrderId, "approved"));
    const [order, product] = await Promise.all([
      prisma.order.findUniqueOrThrow({ where: { id: paymentOrderId } }),
      prisma.product.findUniqueOrThrow({ where: { id: productId } }),
    ]);
    assert.equal(order.paymentStatus, PaymentStatus.APPROVED);
    assert.equal(order.status, OrderStatus.PAID);
    assert.equal(product.stock, 18);
  });
});
