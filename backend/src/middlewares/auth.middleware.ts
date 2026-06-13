import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";
import { ApiError } from "../utils/api-error.js";
import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next(new ApiError(401, "Token de autenticacion requerido"));
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    next(new ApiError(401, "Token invalido o expirado"));
    return;
  }

  const userId = Number(payload.sub);
  if (!Number.isInteger(userId) || typeof payload.email !== "string") {
    next(new ApiError(401, "Token invalido"));
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    next(new ApiError(401, "Usuario autenticado no encontrado"));
    return;
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  next();
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.headers.authorization) {
    next();
    return;
  }

  void requireAuth(req, res, next);
};

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, "No autenticado"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, "No tienes permisos para este recurso"));
      return;
    }

  next();
};
