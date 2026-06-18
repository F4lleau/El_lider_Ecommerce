import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { createHmac } from "node:crypto";
import { OrderStatus, PaymentMethod, PaymentStatus, UserRole } from "@prisma/client";
import { app } from "../src/app.js";
import { signToken } from "../src/utils/jwt.js";
import { hashValue } from "../src/utils/hash.js";
import { validateWebhookSignature } from "../src/modules/payments/webhook-signature.js";
import { prisma } from "../src/lib/prisma.js";
import { resetMercadoPagoGatewayForTests, setMercadoPagoGatewayForTests, type ProviderPayment } from "../src/modules/payments/mercadopago.gateway.js";
import { paymentsService } from "../src/modules/payments/payments.service.js";

const marker = `payment-test-${Date.now()}`;
let orderId = 0;
let productId = 0;
let providerStatus = "pending";
let userToken = "";
let otherToken = "";
let baseUrl = "";
let closeServer: (() => Promise<void>) | undefined;

const providerPayment = (): ProviderPayment => ({
  id: `${marker}-provider-payment`,
  status: providerStatus,
  externalReference: String(orderId),
  amount: 200,
  currency: "ARS",
  paidAt: providerStatus === "approved" ? new Date() : null,
  raw: { id: `${marker}-provider-payment`, status: providerStatus, secret: "not-public" },
});

before(async () => {
  const passwordHash = await hashValue("PaymentPassword123!");
  const [user, other, category] = await Promise.all([
    prisma.user.create({ data: { firstName: "Payment", lastName: "User", email: `${marker}-user@example.com`, passwordHash, role: UserRole.USER } }),
    prisma.user.create({ data: { firstName: "Payment", lastName: "Other", email: `${marker}-other@example.com`, passwordHash, role: UserRole.USER } }),
    prisma.category.create({ data: { name: marker, slug: marker } }),
  ]);
  userToken = signToken({ sub: String(user.id), email: user.email, role: user.role });
  otherToken = signToken({ sub: String(other.id), email: other.email, role: other.role });
  const product = await prisma.product.create({ data: { name: marker, slug: marker, price: "100", stock: 10, categoryId: category.id } });
  productId = product.id;
  const order = await prisma.order.create({
    data: {
      orderNumber: `${marker}-order`,
      trackingCode: `${marker}-tracking`,
      guestName: "Pago Test",
      guestEmail: `${marker}@example.com`,
      guestPhone: "1112345678",
      paymentMethod: PaymentMethod.MERCADOPAGO,
      subtotal: "200",
      total: "200",
      totalAmount: "200",
      items: { create: { productId, productName: marker, productSlug: marker, quantity: 2, unitPrice: "100", totalPrice: "200" } },
    },
  });
  orderId = order.id;
  setMercadoPagoGatewayForTests({
    createPreference: async (input) => ({
      id: `${marker}-preference-${Date.now()}`,
      initPoint: "https://www.mercadopago.com.ar/checkout/test",
      sandboxInitPoint: "https://sandbox.mercadopago.com.ar/checkout/test",
      raw: { external_reference: String(input.orderId) },
    }),
    getPayment: async () => providerPayment(),
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No se pudo iniciar servidor");
  baseUrl = `http://127.0.0.1:${address.port}`;
  closeServer = () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

after(async () => {
  resetMercadoPagoGatewayForTests();
  await prisma.order.deleteMany({ where: { orderNumber: { startsWith: marker } } });
  await prisma.product.deleteMany({ where: { slug: marker } });
  await prisma.category.deleteMany({ where: { slug: marker } });
  await prisma.user.deleteMany({ where: { email: { startsWith: marker } } });
  await prisma.$disconnect();
  await closeServer?.();
});

const request = async (path: string, token?: string, init?: RequestInit) => {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers } });
  return { response, body: (await response.json()) as Record<string, unknown> };
};

describe("preferencia Mercado Pago", () => {
  test("usa la orden existente y guarda preferencia", async () => {
    const result = await paymentsService.createPreference({ orderId, trackingCode: `${marker}-tracking`, email: `${marker}@example.com` }, undefined);
    assert.ok(result.preferenceId);
    assert.match(result.initPoint ?? "", /mercadopago/);
    const payment = await prisma.payment.findUniqueOrThrow({ where: { providerPreferenceId: result.preferenceId } });
    assert.equal(Number(payment.amount), 200);
    assert.equal(payment.status, PaymentStatus.PENDING);
  });

  test("rechaza orden inexistente y orden pagada", async () => {
    await assert.rejects(() => paymentsService.createPreference({ orderId: 999999999 }, undefined), /Orden no encontrada/);
    await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: PaymentStatus.APPROVED } });
    await assert.rejects(() => paymentsService.createPreference({ orderId, trackingCode: `${marker}-tracking`, email: `${marker}@example.com` }, undefined), /ya esta pagada/);
    await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: PaymentStatus.PENDING } });
  });

  test("rechaza CASH, invitado sin credenciales y usuario ajeno", async () => {
    await assert.rejects(() => paymentsService.createPreference({ orderId }, undefined), /No autorizado/);
    const cash = await prisma.order.create({ data: { orderNumber: `${marker}-cash`, trackingCode: `${marker}-cash-track`, paymentMethod: PaymentMethod.CASH, status: OrderStatus.CONFIRMED, guestEmail: `${marker}-cash@example.com`, subtotal: "100", total: "100", totalAmount: "100", items: { create: { productId, productName: marker, productSlug: marker, quantity: 1, unitPrice: "100", totalPrice: "100" } } } });
    await assert.rejects(() => paymentsService.createPreference({ orderId: cash.id, trackingCode: cash.trackingCode, email: `${marker}-cash@example.com` }, undefined), /no usa Mercado Pago/);
    const own = await prisma.order.create({ data: { orderNumber: `${marker}-own`, trackingCode: `${marker}-own-track`, paymentMethod: PaymentMethod.MERCADOPAGO, user: { connect: { email: `${marker}-user@example.com` } }, subtotal: "100", total: "100", totalAmount: "100", items: { create: { productId, productName: marker, productSlug: marker, quantity: 1, unitPrice: "100", totalPrice: "100" } } } });
    assert.equal((await request("/api/payments/mercadopago/preference", otherToken, { method: "POST", body: JSON.stringify({ orderId: own.id }) })).response.status, 403);
    assert.equal((await request("/api/payments/mercadopago/preference", userToken, { method: "POST", body: JSON.stringify({ orderId: own.id }) })).response.status, 201);
  });
});

describe("webhook e idempotencia", () => {
  test("mapea pending y rejected sin cambiar orden a pagada", async () => {
    providerStatus = "pending";
    await paymentsService.processWebhook("payment", providerPayment().id);
    assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: orderId } })).status, OrderStatus.PENDING_PAYMENT);
    providerStatus = "rejected";
    await paymentsService.processWebhook("payment", providerPayment().id);
    assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: orderId } })).paymentStatus, PaymentStatus.REJECTED);
  });

  test("approved descuenta stock una sola vez y actualiza orden", async () => {
    providerStatus = "approved";
    await paymentsService.processWebhook("payment", providerPayment().id);
    await paymentsService.processWebhook("payment", providerPayment().id);
    const [order, product, payments] = await Promise.all([
      prisma.order.findUniqueOrThrow({ where: { id: orderId } }),
      prisma.product.findUniqueOrThrow({ where: { id: productId } }),
      prisma.payment.findMany({ where: { providerPaymentId: providerPayment().id } }),
    ]);
    assert.equal(order.status, OrderStatus.PAID);
    assert.equal(order.paymentStatus, PaymentStatus.APPROVED);
    assert.equal(product.stock, 8);
    assert.equal(payments.length, 1);
  });

  test("respuesta publica de pago no expone rawResponse", async () => {
    const status = await paymentsService.getByOrder(orderId, { trackingCode: `${marker}-tracking` }, undefined);
    assert.equal(status.paymentStatus, PaymentStatus.APPROVED);
    assert.equal("rawResponse" in (status.payment ?? {}), false);
  });

  test("firma webhook se valida cuando hay secret", () => {
    const previous = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    process.env.MERCADOPAGO_WEBHOOK_SECRET = "secret-test";
    const paymentId = "123";
    const requestId = "req-1";
    const ts = "1700000000";
    const v1 = createHmac("sha256", "secret-test").update(`id:${paymentId};request-id:${requestId};ts:${ts};`).digest("hex");
    assert.doesNotThrow(() => validateWebhookSignature(`ts=${ts},v1=${v1}`, requestId, paymentId));
    assert.throws(() => validateWebhookSignature(`ts=${ts},v1=bad`, requestId, paymentId));
    process.env.MERCADOPAGO_WEBHOOK_SECRET = previous;
  });
});
