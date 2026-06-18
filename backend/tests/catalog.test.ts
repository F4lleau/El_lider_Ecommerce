import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { UserRole } from "@prisma/client";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashValue } from "../src/utils/hash.js";
import { signToken } from "../src/utils/jwt.js";

const marker = `catalog-test-${Date.now()}`;
let baseUrl = "";
let closeServer: (() => Promise<void>) | undefined;
let adminToken = "";
let userToken = "";
let categoryId = 0;
let productId = 0;
let emptyProductId = 0;

const request = async (path: string, token?: string, init?: RequestInit) => {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers } });
  return { response, body: (await response.json()) as Record<string, unknown> };
};

before(async () => {
  const passwordHash = await hashValue("CatalogPassword123!");
  const [admin, user, category] = await Promise.all([
    prisma.user.create({ data: { firstName: "Catalog", lastName: "Admin", email: `${marker}-admin@example.com`, passwordHash, role: UserRole.ADMIN } }),
    prisma.user.create({ data: { firstName: "Catalog", lastName: "User", email: `${marker}-user@example.com`, passwordHash, role: UserRole.USER } }),
    prisma.category.create({ data: { name: marker, slug: marker } }),
  ]);
  const [product, empty] = await Promise.all([
    prisma.product.create({ data: { name: `${marker}-product`, slug: `${marker}-product`, sku: `${marker}-SKU`.toUpperCase(), price: "100.00", stock: 10, isFeatured: true, isOffer: true, isNew: true, categoryId: category.id } }),
    prisma.product.create({ data: { name: `${marker}-empty`, slug: `${marker}-empty`, price: "200.00", stock: 0, categoryId: category.id } }),
  ]);
  await prisma.order.create({ data: { userId: user.id, status: "COMPLETED", totalAmount: "300.00", items: { create: { productId: product.id, quantity: 3, unitPrice: "100.00", totalPrice: "300.00" } } } });
  categoryId = category.id;
  productId = product.id;
  emptyProductId = empty.id;
  adminToken = signToken({ sub: String(admin.id), email: admin.email, role: admin.role });
  userToken = signToken({ sub: String(user.id), email: user.email, role: user.role });
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
  await prisma.cart.deleteMany({ where: { user: { email: { startsWith: marker } } } });
  await prisma.product.deleteMany({ where: { slug: { startsWith: marker } } });
  await prisma.category.deleteMany({ where: { slug: { startsWith: marker } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: marker } } });
  await prisma.$disconnect();
  await closeServer?.();
});

describe("catalogo publico", () => {
  test("lista productos, categorias, flags y mas vendidos", async () => {
    for (const path of ["/api/products", "/api/products/offers", "/api/products/featured", "/api/products/new", "/api/categories"]) {
      assert.equal((await request(path)).response.status, 200);
    }
    const best = await request("/api/products/best-sellers");
    assert.equal(best.response.status, 200);
    assert.equal(((best.body.data as Array<{ id: number }>)[0]?.id), productId);
    const listed = await request("/api/products");
    assert.equal((listed.body.data as Array<{ id: number; sku: string | null }>).find((item) => item.id === productId)?.sku, `${marker}-SKU`.toUpperCase());
  });
});

describe("ABM admin", () => {
  test("bloquea usuario comun y permite crear/editar producto, precio y stock", async () => {
    assert.equal((await request("/api/admin/products", userToken)).response.status, 403);
    const created = await request("/api/admin/products", adminToken, { method: "POST", body: JSON.stringify({ name: `${marker}-created`, price: 500, stock: 4, categoryId }) });
    assert.equal(created.response.status, 201);
    const id = (created.body.data as { id: number }).id;
    assert.equal((await request(`/api/admin/products/${id}`, adminToken, { method: "PATCH", body: JSON.stringify({ name: `${marker}-updated` }) })).response.status, 200);
    assert.equal((await request(`/api/admin/products/${id}/price`, adminToken, { method: "PATCH", body: JSON.stringify({ price: 450, compareAtPrice: 500, isOffer: true }) })).response.status, 200);
    assert.equal((await request(`/api/admin/products/${id}/stock`, adminToken, { method: "PATCH", body: JSON.stringify({ stock: 8 }) })).response.status, 200);
    const removed = await request(`/api/admin/products/${id}`, adminToken, { method: "DELETE" });
    assert.equal((removed.body.data as { isActive: boolean }).isActive, false);
  });

  test("crea, normaliza, edita, busca y rechaza SKU duplicado", async () => {
    const sku = `${marker}-sku-created`;
    const created = await request("/api/admin/products", adminToken, { method: "POST", body: JSON.stringify({ name: `${marker}-sku-product`, sku: ` ${sku} `, price: 500, stock: 4, categoryId }) });
    assert.equal(created.response.status, 201);
    const product = created.body.data as { id: number; sku: string };
    assert.equal(product.sku, sku.toUpperCase());
    const duplicate = await request("/api/admin/products", adminToken, { method: "POST", body: JSON.stringify({ name: `${marker}-duplicate`, sku, price: 500, stock: 4, categoryId }) });
    assert.equal(duplicate.response.status, 409);
    const editedSku = `${marker}-sku-edited`.toUpperCase();
    const edited = await request(`/api/admin/products/${product.id}`, adminToken, { method: "PATCH", body: JSON.stringify({ sku: editedSku }) });
    assert.equal((edited.body.data as { sku: string }).sku, editedSku);
    const search = await request(`/api/admin/products?q=${encodeURIComponent(editedSku)}`, adminToken);
    assert.equal((search.body.data as Array<{ id: number }>)[0]?.id, product.id);
  });

  test("crea y edita categoria", async () => {
    const created = await request("/api/admin/categories", adminToken, { method: "POST", body: JSON.stringify({ name: `${marker}-category` }) });
    assert.equal(created.response.status, 201);
    const id = (created.body.data as { id: number }).id;
    assert.equal((await request(`/api/admin/categories/${id}`, adminToken, { method: "PATCH", body: JSON.stringify({ description: "Actualizada" }) })).response.status, 200);
  });
});

describe("solicitudes de stock", () => {
  test("crea solicitud invitado y evita duplicado", async () => {
    const payload = { name: "Invitado Test", email: `${marker}-guest@example.com`, phone: "1112345678" };
    assert.equal((await request(`/api/products/${emptyProductId}/stock-requests`, undefined, { method: "POST", body: JSON.stringify(payload) })).response.status, 201);
    assert.equal((await request(`/api/products/${emptyProductId}/stock-requests`, undefined, { method: "POST", body: JSON.stringify(payload) })).response.status, 409);
  });

  test("usuario crea y lista sus solicitudes; admin lista todas", async () => {
    assert.equal((await request(`/api/products/${emptyProductId}/stock-requests`, userToken, { method: "POST", body: "{}" })).response.status, 201);
    const mine = await request("/api/me/stock-requests", userToken);
    assert.equal(mine.response.status, 200);
    assert.ok((mine.body.data as unknown[]).length > 0);
    assert.equal((await request("/api/admin/stock-requests", adminToken)).response.status, 200);
  });
});
