import { DeliveryMethod, OrderStatus, PaymentMethod } from "@prisma/client";
import { z } from "zod";
import { cartItemsSchema } from "../cart/cart.schema.js";

export const orderIdParamsSchema = z.object({ id: z.coerce.number().int().positive("El id de la orden debe ser valido") });
export const trackingParamsSchema = z.object({ trackingCode: z.string().trim().min(6) });

const customerSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(40),
});

const shippingAddressSchema = z.object({
  recipient: z.string().trim().min(2),
  phone: z.string().trim().min(6).max(40),
  street: z.string().trim().min(2),
  number: z.string().trim().min(1),
  floor: z.string().trim().max(20).optional(),
  apartment: z.string().trim().max(40).optional(),
  city: z.string().trim().min(2),
  province: z.string().trim().min(2),
  postalCode: z.string().trim().min(3),
  references: z.string().trim().max(500).optional(),
});

export const checkoutSchema = z.object({
  deliveryMethod: z.nativeEnum(DeliveryMethod),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.MERCADOPAGO),
  customer: customerSchema.optional(),
  address: shippingAddressSchema.optional(),
  items: cartItemsSchema.shape.items.optional(),
  notes: z.string().trim().max(500).optional(),
}).superRefine((data, ctx) => {
  if (data.deliveryMethod === DeliveryMethod.SHIPPING && !data.address) {
    ctx.addIssue({ code: "custom", path: ["address"], message: "La direccion es requerida para envio" });
  }
});

export const adminOrdersQuerySchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  deliveryMethod: z.nativeEnum(DeliveryMethod).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const updateOrderStatusSchema = z.object({ status: z.nativeEnum(OrderStatus) });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type AdminOrdersQuery = z.infer<typeof adminOrdersQuerySchema>;
