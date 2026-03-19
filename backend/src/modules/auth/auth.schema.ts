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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
