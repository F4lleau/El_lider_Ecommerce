import type { Request, Response } from "express";

export const productsController = {
  list: (_req: Request, res: Response): void => {
    res.status(200).json({ message: "TODO: listar products" });
  },
};
