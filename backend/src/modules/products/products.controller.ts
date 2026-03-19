import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { productsService } from "./products.service.js";
import { productIdParamsSchema } from "./products.schema.js";

export const productsController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const products = await productsService.list();

    res.status(200).json({
      ok: true,
      data: products,
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = productIdParamsSchema.parse(req.params);
    const product = await productsService.getById(id);

    res.status(200).json({
      ok: true,
      data: product,
    });
  }),

  listFeatured: asyncHandler(async (_req: Request, res: Response) => {
    const products = await productsService.listFeatured();

    res.status(200).json({
      ok: true,
      data: products,
    });
  }),

  listOffers: asyncHandler(async (_req: Request, res: Response) => {
    const products = await productsService.listOffers();

    res.status(200).json({
      ok: true,
      data: products,
    });
  }),

  listNew: asyncHandler(async (_req: Request, res: Response) => {
    const products = await productsService.listNew();

    res.status(200).json({
      ok: true,
      data: products,
    });
  }),
};
