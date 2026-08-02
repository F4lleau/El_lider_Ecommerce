import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import express from "express";
import { UserRole } from "@prisma/client";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { compareHash, hashValue } from "../src/utils/hash.js";
import { signToken, verifyToken } from "../src/utils/jwt.js";
import { requireAuth, requireRole } from "../src/middlewares/auth.middleware.js";
import { errorMiddleware } from "../src/middlewares/error.middleware.js";
import { resetEmailSenderForTests, setEmailSenderForTests } from "../src/modules/email/email.service.js";
import { env } from "../src/config/env.js";

const marker = `auth-test-${Date.now()}`;
const userEmail = `${marker}-user@example.com`;
const adminEmail = `${marker}-admin@example.com`;
const resetEmail = `${marker}-reset@example.com`;
const lockEmail = `${marker}-lock@example.com`;
const password = "TestPassword123!";
const resetPassword = "NuevaClave1!";

let baseUrl = "";
let closeServer: (() => Promise<void>) | undefined;
const sentEmails: Array<{ to: string; subject: string; text: string }> = [];
let previousEmailEnabled = false;

const request = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return { response, body: (await response.json()) as Record<string, unknown> };
};

before(async () => {
  previousEmailEnabled = env.EMAIL_ENABLED;
  env.EMAIL_ENABLED = true;
  setEmailSenderForTests(async (payload) => {
    sentEmails.push(payload);
    return { skipped: false, messageId: `test-${sentEmails.length}` };
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No se pudo iniciar el servidor de test");
  baseUrl = `http://127.0.0.1:${address.port}`;
  closeServer = () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

after(async () => {
  env.EMAIL_ENABLED = previousEmailEnabled;
  resetEmailSenderForTests();
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

describe("password recovery", () => {
  test("forgot responde generico para email existente e inexistente y guarda token hasheado", async () => {
    await prisma.user.create({
      data: { firstName: "Reset", lastName: "User", email: resetEmail, passwordHash: await hashValue(password), role: UserRole.USER },
    });

    const existing = await request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: resetEmail }),
    });
    const emailCountAfterExisting = sentEmails.length;
    const missing = await request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: `${marker}-missing@example.com` }),
    });

    assert.equal(existing.response.status, 200);
    assert.equal(missing.response.status, 200);
    assert.equal(existing.body.message, missing.body.message);
    assert.equal(emailCountAfterExisting, sentEmails.length);
    assert.ok(sentEmails.some((email) => email.to === resetEmail && email.subject.includes("Recuperacion")));

    const resetUrl = (existing.body.data as { resetUrl?: string }).resetUrl;
    assert.ok(resetUrl);
    const token = new URL(resetUrl).searchParams.get("token");
    assert.ok(token);
    const user = await prisma.user.findUniqueOrThrow({ where: { email: resetEmail } });
    const saved = await prisma.passwordResetToken.findFirstOrThrow({ where: { userId: user.id } });
    assert.notEqual(saved.tokenHash, token);
    assert.equal(saved.tokenHash.length, 64);
  });

  test("validate token acepta valido y rechaza invalido o expirado", async () => {
    const forgot = await request("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: resetEmail }) });
    const token = new URL((forgot.body.data as { resetUrl: string }).resetUrl).searchParams.get("token")!;
    const valid = await request("/api/auth/validate-reset-token", { method: "POST", body: JSON.stringify({ token }) });
    assert.equal(valid.response.status, 200);

    const invalid = await request("/api/auth/validate-reset-token", { method: "POST", body: JSON.stringify({ token: "x".repeat(64) }) });
    assert.equal(invalid.response.status, 400);

    await prisma.passwordResetToken.updateMany({ where: { user: { email: resetEmail }, usedAt: null }, data: { expiresAt: new Date(Date.now() - 1000) } });
    const expired = await request("/api/auth/validate-reset-token", { method: "POST", body: JSON.stringify({ token }) });
    assert.equal(expired.response.status, 400);
  });

  test("reset password valido actualiza hash, marca usado y permite login", async () => {
    const forgot = await request("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: resetEmail }) });
    const token = new URL((forgot.body.data as { resetUrl: string }).resetUrl).searchParams.get("token")!;
    const result = await request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password: resetPassword, confirmPassword: resetPassword }),
    });
    assert.equal(result.response.status, 200);
    const user = await prisma.user.findUniqueOrThrow({ where: { email: resetEmail } });
    assert.equal(await compareHash(resetPassword, user.passwordHash), true);
    const used = await prisma.passwordResetToken.findFirstOrThrow({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    assert.ok(used.usedAt);

    const reused = await request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password: "OtraClave1!", confirmPassword: "OtraClave1!" }),
    });
    assert.equal(reused.response.status, 400);

    const login = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email: resetEmail, password: resetPassword }) });
    assert.equal(login.response.status, 200);
  });

  test("reset rechaza password insegura y confirmacion distinta", async () => {
    const forgot = await request("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: resetEmail }) });
    const token = new URL((forgot.body.data as { resetUrl: string }).resetUrl).searchParams.get("token")!;
    for (const candidate of ["Ab1!", "sinmayuscula1!", "SINMINUSCULA1!", "SinEspecial1"]) {
      const result = await request("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: candidate, confirmPassword: candidate }),
      });
      assert.equal(result.response.status, 400);
    }
    const mismatch = await request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password: "NuevaClave1!", confirmPassword: "Distinta1!" }),
    });
    assert.equal(mismatch.response.status, 400);
  });
});

describe("login lockout", () => {
  test("bloquea tras intentos fallidos, informa espera, expira y reset desbloquea", async () => {
    await prisma.user.create({
      data: { firstName: "Lock", lastName: "User", email: lockEmail, passwordHash: await hashValue(password), role: UserRole.USER },
    });
    for (let index = 0; index < 4; index += 1) {
      const failed = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email: lockEmail, password: "incorrecta" }) });
      assert.equal(failed.response.status, 401);
    }
    const lockedAttempt = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email: lockEmail, password: "incorrecta" }) });
    assert.equal(lockedAttempt.response.status, 423);
    assert.match(String(lockedAttempt.body.message), /30 minutos/);

    const whileLocked = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email: lockEmail, password }) });
    assert.equal(whileLocked.response.status, 423);

    await prisma.user.update({ where: { email: lockEmail }, data: { lockedUntil: new Date(Date.now() - 1000) } });
    const afterWait = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email: lockEmail, password }) });
    assert.equal(afterWait.response.status, 200);

    await prisma.user.update({ where: { email: lockEmail }, data: { failedLoginAttempts: 5, lockedUntil: new Date(Date.now() + 30 * 60_000), lastFailedLoginAt: new Date() } });
    const forgot = await request("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: lockEmail }) });
    const token = new URL((forgot.body.data as { resetUrl: string }).resetUrl).searchParams.get("token")!;
    const reset = await request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password: "ResetLock1!", confirmPassword: "ResetLock1!" }),
    });
    assert.equal(reset.response.status, 200);
    const unlocked = await prisma.user.findUniqueOrThrow({ where: { email: lockEmail } });
    assert.equal(unlocked.failedLoginAttempts, 0);
    assert.equal(unlocked.lockedUntil, null);
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
