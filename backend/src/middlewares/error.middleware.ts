import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: "Error interno del servidor" });
};
