import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, "El nombre es requerido"),
  lastName: z.string().trim().min(2, "El apellido es requerido"),
  email: z.email("Email invalido").transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña es demasiado larga"),
});

export const loginSchema = z.object({
  email: z.email("Email invalido").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "La contraseña es requerida"),
});

const securePasswordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .regex(/[A-Z]/, "La contraseña debe incluir una mayúscula")
  .regex(/[a-z]/, "La contraseña debe incluir una minúscula")
  .regex(/[^A-Za-z0-9]/, "La contraseña debe incluir un carácter especial");

export const forgotPasswordSchema = z.object({
  email: z.email("Email invalido").transform((value) => value.toLowerCase()),
});

export const validateResetTokenSchema = z.object({
  token: z.string().min(20, "Token invalido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20, "Token invalido"),
  password: securePasswordSchema,
  confirmPassword: z.string(),
}).refine((payload) => payload.password === payload.confirmPassword, {
  path: ["confirmPassword"],
  message: "Las contraseñas no coinciden",
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ValidateResetTokenInput = z.infer<typeof validateResetTokenSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
