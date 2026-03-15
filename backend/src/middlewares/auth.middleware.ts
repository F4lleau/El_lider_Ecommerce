import type { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  // TODO: Validar JWT y adjuntar usuario al request
  next();
};
