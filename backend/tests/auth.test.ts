import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import express from "express";
import { UserRole } from "@prisma/client";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashValue } from "../src/utils/hash.js";
import { signToken, verifyToken } from "../src/utils/jwt.js";
import { requireAuth, requireRole } from "../src/middlewares/auth.middleware.js";
import { errorMiddleware } from "../src/middlewares/error.middleware.js";

const marker = `auth-test-${Date.now()}`;
const userEmail = `${marker}-user@example.com`;
const adminEmail = `${marker}-admin@example.com`;
const password = "TestPassword123!";

let baseUrl = "";
let closeServer: (() => Promise<void>) | undefined;

const request = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return { response, body: (await response.json()) as Record<string, unknown> };
};

before(async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No se pudo iniciar el servidor de test");
  baseUrl = `http://127.0.0.1:${address.port}`;
  closeServer = () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

after(async () => {
  await prisma.user.deleteMany({ where: { email: { startsWith: marker } } });
  await prisma.$disconnect();
  await closeServer?.();
});

describe("auth HTTP", () => {
  test("registra un usuario USER sin devolver passwordHash", async () => {
    const { response, body } = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ firstName: "Auth", lastName: "User", email: userEmail, password }),
    });
    assert.equal(response.status, 201);
    const data = body.data as { token: string; user: Record<string, unknown> };
    assert.equal(data.user.role, UserRole.USER);
    assert.equal("passwordHash" in data.user, false);
    assert.equal(verifyToken(data.token).role, UserRole.USER);
  });

  test("rechaza email duplicado", async () => {
    const { response } = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ firstName: "Auth", lastName: "User", email: userEmail, password }),
    });
    assert.equal(response.status, 409);
  });

  test("login exitoso devuelve JWT con email y rol", async () => {
    const { response, body } = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: userEmail, password }),
    });
    assert.equal(response.status, 200);
    const data = body.data as { token: string };
    const payload = verifyToken(data.token);
    assert.equal(payload.email, userEmail);
    assert.equal(payload.role, UserRole.USER);
  });

  test("login rechaza contraseña incorrecta", async () => {
    const { response } = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: userEmail, password: "incorrecta" }),
    });
    assert.equal(response.status, 401);
  });

  test("/auth/me rechaza visitante y acepta token válido", async () => {
    const anonymous = await request("/api/auth/me");
    assert.equal(anonymous.response.status, 401);

    const login = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: userEmail, password }),
    });
    const token = (login.body.data as { token: string }).token;
    const authenticated = await request("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(authenticated.response.status, 200);
    assert.equal((authenticated.body.data as { email: string }).email, userEmail);
  });
});

describe("role middleware", () => {
  test("rechaza USER y permite ADMIN", async () => {
    const passwordHash = await hashValue(password);
    const admin = await prisma.user.create({
      data: { firstName: "Auth", lastName: "Admin", email: adminEmail, passwordHash, role: UserRole.ADMIN },
    });
    const user = await prisma.user.findUniqueOrThrow({ where: { email: userEmail } });

    const roleApp = express();
    roleApp.get("/admin", requireAuth, requireRole(UserRole.ADMIN), (_req, res) => res.json({ ok: true }));
    roleApp.use(errorMiddleware);
    const server = roleApp.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("No se pudo iniciar la app de roles");
    const url = `http://127.0.0.1:${address.port}/admin`;

    const anonymous = await fetch(url);
    assert.equal(anonymous.status, 401);
    const common = await fetch(url, { headers: { Authorization: `Bearer ${signToken({ sub: String(user.id), email: user.email, role: user.role })}` } });
    assert.equal(common.status, 403);
    const allowed = await fetch(url, { headers: { Authorization: `Bearer ${signToken({ sub: String(admin.id), email: admin.email, role: admin.role })}` } });
    assert.equal(allowed.status, 200);

    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });
});
