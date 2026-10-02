import { PopupFrequency, PromoLinkType } from "@prisma/client";
import { z } from "zod";

const nullableText = (max = 500) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.string().trim().max(max).nullable().optional(),
  );

const optionalDate = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.coerce.date().nullable().optional(),
);

const positiveIdsSchema = z.array(z.coerce.number().int().positive()).max(50).nullable().optional();

export const promoIdParamsSchema = z.object({
  id: z.coerce.number().int().positive("El id debe ser valido"),
});

const linkFields = {
  linkType: z.nativeEnum(PromoLinkType),
  linkValue: nullableText(300),
};

const validateLinkAndDates = (data: { linkType?: PromoLinkType | null | undefined; linkValue?: string | null | undefined; startsAt?: Date | null | undefined; endsAt?: Date | null | undefined }, ctx: z.RefinementCtx) => {
  if (data.startsAt && data.endsAt && data.startsAt > data.endsAt) {
    ctx.addIssue({ code: "custom", path: ["endsAt"], message: "La fecha de fin debe ser posterior al inicio" });
  }

  if (data.linkType && !["OFFERS", "BEST_SELLERS"].includes(data.linkType) && !data.linkValue) {
    ctx.addIssue({ code: "custom", path: ["linkValue"], message: "El destino es requerido para este tipo de enlace" });
  }

  if (data.linkType === "INTERNAL_URL" && data.linkValue && !data.linkValue.startsWith("/")) {
    ctx.addIssue({ code: "custom", path: ["linkValue"], message: "La URL interna debe empezar con /" });
  }
};

const slideSchema = z.object({
  title: z.string().trim().min(2, "Titulo requerido").max(140),
  subtitle: nullableText(260),
  imageUrl: z.string().url("La imagen debe tener una URL valida"),
  imageAlt: z.string().trim().min(2, "Texto alternativo requerido").max(200),
  ctaLabel: z.string().trim().min(2, "CTA requerido").max(80),
  ...linkFields,
  badge: nullableText(80),
  startsAt: optionalDate,
  endsAt: optionalDate,
  priority: z.coerce.number().int().default(0),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const createSlideSchema = slideSchema.superRefine(validateLinkAndDates);
export const updateSlideSchema = slideSchema.partial().superRefine(validateLinkAndDates);

export const reorderSlidesSchema = z.object({
  slides: z.array(z.object({
    id: z.coerce.number().int().positive(),
    priority: z.coerce.number().int(),
  })).min(1).max(100),
});

const popupSchema = z.object({
  title: z.string().trim().min(2, "Titulo requerido").max(140),
  description: nullableText(800),
  imageUrl: nullableText(500).refine((value) => !value || z.string().url().safeParse(value).success, "La imagen debe tener una URL valida"),
  imageAlt: nullableText(200),
  ctaLabel: nullableText(80),
  linkType: z.nativeEnum(PromoLinkType).nullable().optional(),
  linkValue: nullableText(300),
  frequency: z.nativeEnum(PopupFrequency).optional(),
  startsAt: optionalDate,
  endsAt: optionalDate,
  productIds: positiveIdsSchema,
  categoryIds: positiveIdsSchema,
  priority: z.coerce.number().int().default(0),
  isActive: z.boolean().optional(),
});

const validatePopup = (data: { linkType?: PromoLinkType | null | undefined; linkValue?: string | null | undefined; startsAt?: Date | null | undefined; endsAt?: Date | null | undefined; ctaLabel?: string | null | undefined }, ctx: z.RefinementCtx) => {
  validateLinkAndDates(data, ctx);
  if ((data.linkType || data.linkValue || data.ctaLabel) && (!data.linkType || !data.ctaLabel)) {
    ctx.addIssue({ code: "custom", path: ["ctaLabel"], message: "CTA y tipo de destino son requeridos si el popup navega" });
  }
};

export const createPopupSchema = popupSchema.superRefine(validatePopup);
export const updatePopupSchema = popupSchema.partial().superRefine(validatePopup);

export type CreateSlideInput = z.infer<typeof createSlideSchema>;
export type UpdateSlideInput = z.infer<typeof updateSlideSchema>;
export type CreatePopupInput = z.infer<typeof createPopupSchema>;
export type UpdatePopupInput = z.infer<typeof updatePopupSchema>;
