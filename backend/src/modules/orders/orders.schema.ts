import { z } from "zod";

export const orderIdParamsSchema = z.object({
	id: z.coerce.number().int().positive("El id de la orden debe ser valido"),
});

const checkoutAddressSchema = z.object({
	label: z.string().trim().max(100).optional(),
	recipient: z.string().trim().min(2, "El destinatario es requerido"),
	phone: z.string().trim().min(6).max(30).optional(),
	street: z.string().trim().min(2, "La calle es requerida"),
	number: z.string().trim().min(1, "La altura es requerida"),
	apartment: z.string().trim().max(40).optional(),
	city: z.string().trim().min(2, "La ciudad es requerida"),
	state: z.string().trim().max(100).optional(),
	postalCode: z.string().trim().min(3, "El codigo postal es requerido"),
	country: z.string().trim().min(2).max(3).default("AR"),
	isDefault: z.boolean().optional(),
});

export const checkoutSchema = z.object({
	address: checkoutAddressSchema,
	paymentMethod: z.string().trim().max(60).optional(),
	notes: z.string().trim().max(300).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
