import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiError } from "../../utils/api-error.js";
import { authService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const payload = registerSchema.parse(req.body);
    const data = await authService.register(payload);

    res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente",
      data,
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const payload = loginSchema.parse(req.body);
    const data = await authService.login(payload);

    res.status(200).json({
      ok: true,
      message: "Login exitoso",
      data,
    });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const data = await authService.getMe(req.user.id);

    res.status(200).json({
      ok: true,
      data,
    });
  }),
};
