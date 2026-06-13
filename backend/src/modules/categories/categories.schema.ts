import { z } from "zod";

export const categoryIdParamsSchema = z.object({ id: z.coerce.number().int().positive() });
export const categorySlugParamsSchema = z.object({ slug: z.string().trim().min(1, "Slug requerido") });
export const categoryIdentifierParamsSchema = z.object({ identifier: z.string().trim().min(1) });
export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido").max(120),
  slug: z.string().trim().min(1).max(140).optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  isActive: z.boolean().optional(),
});
export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
