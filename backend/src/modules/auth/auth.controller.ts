import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiError } from "../../utils/api-error.js";
import { authService } from "./auth.service.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, validateResetTokenSchema } from "./auth.schema.js";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.register(registerSchema.parse(req.body));
    res.status(201).json({ ok: true, message: "Usuario registrado correctamente", data });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.login(loginSchema.parse(req.body));
    res.status(200).json({ ok: true, message: "Login exitoso", data });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "No autenticado");
    const data = await authService.getMe(req.user.id);
    res.status(200).json({ ok: true, data });
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.forgotPassword(forgotPasswordSchema.parse(req.body));
    res.status(200).json({ ok: true, message: data.message, data });
  }),

  validateResetToken: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.validateResetToken(validateResetTokenSchema.parse(req.body));
    res.status(200).json({ ok: true, data });
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.resetPassword(resetPasswordSchema.parse(req.body));
    res.status(200).json({ ok: true, message: data.message, data });
  }),
};
