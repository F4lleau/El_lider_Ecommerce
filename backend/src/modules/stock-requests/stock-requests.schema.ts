import { StockRequestStatus } from "@prisma/client";
import { z } from "zod";

export const stockRequestProductParamsSchema = z.object({ productId: z.coerce.number().int().positive() });
export const stockRequestIdParamsSchema = z.object({ id: z.coerce.number().int().positive() });
export const createStockRequestSchema = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(6).max(40).optional(),
});
export const updateStockRequestStatusSchema = z.object({ status: z.nativeEnum(StockRequestStatus) });

export type CreateStockRequestInput = z.infer<typeof createStockRequestSchema>;
