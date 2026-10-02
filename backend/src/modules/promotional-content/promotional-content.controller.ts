import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { promotionalContentService } from "./promotional-content.service.js";
import {
  createPopupSchema,
  createSlideSchema,
  promoIdParamsSchema,
  reorderSlidesSchema,
  updatePopupSchema,
  updateSlideSchema,
} from "./promotional-content.schema.js";

export const promotionalContentController = {
  publicSlides: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: await promotionalContentService.getPublicSlides() });
  }),

  publicPopup: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: await promotionalContentService.getPublicPopup() });
  }),

  listSlides: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: await promotionalContentService.listSlidesAdmin() });
  }),

  getSlide: asyncHandler(async (req: Request, res: Response) => {
    const { id } = promoIdParamsSchema.parse(req.params);
    res.status(200).json({ ok: true, data: await promotionalContentService.getSlideAdmin(id) });
  }),

  createSlide: asyncHandler(async (req: Request, res: Response) => {
    const payload = createSlideSchema.parse(req.body);
    res.status(201).json({ ok: true, message: "Slide promocional creado", data: await promotionalContentService.createSlide(payload) });
  }),

  updateSlide: asyncHandler(async (req: Request, res: Response) => {
    const { id } = promoIdParamsSchema.parse(req.params);
    const payload = updateSlideSchema.parse(req.body);
    res.status(200).json({ ok: true, message: "Slide promocional actualizado", data: await promotionalContentService.updateSlide(id, payload) });
  }),

  deleteSlide: asyncHandler(async (req: Request, res: Response) => {
    const { id } = promoIdParamsSchema.parse(req.params);
    res.status(200).json({ ok: true, message: "Slide promocional desactivado", data: await promotionalContentService.deactivateSlide(id) });
  }),

  reorderSlides: asyncHandler(async (req: Request, res: Response) => {
    const { slides } = reorderSlidesSchema.parse(req.body);
    res.status(200).json({ ok: true, message: "Orden actualizado", data: await promotionalContentService.reorderSlides(slides) });
  }),

  listPopups: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: await promotionalContentService.listPopupsAdmin() });
  }),

  getPopup: asyncHandler(async (req: Request, res: Response) => {
    const { id } = promoIdParamsSchema.parse(req.params);
    res.status(200).json({ ok: true, data: await promotionalContentService.getPopupAdmin(id) });
  }),

  createPopup: asyncHandler(async (req: Request, res: Response) => {
    const payload = createPopupSchema.parse(req.body);
    res.status(201).json({ ok: true, message: "Popup promocional creado", data: await promotionalContentService.createPopup(payload) });
  }),

  updatePopup: asyncHandler(async (req: Request, res: Response) => {
    const { id } = promoIdParamsSchema.parse(req.params);
    const payload = updatePopupSchema.parse(req.body);
    res.status(200).json({ ok: true, message: "Popup promocional actualizado", data: await promotionalContentService.updatePopup(id, payload) });
  }),

  deletePopup: asyncHandler(async (req: Request, res: Response) => {
    const { id } = promoIdParamsSchema.parse(req.params);
    res.status(200).json({ ok: true, message: "Popup promocional desactivado", data: await promotionalContentService.deactivatePopup(id) });
  }),
};
