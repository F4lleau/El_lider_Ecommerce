import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { productsService } from "./products.service.js";
import { adminProductsQuerySchema, createProductSchema, productIdParamsSchema, productSlugParamsSchema, updatePriceSchema, updateProductSchema, updateStockSchema } from "./products.schema.js";

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ ok: true, data });

export const productsController = {
  list: asyncHandler(async (_req: Request, res: Response) => ok(res, await productsService.list())),
  getById: asyncHandler(async (req: Request, res: Response) => ok(res, await productsService.getById(productIdParamsSchema.parse(req.params).id))),
  getBySlug: asyncHandler(async (req: Request, res: Response) => ok(res, await productsService.getBySlug(productSlugParamsSchema.parse(req.params).slug))),
  listFeatured: asyncHandler(async (_req: Request, res: Response) => ok(res, await productsService.listFeatured())),
  listOffers: asyncHandler(async (_req: Request, res: Response) => ok(res, await productsService.listOffers())),
  listNew: asyncHandler(async (_req: Request, res: Response) => ok(res, await productsService.listNew())),
  listBestSellers: asyncHandler(async (_req: Request, res: Response) => ok(res, await productsService.listBestSellers())),
  listAdmin: asyncHandler(async (req: Request, res: Response) => ok(res, await productsService.listAdmin(adminProductsQuerySchema.parse(req.query)))),
  getAdminById: asyncHandler(async (req: Request, res: Response) => ok(res, await productsService.getAdminById(productIdParamsSchema.parse(req.params).id))),
  create: asyncHandler(async (req: Request, res: Response) => ok(res, await productsService.create(createProductSchema.parse(req.body)), 201)),
  update: asyncHandler(async (req: Request, res: Response) => ok(res, await productsService.update(productIdParamsSchema.parse(req.params).id, updateProductSchema.parse(req.body)))),
  deactivate: asyncHandler(async (req: Request, res: Response) => ok(res, await productsService.deactivate(productIdParamsSchema.parse(req.params).id))),
  updateStock: asyncHandler(async (req: Request, res: Response) => ok(res, await productsService.updateStock(productIdParamsSchema.parse(req.params).id, updateStockSchema.parse(req.body)))),
  updatePrice: asyncHandler(async (req: Request, res: Response) => ok(res, await productsService.updatePrice(productIdParamsSchema.parse(req.params).id, updatePriceSchema.parse(req.body)))),
};
