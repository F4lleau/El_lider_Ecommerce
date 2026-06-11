import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { UserRole } from "@prisma/client";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashValue } from "../src/utils/hash.js";
import { signToken } from "../src/utils/jwt.js";

const marker = `cart-test-${Date.now()}`;
let baseUrl = "";
let closeServer: (() => Promise<void>) | undefined;
let userToken = "";
let otherToken = "";
let activeProductId = 0;
let inactiveProductId = 0;
let noStockProductId = 0;

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

const itemsOf = (body: Record<string, unknown>) =>
  (body.data as { items: Array<{ id: number; productId: number; quantity: number; subtotal: number }> }).items;

before(async () => {
  const passwordHash = await hashValue("CartPassword123!");
  const [user, other, category] = await Promise.all([
    prisma.user.create({ data: { firstName: "Cart", lastName: "User", email: `${marker}-user@example.com`, passwordHash, role: UserRole.USER } }),
    prisma.user.create({ data: { firstName: "Other", lastName: "User", email: `${marker}-other@example.com`, passwordHash, role: UserRole.USER } }),
    prisma.category.create({ data: { name: marker, slug: marker } }),
  ]);
  const [active, inactive, noStock] = await Promise.all([
    prisma.product.create({ data: { name: `${marker}-active`, slug: `${marker}-active`, price: "125.50", stock: 10, isActive: true, categoryId: category.id } }),
    prisma.product.create({ data: { name: `${marker}-inactive`, slug: `${marker}-inactive`, price: "50.00", stock: 10, isActive: false, categoryId: category.id } }),
    prisma.product.create({ data: { name: `${marker}-empty`, slug: `${marker}-empty`, price: "75.00", stock: 0, isActive: true, categoryId: category.id } }),
  ]);
  activeProductId = active.id;
  inactiveProductId = inactive.id;
  noStockProductId = noStock.id;
  userToken = signToken({ sub: String(user.id), email: user.email, role: user.role });
  otherToken = signToken({ sub: String(other.id), email: other.email, role: other.role });

  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No se pudo iniciar el servidor de test");
  baseUrl = `http://127.0.0.1:${address.port}`;
  closeServer = () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

after(async () => {
  await prisma.user.deleteMany({ where: { email: { startsWith: marker } } });
  await prisma.product.deleteMany({ where: { slug: { startsWith: marker } } });
  await prisma.category.deleteMany({ where: { slug: marker } });
  await prisma.$disconnect();
  await closeServer?.();
});

describe("public cart validation", () => {
  test("GET /cart sin token responde 401", async () => {
    assert.equal((await request("/api/cart")).response.status, 401);
    const sync = await request("/api/cart/sync", undefined, {
      method: "POST",
      body: JSON.stringify({ items: [] }),
    });
    assert.equal(sync.response.status, 401);
  });

  test("valida items y recalcula subtotal con precio backend", async () => {
    const result = await request("/api/cart/validate", undefined, {
      method: "POST",
      body: JSON.stringify({ items: [{ productId: activeProductId, quantity: 2 }] }),
    });
    assert.equal(result.response.status, 200);
    const data = result.body.data as { summary: { subtotal: number }; items: Array<{ subtotal: number }> };
    assert.equal(data.summary.subtotal, 251);
    assert.equal(data.items[0]?.subtotal, 251);
  });

  test("rechaza producto inexistente, inactivo y sin stock", async () => {
    for (const [productId, status] of [[999999999, 404], [inactiveProductId, 404], [noStockProductId, 409]]) {
      const result = await request("/api/cart/validate", undefined, {
        method: "POST",
        body: JSON.stringify({ items: [{ productId, quantity: 1 }] }),
      });
      assert.equal(result.response.status, status);
    }
  });
});

describe("authenticated cart management", () => {
  test("agrega producto y rechaza stock inválido", async () => {
    const added = await request("/api/cart/items", userToken, {
      method: "POST",
      body: JSON.stringify({ productId: activeProductId, quantity: 2 }),
    });
    assert.equal(added.response.status, 200);
    assert.equal(itemsOf(added.body)[0]?.quantity, 2);

    const noStock = await request("/api/cart/items", userToken, {
      method: "POST",
      body: JSON.stringify({ productId: noStockProductId, quantity: 1 }),
    });
    assert.equal(noStock.response.status, 409);

    for (const productId of [999999999, inactiveProductId]) {
      const invalid = await request("/api/cart/items", userToken, {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      assert.equal(invalid.response.status, 404);
    }
  });

  test("actualiza cantidad y evita acceso a carrito ajeno", async () => {
    const current = await request("/api/cart", userToken);
    const itemId = itemsOf(current.body)[0]?.id;
    assert.ok(itemId);

    const forbidden = await request(`/api/cart/items/${itemId}`, otherToken, { method: "DELETE" });
    assert.equal(forbidden.response.status, 404);

    const updated = await request(`/api/cart/items/${itemId}`, userToken, {
      method: "PATCH",
      body: JSON.stringify({ quantity: 3 }),
    });
    assert.equal(updated.response.status, 200);
    assert.equal(itemsOf(updated.body)[0]?.quantity, 3);
  });

  test("sincroniza sumando cantidades sin duplicar", async () => {
    const synced = await request("/api/cart/sync", userToken, {
      method: "POST",
      body: JSON.stringify({ items: [{ productId: activeProductId, quantity: 2 }] }),
    });
    assert.equal(synced.response.status, 200);
    assert.equal(itemsOf(synced.body).length, 1);
    assert.equal(itemsOf(synced.body)[0]?.quantity, 5);
  });

  test("elimina item y vacía carrito", async () => {
    const current = await request("/api/cart", userToken);
    const itemId = itemsOf(current.body)[0]?.id;
    assert.ok(itemId);
    const removed = await request(`/api/cart/items/${itemId}`, userToken, { method: "DELETE" });
    assert.equal(itemsOf(removed.body).length, 0);

    await request("/api/cart/items", userToken, {
      method: "POST",
      body: JSON.stringify({ productId: activeProductId, quantity: 1 }),
    });
    const cleared = await request("/api/cart", userToken, { method: "DELETE" });
    assert.equal(cleared.response.status, 200);
    assert.equal(itemsOf(cleared.body).length, 0);
  });
});
