import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";
import { ApiError } from "../utils/api-error.js";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next(new ApiError(401, "Token de autenticacion requerido"));
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token);
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId)) {
      next(new ApiError(401, "Token invalido"));
      return;
    }

    req.user = {
      id: userId,
      role: payload.role,
    };

    next();
  } catch {
    next(new ApiError(401, "Token invalido o expirado"));
  }
};

export const requireRoles =
  (roles: UserRole[]) =>
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
