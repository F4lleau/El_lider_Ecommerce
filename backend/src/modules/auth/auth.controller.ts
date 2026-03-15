import type { Request, Response } from "express";

export const authController = {
  list: (_req: Request, res: Response): void => {
    res.status(200).json({ message: "TODO: listar auth" });
  },
};
