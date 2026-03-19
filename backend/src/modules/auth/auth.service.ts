import { UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { compareHash, hashValue } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

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

const register = async (payload: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true },
  });

  if (existing) {
    throw new ApiError(409, "Ya existe un usuario con ese email");
  }

  const passwordHash = await hashValue(payload.password);

  const user = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      passwordHash,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = signToken({
    sub: user.id.toString(),
    role: user.role,
  });

  return {
    user: sanitizeUser(user),
    token,
  };
};

const login = async (payload: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(401, "Credenciales invalidas");
  }

  const isValidPassword = await compareHash(payload.password, user.passwordHash);
  if (!isValidPassword) {
    throw new ApiError(401, "Credenciales invalidas");
  }

  const token = signToken({
    sub: user.id.toString(),
    role: user.role,
  });

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const authService = {
  register,
  login,
};
