import { z } from "zod";

export const productIdParamsSchema = z.object({
	id: z.coerce.number().int().positive("El id de producto debe ser valido"),
});

export type ProductIdParams = z.infer<typeof productIdParamsSchema>;
