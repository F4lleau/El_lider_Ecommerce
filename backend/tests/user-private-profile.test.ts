import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus, StockRequestStatus, UserRole } from "@prisma/client";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashValue } from "../src/utils/hash.js";
import { signToken } from "../src/utils/jwt.js";

const marker = `profile-test-${Date.now()}`;
let baseUrl = "";
let closeServer: (() => Promise<void>) | undefined;
let userToken = "";
let otherToken = "";
let userId = 0;
let otherUserId = 0;
let ownOrderId = 0;
let otherOrderId = 0;
let ownStockRequestId = 0;
let otherStockRequestId = 0;

const request = async (path: string, token?: string, init?: RequestInit) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  return { response, body: (await response.json()) as Record<string, unknown> };
};

before(async () => {
  const passwordHash = await hashValue("ProfilePassword123!");
  const [user, other, category] = await Promise.all([
    prisma.user.create({ data: { firstName: "Profile", lastName: "User", email: `${marker}-user@example.com`, passwordHash, role: UserRole.USER } }),
    prisma.user.create({ data: { firstName: "Profile", lastName: "Other", email: `${marker}-other@example.com`, passwordHash, role: UserRole.USER } }),
    prisma.category.create({ data: { name: marker, slug: marker } }),
  ]);
  const product = await prisma.product.create({
    data: { name: `${marker}-product`, slug: `${marker}-product`, sku: `${marker}-SKU`.toUpperCase(), price: "100.00", stock: 0, categoryId: category.id },
  });

  const [ownOrder, otherOrder] = await Promise.all([
    prisma.order.create({
      data: {
        userId: user.id,
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.CASH,
        deliveryMethod: DeliveryMethod.PICKUP,
        subtotal: "100.00",
        shippingCost: "0.00",
        total: "100.00",
        totalAmount: "100.00",
        items: { create: { productId: product.id, productName: product.name, productSlug: product.slug, productSku: product.sku, quantity: 1, unitPrice: "100.00", totalPrice: "100.00" } },
      },
    }),
    prisma.order.create({
      data: {
        userId: other.id,
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.CASH,
        deliveryMethod: DeliveryMethod.PICKUP,
        subtotal: "100.00",
        shippingCost: "0.00",
        total: "100.00",
        totalAmount: "100.00",
        items: { create: { productId: product.id, productName: product.name, productSlug: product.slug, productSku: product.sku, quantity: 1, unitPrice: "100.00", totalPrice: "100.00" } },
      },
    }),
  ]);

  const [ownRequest, otherRequest] = await Promise.all([
    prisma.stockRequest.create({ data: { productId: product.id, userId: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`, status: StockRequestStatus.PENDING } }),
    prisma.stockRequest.create({ data: { productId: product.id, userId: other.id, email: other.email, name: `${other.firstName} ${other.lastName}`, status: StockRequestStatus.PENDING } }),
  ]);

  userId = user.id;
  otherUserId = other.id;
  ownOrderId = ownOrder.id;
  otherOrderId = otherOrder.id;
  ownStockRequestId = ownRequest.id;
  otherStockRequestId = otherRequest.id;
  userToken = signToken({ sub: String(user.id), email: user.email, role: user.role });
  otherToken = signToken({ sub: String(other.id), email: other.email, role: other.role });

  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No se pudo iniciar servidor de test");
  baseUrl = `http://127.0.0.1:${address.port}`;
  closeServer = () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

after(async () => {
  await prisma.stockRequest.deleteMany({ where: { email: { contains: marker } } });
  await prisma.order.deleteMany({ where: { user: { email: { startsWith: marker } } } });
  await prisma.address.deleteMany({ where: { user: { email: { startsWith: marker } } } });
  await prisma.product.deleteMany({ where: { slug: { startsWith: marker } } });
  await prisma.category.deleteMany({ where: { slug: marker } });
  await prisma.user.deleteMany({ where: { email: { startsWith: marker } } });
  await prisma.$disconnect();
  await closeServer?.();
});

describe("perfil privado", () => {
  test("ve y edita perfil propio sin aceptar userId externo", async () => {
    const me = await request("/api/users/me", userToken);
    assert.equal(me.response.status, 200);
    assert.equal((me.body.data as { id: number }).id, userId);

    const updated = await request("/api/users/me", userToken, {
      method: "PATCH",
      body: JSON.stringify({ firstName: "Actualizado", lastName: "Propio", userId: otherUserId }),
    });
    assert.equal(updated.response.status, 200);
    assert.equal((updated.body.data as { id: number; firstName: string }).id, userId);
    assert.equal((updated.body.data as { firstName: string }).firstName, "Actualizado");
  });

  test("crea, edita, protege y marca direccion principal", async () => {
    const created = await request("/api/users/me/addresses", userToken, {
      method: "POST",
      body: JSON.stringify({ recipient: "Cliente Test", phone: "1112345678", street: "Calle", number: "123", city: "Ciudad", state: "Provincia", postalCode: "1000", isDefault: true }),
    });
    assert.equal(created.response.status, 201);
    const addressId = (created.body.data as { id: number; isDefault: boolean }).id;
    assert.equal((created.body.data as { isDefault: boolean }).isDefault, true);

    const second = await request("/api/users/me/addresses", userToken, {
      method: "POST",
      body: JSON.stringify({ recipient: "Cliente Test", street: "Otra", number: "456", city: "Ciudad", postalCode: "1001" }),
    });
    assert.equal(second.response.status, 201);
    const secondId = (second.body.data as { id: number }).id;

    const edited = await request(`/api/users/me/addresses/${addressId}`, userToken, {
      method: "PATCH",
      body: JSON.stringify({ label: "Casa", city: "Ciudad editada" }),
    });
    assert.equal(edited.response.status, 200);
    assert.equal((edited.body.data as { label: string }).label, "Casa");

    assert.equal((await request(`/api/users/me/addresses/${addressId}`, otherToken, { method: "PATCH", body: JSON.stringify({ label: "Ajena" }) })).response.status, 404);

    const defaulted = await request(`/api/users/me/addresses/${secondId}/default`, userToken, { method: "PATCH" });
    assert.equal(defaulted.response.status, 200);
    assert.equal((defaulted.body.data as { isDefault: boolean }).isDefault, true);
    const listed = await request("/api/users/me/addresses", userToken);
    assert.equal((listed.body.data as Array<{ isDefault: boolean }>).filter((address) => address.isDefault).length, 1);
  });

  test("lista pedidos propios y rechaza pedido ajeno", async () => {
    const listed = await request("/api/users/me/orders", userToken);
    assert.equal(listed.response.status, 200);
    assert.ok((listed.body.data as Array<{ id: number }>).some((order) => order.id === ownOrderId));
    assert.equal((listed.body.data as Array<{ id: number }>).some((order) => order.id === otherOrderId), false);

    assert.equal((await request(`/api/users/me/orders/${ownOrderId}`, userToken)).response.status, 200);
    assert.equal((await request(`/api/users/me/orders/${otherOrderId}`, userToken)).response.status, 404);
  });

  test("lista y cancela solicitudes propias, rechaza ajenas", async () => {
    const listed = await request("/api/users/me/stock-requests", userToken);
    assert.equal(listed.response.status, 200);
    assert.ok((listed.body.data as Array<{ id: number }>).some((stockRequest) => stockRequest.id === ownStockRequestId));
    assert.equal((listed.body.data as Array<{ id: number }>).some((stockRequest) => stockRequest.id === otherStockRequestId), false);

    const cancelled = await request(`/api/users/me/stock-requests/${ownStockRequestId}/cancel`, userToken, { method: "PATCH" });
    assert.equal(cancelled.response.status, 200);
    assert.equal((cancelled.body.data as { status: string }).status, StockRequestStatus.CANCELLED);
    assert.equal((await request(`/api/users/me/stock-requests/${otherStockRequestId}/cancel`, userToken, { method: "PATCH" })).response.status, 404);
  });
});
