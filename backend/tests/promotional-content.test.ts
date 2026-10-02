import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { UserRole } from "@prisma/client";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashValue } from "../src/utils/hash.js";
import { signToken } from "../src/utils/jwt.js";

const marker = `promo-test-${Date.now()}`;
let baseUrl = "";
let closeServer: (() => Promise<void>) | undefined;
let adminToken = "";
let userToken = "";

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
  const passwordHash = await hashValue("PromoPassword123!");
  const [admin, user] = await Promise.all([
    prisma.user.create({ data: { firstName: "Promo", lastName: "Admin", email: `${marker}-admin@example.com`, passwordHash, role: UserRole.ADMIN } }),
    prisma.user.create({ data: { firstName: "Promo", lastName: "User", email: `${marker}-user@example.com`, passwordHash, role: UserRole.USER } }),
  ]);
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
  await prisma.promotionalPopup.deleteMany({ where: { title: { startsWith: marker } } });
  await prisma.promotionalSlide.deleteMany({ where: { title: { startsWith: marker } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: marker } } });
  await prisma.$disconnect();
  await closeServer?.();
});

describe("promotional content", () => {
  test("bloquea no admin y publica slides vigentes priorizando destacados", async () => {
    assert.equal((await request("/api/admin/promotional/slides", userToken)).response.status, 403);

    const regular = await request("/api/admin/promotional/slides", adminToken, {
      method: "POST",
      body: JSON.stringify({
        title: `${marker}-regular`,
        imageUrl: "https://example.com/regular.jpg",
        imageAlt: "Promo regular",
        ctaLabel: "Ver ofertas",
        linkType: "OFFERS",
        priority: 10,
      }),
    });
    assert.equal(regular.response.status, 201);

    const featured = await request("/api/admin/promotional/slides", adminToken, {
      method: "POST",
      body: JSON.stringify({
        title: `${marker}-featured`,
        imageUrl: "https://example.com/featured.jpg",
        imageAlt: "Promo destacada",
        ctaLabel: "Comprar",
        linkType: "INTERNAL_URL",
        linkValue: "/productos/ofertas",
        priority: 1,
        isFeatured: true,
      }),
    });
    assert.equal(featured.response.status, 201);

    const publicSlides = await request("/api/promotional/slides");
    assert.equal(publicSlides.response.status, 200);
    const slides = publicSlides.body.data as Array<{ title: string }>;
    assert.equal(slides.find((slide) => slide.title === `${marker}-featured`)?.title, `${marker}-featured`);
    assert.ok(slides.findIndex((slide) => slide.title === `${marker}-featured`) < slides.findIndex((slide) => slide.title === `${marker}-regular`));
  });

  test("admin crea popup y endpoint publico devuelve el vigente", async () => {
    const created = await request("/api/admin/promotional/popups", adminToken, {
      method: "POST",
      body: JSON.stringify({
        title: `${marker}-popup`,
        description: "Popup test",
        frequency: "ONCE_PER_DAY",
        priority: 20,
        ctaLabel: "Ver",
        linkType: "OFFERS",
      }),
    });
    assert.equal(created.response.status, 201);

    const popup = await request("/api/promotional/popup");
    assert.equal(popup.response.status, 200);
    assert.equal((popup.body.data as { title: string }).title, `${marker}-popup`);
  });
});
