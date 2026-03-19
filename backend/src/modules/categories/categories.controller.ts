import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { categoriesService } from "./categories.service.js";
import { categorySlugParamsSchema } from "./categories.schema.js";

export const categoriesController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoriesService.list();

    res.status(200).json({
      ok: true,
      data: categories,
    });
  }),

  listProductsBySlug: asyncHandler(async (req: Request, res: Response) => {
    const { slug } = categorySlugParamsSchema.parse(req.params);
    const category = await categoriesService.listProductsBySlug(slug);

    res.status(200).json({
      ok: true,
      data: category,
    });
  }),
};
