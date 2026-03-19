import type { Request, Response } from "express";

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    ok: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
};
