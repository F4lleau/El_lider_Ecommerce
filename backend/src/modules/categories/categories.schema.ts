import { z } from "zod";

export const categorySlugParamsSchema = z.object({
	slug: z.string().trim().min(1, "Slug requerido"),
});

export type CategorySlugParams = z.infer<typeof categorySlugParamsSchema>;
