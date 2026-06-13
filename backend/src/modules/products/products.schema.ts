import { z } from "zod";

export const productIdParamsSchema = z.object({
  id: z.coerce.number().int().positive("El id de producto debe ser valido"),
});

export const productSlugParamsSchema = z.object({
  slug: z.string().trim().min(1, "Slug requerido"),
});

const productImageSchema = z.object({
  url: z.string().url("La imagen debe tener una URL valida"),
  alt: z.string().trim().max(200).nullable().optional(),
  isPrimary: z.boolean().optional(),
});

const productFields = {
  name: z.string().trim().min(2, "Nombre requerido").max(160),
  slug: z.string().trim().min(1).max(180).optional(),
  description: z.string().trim().max(3000).nullable().optional(),
  price: z.coerce.number().positive("El precio debe ser positivo"),
  compareAtPrice: z.coerce.number().positive().nullable().optional(),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  isFeatured: z.boolean().optional(),
  isOffer: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isActive: z.boolean().optional(),
  categoryId: z.coerce.number().int().positive(),
  images: z.array(productImageSchema).max(10).optional(),
};

export const createProductSchema = z.object(productFields).superRefine((data, ctx) => {
  if (data.compareAtPrice !== null && data.compareAtPrice !== undefined && data.compareAtPrice <= data.price) {
    ctx.addIssue({ code: "custom", path: ["compareAtPrice"], message: "El precio anterior debe ser mayor al precio actual" });
  }
});

export const updateProductSchema = z.object(productFields).partial().superRefine((data, ctx) => {
  if (data.price !== undefined && data.compareAtPrice !== null && data.compareAtPrice !== undefined && data.compareAtPrice <= data.price) {
    ctx.addIssue({ code: "custom", path: ["compareAtPrice"], message: "El precio anterior debe ser mayor al precio actual" });
  }
});
export const updateStockSchema = z.object({ stock: z.coerce.number().int().min(0, "El stock no puede ser negativo") });
export const updatePriceSchema = z.object({
  price: z.coerce.number().positive("El precio debe ser positivo"),
  compareAtPrice: z.coerce.number().positive().nullable().optional(),
  isOffer: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.compareAtPrice !== null && data.compareAtPrice !== undefined && data.compareAtPrice <= data.price) {
    ctx.addIssue({ code: "custom", path: ["compareAtPrice"], message: "El precio anterior debe ser mayor al precio actual" });
  }
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
export type UpdatePriceInput = z.infer<typeof updatePriceSchema>;
