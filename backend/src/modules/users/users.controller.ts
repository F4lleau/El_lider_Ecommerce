import type { Request, Response } from "express";

export const usersController = {
  list: (_req: Request, res: Response): void => {
    res.status(200).json({ message: "TODO: listar users" });
  },
};
