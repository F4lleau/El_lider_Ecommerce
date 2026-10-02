import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import type { CreatePopupInput, CreateSlideInput, UpdatePopupInput, UpdateSlideInput } from "./promotional-content.schema.js";
import type { Prisma } from "@prisma/client";

const activeWindowWhere = (now = new Date()) => ({
  isActive: true,
  AND: [
    { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
    { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
  ],
});

const slideOrder = [
  { isFeatured: "desc" as const },
  { priority: "desc" as const },
  { startsAt: "desc" as const },
  { createdAt: "desc" as const },
];

const popupOrder = [
  { priority: "desc" as const },
  { startsAt: "desc" as const },
  { createdAt: "desc" as const },
];

const withoutUndefined = <T extends Record<string, unknown>>(input: T) =>
  Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));

const getPublicSlides = () =>
  prisma.promotionalSlide.findMany({
    where: activeWindowWhere(),
    orderBy: slideOrder,
    take: 12,
  });

const getPublicPopup = () =>
  prisma.promotionalPopup.findFirst({
    where: activeWindowWhere(),
    orderBy: popupOrder,
  });

const listSlidesAdmin = () =>
  prisma.promotionalSlide.findMany({
    orderBy: [{ isActive: "desc" }, ...slideOrder],
  });

const getSlideAdmin = async (id: number) => {
  const slide = await prisma.promotionalSlide.findUnique({ where: { id } });
  if (!slide) throw new ApiError(404, "Slide promocional no encontrado");
  return slide;
};

const createSlide = (input: CreateSlideInput) =>
  prisma.promotionalSlide.create({ data: withoutUndefined(input) as Prisma.PromotionalSlideCreateInput });

const updateSlide = async (id: number, input: UpdateSlideInput) => {
  await getSlideAdmin(id);
  return prisma.promotionalSlide.update({ where: { id }, data: withoutUndefined(input) as Prisma.PromotionalSlideUpdateInput });
};

const deactivateSlide = async (id: number) => updateSlide(id, { isActive: false });

const reorderSlides = async (slides: Array<{ id: number; priority: number }>) => {
  await prisma.$transaction(slides.map((slide) =>
    prisma.promotionalSlide.update({ where: { id: slide.id }, data: { priority: slide.priority } }),
  ));
  return listSlidesAdmin();
};

const listPopupsAdmin = () =>
  prisma.promotionalPopup.findMany({
    orderBy: [{ isActive: "desc" }, ...popupOrder],
  });

const getPopupAdmin = async (id: number) => {
  const popup = await prisma.promotionalPopup.findUnique({ where: { id } });
  if (!popup) throw new ApiError(404, "Popup promocional no encontrado");
  return popup;
};

const createPopup = (input: CreatePopupInput) =>
  prisma.promotionalPopup.create({ data: withoutUndefined(input) as Prisma.PromotionalPopupCreateInput });

const updatePopup = async (id: number, input: UpdatePopupInput) => {
  await getPopupAdmin(id);
  return prisma.promotionalPopup.update({ where: { id }, data: withoutUndefined(input) as Prisma.PromotionalPopupUpdateInput });
};

const deactivatePopup = async (id: number) => updatePopup(id, { isActive: false });

export const promotionalContentService = {
  getPublicSlides,
  getPublicPopup,
  listSlidesAdmin,
  getSlideAdmin,
  createSlide,
  updateSlide,
  deactivateSlide,
  reorderSlides,
  listPopupsAdmin,
  getPopupAdmin,
  createPopup,
  updatePopup,
  deactivatePopup,
};
