import { z } from "zod";

export const addCartItemSchema = z.object({
	productId: z.coerce.number().int().positive("El productId debe ser valido"),
	quantity: z.coerce
		.number()
		.int()
		.positive("La cantidad debe ser mayor a 0")
		.max(100, "La cantidad es demasiado alta")
		.default(1),
});

export const updateCartItemSchema = z.object({
	quantity: z.coerce
		.number()
		.int()
		.positive("La cantidad debe ser mayor a 0")
		.max(100, "La cantidad es demasiado alta"),
});

export const cartItemParamsSchema = z.object({
	itemId: z.coerce.number().int().positive("El itemId debe ser valido"),
});

export const cartItemsSchema = z.object({
	items: z
		.array(addCartItemSchema)
		.max(100, "El carrito contiene demasiados productos"),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CartItemParams = z.infer<typeof cartItemParamsSchema>;
export type CartItemsInput = z.infer<typeof cartItemsSchema>;
