import { z } from "zod";

export const preferenceSchema = z.object({
  orderId: z.coerce.number().int().positive(),
  trackingCode: z.string().trim().min(6).optional(),
  email: z.string().trim().email().optional(),
});

export const orderPaymentParamsSchema = z.object({
  orderId: z.coerce.number().int().positive(),
});

export const paymentParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const orderPaymentAccessSchema = z.object({
  trackingCode: z.string().trim().min(6).optional(),
});

export const webhookSchema = z.object({
  type: z.string().optional(),
  action: z.string().optional(),
  data: z.object({ id: z.union([z.string(), z.number()]) }).optional(),
});
