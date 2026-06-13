import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { categoriesService } from "./categories.service.js";
import { categoryIdParamsSchema, categoryIdentifierParamsSchema, categorySlugParamsSchema, createCategorySchema, updateCategorySchema } from "./categories.schema.js";

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ ok: true, data });

export const categoriesController = {
  list: asyncHandler(async (_req: Request, res: Response) => ok(res, await categoriesService.list())),
  listProductsById: asyncHandler(async (req: Request, res: Response) => ok(res, await categoriesService.listProductsById(categoryIdParamsSchema.parse(req.params).id))),
  listProductsByIdentifier: asyncHandler(async (req: Request, res: Response) => {
    const { identifier } = categoryIdentifierParamsSchema.parse(req.params);
    return ok(res, /^\d+$/.test(identifier) ? await categoriesService.listProductsById(Number(identifier)) : await categoriesService.listProductsBySlug(identifier));
  }),
  listProductsBySlug: asyncHandler(async (req: Request, res: Response) => ok(res, await categoriesService.listProductsBySlug(categorySlugParamsSchema.parse(req.params).slug))),
  listAdmin: asyncHandler(async (_req: Request, res: Response) => ok(res, await categoriesService.listAdmin())),
  getAdminById: asyncHandler(async (req: Request, res: Response) => ok(res, await categoriesService.getAdminById(categoryIdParamsSchema.parse(req.params).id))),
  create: asyncHandler(async (req: Request, res: Response) => ok(res, await categoriesService.create(createCategorySchema.parse(req.body)), 201)),
  update: asyncHandler(async (req: Request, res: Response) => ok(res, await categoriesService.update(categoryIdParamsSchema.parse(req.params).id, updateCategorySchema.parse(req.body)))),
  deactivate: asyncHandler(async (req: Request, res: Response) => ok(res, await categoriesService.deactivate(categoryIdParamsSchema.parse(req.params).id))),
};
