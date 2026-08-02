import { createHash, randomBytes } from "node:crypto";
import { UserRole } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { compareHash, hashValue } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";
import { emailService } from "../email/email.service.js";
import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput, ValidateResetTokenInput } from "./auth.schema.js";

const RESET_MESSAGE = "Si el email existe, te enviaremos instrucciones para recuperar tu contraseña.";
const RESET_SUCCESS_MESSAGE = "Tu contraseña fue actualizada. Ya podés iniciar sesión.";
const RESET_TOKEN_MINUTES = 30;
const LOGIN_LOCK_LIMIT = 5;
const LOGIN_LOCK_MINUTES = 30;

const sanitizeUser = (user: {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

const minutesUntil = (date: Date) => Math.max(1, Math.ceil((date.getTime() - Date.now()) / 60000));

const resetLink = (token: string) => `${env.FRONTEND_URL.replace(/\/$/, "")}/resetear-clave?token=${encodeURIComponent(token)}`;

const publicResetResponse = (resetUrl?: string) => ({
  message: RESET_MESSAGE,
  ...(env.NODE_ENV !== "production" && resetUrl ? { resetUrl } : {}),
});

const register = async (payload: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: payload.email }, select: { id: true } });
  if (existing) throw new ApiError(409, "Ya existe un usuario con ese email");

  const passwordHash = await hashValue(payload.password);
  const user = await prisma.user.create({
    data: { firstName: payload.firstName, lastName: payload.lastName, email: payload.email, passwordHash },
    select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  const token = signToken({ sub: user.id.toString(), email: user.email, role: user.role });
  return { user: sanitizeUser(user), token };
};

const failLogin = async (user: { id: number; failedLoginAttempts: number }) => {
  const attempts = user.failedLoginAttempts + 1;
  const lockedUntil = attempts >= LOGIN_LOCK_LIMIT ? new Date(Date.now() + LOGIN_LOCK_MINUTES * 60_000) : null;
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: attempts, lastFailedLoginAt: new Date(), ...(lockedUntil ? { lockedUntil } : {}) },
  });
  if (lockedUntil) throw new ApiError(423, `Tu cuenta está bloqueada temporalmente. Intentá nuevamente en ${LOGIN_LOCK_MINUTES} minutos.`);
};

const login = async (payload: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) throw new ApiError(401, "Credenciales invalidas");

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new ApiError(423, `Tu cuenta está bloqueada temporalmente. Intentá nuevamente en ${minutesUntil(user.lockedUntil)} minutos.`);
  }

  const isValidPassword = await compareHash(payload.password, user.passwordHash);
  if (!isValidPassword) {
    await failLogin(user);
    throw new ApiError(401, "Credenciales invalidas");
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null, lastFailedLoginAt: null },
    select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  const token = signToken({ sub: updated.id.toString(), email: updated.email, role: updated.role });
  return { user: sanitizeUser(updated), token };
};

const getMe = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  if (!user) throw new ApiError(404, "Usuario no encontrado");
  return sanitizeUser(user);
};

const forgotPassword = async (payload: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email }, select: { id: true, email: true } });
  if (!user) return publicResetResponse();

  const token = randomBytes(32).toString("hex");
  const hash = tokenHash(token);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_MINUTES * 60_000);

  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } }),
    prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: hash, expiresAt } }),
  ]);

  const url = resetLink(token);
  await emailService.safeSend(
    "password-reset",
    () => emailService.sendPasswordResetEmail({ to: user.email, resetUrl: url, expiresInMinutes: RESET_TOKEN_MINUTES }),
    { userId: user.id, to: user.email },
  );
  if (env.NODE_ENV !== "production" && env.EMAIL_DEV_LOG) {
    console.info(`Password reset link for ${user.email}: ${url}`);
  }
  return publicResetResponse(url);
};

const findValidResetToken = async (token: string) => {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: tokenHash(token) } });
  if (!record) throw new ApiError(400, "Token inválido");
  if (record.usedAt) throw new ApiError(400, "Token ya utilizado");
  if (record.expiresAt <= new Date()) throw new ApiError(400, "Token expirado");
  return record;
};

const validateResetToken = async (payload: ValidateResetTokenInput) => {
  await findValidResetToken(payload.token);
  return { valid: true };
};

const resetPassword = async (payload: ResetPasswordInput) => {
  const resetToken = await findValidResetToken(payload.token);
  const passwordHash = await hashValue(payload.password);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null, lastFailedLoginAt: null },
    }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    prisma.passwordResetToken.updateMany({
      where: { userId: resetToken.userId, usedAt: null, id: { not: resetToken.id } },
      data: { usedAt: new Date() },
    }),
  ]);
  return { message: RESET_SUCCESS_MESSAGE };
};

export const authService = {
  register,
  login,
  getMe,
  forgotPassword,
  validateResetToken,
  resetPassword,
  constants: { RESET_MESSAGE, RESET_SUCCESS_MESSAGE, LOGIN_LOCK_LIMIT, LOGIN_LOCK_MINUTES },
};
