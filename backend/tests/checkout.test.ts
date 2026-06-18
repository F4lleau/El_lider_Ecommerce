import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus, UserRole } from "@prisma/client";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashValue } from "../src/utils/hash.js";
import { signToken } from "../src/utils/jwt.js";

const marker = `checkout-test-${Date.now()}`;
let baseUrl = "";
let closeServer: (() => Promise<void>) | undefined;
let userToken = "";
let otherToken = "";
let adminToken = "";
let productId = 0;
let inactiveProductId = 0;
let noStockProductId = 0;
let userId = 0;

const request = async (path: string, token?: string, init?: RequestInit) => {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers } });
  return { response, body: (await response.json()) as Record<string, unknown> };
};

const customer = { name: "Invitado Checkout", email: `${marker}-guest@example.com`, phone: "1112345678" };
const address = { recipient: "Invitado Checkout", phone: "1112345678", street: "Calle Test", number: "123", city: "Buenos Aires", province: "Buenos Aires", postalCode: "1000" };
const guestPayload = (deliveryMethod: DeliveryMethod, paymentMethod = PaymentMethod.MERCADOPAGO) => ({ deliveryMethod, paymentMethod, customer, items: [{ productId, quantity: 2 }], ...(deliveryMethod === DeliveryMethod.SHIPPING && { address }) });

before(async () => {
  const passwordHash = await hashValue("CheckoutPassword123!");
  const [user, other, admin, category] = await Promise.all([
    prisma.user.create({ data: { firstName: "Checkout", lastName: "User", email: `${marker}-user@example.com`, passwordHash, role: UserRole.USER } }),
    prisma.user.create({ data: { firstName: "Checkout", lastName: "Other", email: `${marker}-other@example.com`, passwordHash, role: UserRole.USER } }),
    prisma.user.create({ data: { firstName: "Checkout", lastName: "Admin", email: `${marker}-admin@example.com`, passwordHash, role: UserRole.ADMIN } }),
    prisma.category.create({ data: { name: marker, slug: marker } }),
  ]);
  const [product, inactive, noStock] = await Promise.all([
    prisma.product.create({ data: { name: `${marker}-product`, slug: `${marker}-product`, sku: `${marker}-SKU`.toUpperCase(), price: "125.50", stock: 20, categoryId: category.id } }),
    prisma.product.create({ data: { name: `${marker}-inactive`, slug: `${marker}-inactive`, price: "50.00", stock: 10, isActive: false, categoryId: category.id } }),
    prisma.product.create({ data: { name: `${marker}-empty`, slug: `${marker}-empty`, price: "70.00", stock: 0, categoryId: category.id } }),
  ]);
  userId = user.id; productId = product.id; inactiveProductId = inactive.id; noStockProductId = noStock.id;
  userToken = signToken({ sub: String(user.id), email: user.email, role: user.role });
  otherToken = signToken({ sub: String(other.id), email: other.email, role: other.role });
  adminToken = signToken({ sub: String(admin.id), email: admin.email, role: admin.role });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const info = server.address();
  if (!info || typeof info === "string") throw new Error("No se pudo iniciar servidor");
  baseUrl = `http://127.0.0.1:${info.port}`;
  closeServer = () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

after(async () => {
  await prisma.order.deleteMany({ where: { OR: [{ guestEmail: { contains: marker } }, { user: { email: { startsWith: marker } } }] } });
  await prisma.cart.deleteMany({ where: { user: { email: { startsWith: marker } } } });
  await prisma.product.deleteMany({ where: { slug: { startsWith: marker } } });
  await prisma.category.deleteMany({ where: { slug: marker } });
  await prisma.user.deleteMany({ where: { email: { startsWith: marker } } });
  await prisma.$disconnect();
  await closeServer?.();
});

const addAuthenticatedItem = () => request("/api/cart/items", userToken, { method: "POST", body: JSON.stringify({ productId, quantity: 2 }) });

describe("checkout invitado", () => {
  test("crea retiro con totales backend, snapshot y sin descontar stock", async () => {
    const beforeStock = (await prisma.product.findUniqueOrThrow({ where: { id: productId } })).stock;
    const result = await request("/api/checkout", undefined, { method: "POST", body: JSON.stringify(guestPayload(DeliveryMethod.PICKUP)) });
    assert.equal(result.response.status, 201);
    const order = result.body.data as { status: string; paymentStatus: string; paymentMethod: string; shippingCost: string; subtotal: string; total: string; orderNumber: string; trackingCode: string; items: Array<{ productName: string; productSlug: string; productSku: string | null }> };
    assert.equal(order.status, OrderStatus.PENDING_PAYMENT);
    assert.equal(order.paymentStatus, PaymentStatus.PENDING);
    assert.equal(order.paymentMethod, PaymentMethod.MERCADOPAGO);
    assert.equal(Number(order.shippingCost), 0);
    assert.equal(Number(order.subtotal), 251);
    assert.equal(Number(order.total), 251);
    assert.ok(order.orderNumber && order.trackingCode);
    assert.equal(order.items[0]?.productName, `${marker}-product`);
    assert.equal(order.items[0]?.productSku, `${marker}-SKU`.toUpperCase());
    assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: productId } })).stock, beforeStock);
  });

  test("crea envio con costo discriminado y direccion", async () => {
    const result = await request("/api/checkout", undefined, { method: "POST", body: JSON.stringify(guestPayload(DeliveryMethod.SHIPPING)) });
    assert.equal(result.response.status, 201);
    const order = result.body.data as { shippingCost: string; total: string; shippingCity: string };
    assert.ok(Number(order.shippingCost) > 0);
    assert.equal(Number(order.total), 251 + Number(order.shippingCost));
    assert.equal(order.shippingCity, "Buenos Aires");
  });

  test("crea orden CASH pickup y descuenta stock", async () => {
    const beforeStock = (await prisma.product.findUniqueOrThrow({ where: { id: productId } })).stock;
    const result = await request("/api/checkout", undefined, { method: "POST", body: JSON.stringify(guestPayload(DeliveryMethod.PICKUP, PaymentMethod.CASH)) });
    assert.equal(result.response.status, 201);
    const order = result.body.data as { status: string; paymentMethod: string; paymentStatus: string; shippingCost: string };
    assert.equal(order.status, OrderStatus.CONFIRMED);
    assert.equal(order.paymentMethod, PaymentMethod.CASH);
    assert.equal(order.paymentStatus, PaymentStatus.PENDING);
    assert.equal(Number(order.shippingCost), 0);
    assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: productId } })).stock, beforeStock - 2);
  });

  test("crea orden CASH shipping con costo de envio", async () => {
    const result = await request("/api/checkout", undefined, { method: "POST", body: JSON.stringify(guestPayload(DeliveryMethod.SHIPPING, PaymentMethod.CASH)) });
    assert.equal(result.response.status, 201);
    const order = result.body.data as { status: string; paymentMethod: string; shippingCost: string; total: string };
    assert.equal(order.status, OrderStatus.CONFIRMED);
    assert.equal(order.paymentMethod, PaymentMethod.CASH);
    assert.ok(Number(order.shippingCost) > 0);
    assert.equal(Number(order.total), 251 + Number(order.shippingCost));
  });
});

describe("checkout autenticado", () => {
  test("crea retiro asociado y vacia carrito", async () => {
    await addAuthenticatedItem();
    const result = await request("/api/checkout", userToken, { method: "POST", body: JSON.stringify({ deliveryMethod: DeliveryMethod.PICKUP, paymentMethod: PaymentMethod.MERCADOPAGO, customer: { phone: "1112345678", name: "ignorado", email: "ignored@example.com" } }) });
    assert.equal(result.response.status, 201);
    assert.equal((result.body.data as { userId: number }).userId, userId);
    const cart = await request("/api/cart", userToken);
    assert.equal((cart.body.data as { items: unknown[] }).items.length, 0);
  });

  test("crea envio asociado", async () => {
    await addAuthenticatedItem();
    const result = await request("/api/checkout", userToken, { method: "POST", body: JSON.stringify({ deliveryMethod: DeliveryMethod.SHIPPING, paymentMethod: PaymentMethod.MERCADOPAGO, customer: { phone: "1112345678", name: "ignorado", email: "ignored@example.com" }, address }) });
    assert.equal(result.response.status, 201);
    assert.equal((result.body.data as { deliveryMethod: string }).deliveryMethod, DeliveryMethod.SHIPPING);
  });
});

describe("validaciones, tracking y permisos", () => {
  test("rechaza carrito vacio, envio sin direccion y productos invalidos", async () => {
    assert.equal((await request("/api/checkout", undefined, { method: "POST", body: JSON.stringify({ deliveryMethod: "PICKUP", customer, items: [] }) })).response.status, 400);
    assert.equal((await request("/api/checkout", undefined, { method: "POST", body: JSON.stringify({ deliveryMethod: "SHIPPING", customer, items: [{ productId, quantity: 1 }] }) })).response.status, 400);
    for (const [invalidId, status] of [[999999999, 404], [inactiveProductId, 404], [noStockProductId, 409], [productId, 409]] as const) {
      const quantity = invalidId === productId ? 21 : 1;
      const result = await request("/api/checkout/validate", undefined, { method: "POST", body: JSON.stringify({ deliveryMethod: "PICKUP", customer, items: [{ productId: invalidId, quantity }] }) });
      assert.equal(result.response.status, status);
    }
  });

  test("tracking publico, pedidos propios y bloqueo de pedido ajeno", async () => {
    const created = await request("/api/checkout", undefined, { method: "POST", body: JSON.stringify(guestPayload(DeliveryMethod.PICKUP)) });
    const trackingCode = (created.body.data as { trackingCode: string }).trackingCode;
    const tracked = await request(`/api/orders/track/${trackingCode}`);
    assert.equal(tracked.response.status, 200);
    assert.equal("guestEmail" in (tracked.body.data as object), false);

    const mine = await request("/api/me/orders", userToken);
    assert.equal(mine.response.status, 200);
    const own = (mine.body.data as Array<{ id: number }>)[0];
    assert.ok(own);
    assert.equal((await request(`/api/me/orders/${own.id}`, otherToken)).response.status, 404);
  });

  test("admin lista y cambia estado; usuario comun no accede", async () => {
    assert.equal((await request("/api/admin/orders", userToken)).response.status, 403);
    const listed = await request("/api/admin/orders?deliveryMethod=PICKUP", adminToken);
    assert.equal(listed.response.status, 200);
    const order = (listed.body.data as Array<{ id: number }>)[0];
    assert.ok(order);
    const updated = await request(`/api/admin/orders/${order.id}/status`, adminToken, { method: "PATCH", body: JSON.stringify({ status: OrderStatus.CANCELLED }) });
    assert.equal((updated.body.data as { status: string }).status, OrderStatus.CANCELLED);
  });
});
