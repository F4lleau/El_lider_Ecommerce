import { z } from "zod";

export const meSchema = z.object({
	userId: z.number().int().positive(),
});

export const updateMeSchema = z.object({
  firstName: z.string().trim().min(2, "El nombre es requerido").max(80).optional(),
  lastName: z.string().trim().min(2, "El apellido es requerido").max(80).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Debe enviar al menos un campo para actualizar",
});

export const addressIdParamsSchema = z.object({
  id: z.coerce.number().int().positive("El id de la direccion debe ser valido"),
});

export const addressSchema = z.object({
  label: z.string().trim().max(80).optional().nullable(),
  recipient: z.string().trim().min(2, "El destinatario es requerido").max(160),
  phone: z.string().trim().min(6).max(40).optional().nullable(),
  street: z.string().trim().min(2, "La calle es requerida").max(160),
  number: z.string().trim().min(1, "El numero es requerido").max(40),
  apartment: z.string().trim().max(80).optional().nullable(),
  city: z.string().trim().min(2, "La ciudad es requerida").max(120),
  state: z.string().trim().max(120).optional().nullable(),
  postalCode: z.string().trim().min(3, "El codigo postal es requerido").max(20),
  country: z.string().trim().min(2).max(80).default("AR"),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = addressSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Debe enviar al menos un campo para actualizar",
});

export type MeInput = z.infer<typeof meSchema>;
export type UpdateMeInput = z.infer<typeof updateMeSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
