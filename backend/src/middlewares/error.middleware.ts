import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";
import { env } from "../config/env.js";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      ok: false,
      message: "Error de validacion",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      ok: false,
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    ok: false,
    message: "Error interno del servidor",
    ...(env.NODE_ENV !== "production" && { detail: error.message }),
  });
};
