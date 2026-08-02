import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { createStockRequestSchema, stockRequestIdParamsSchema, stockRequestProductParamsSchema, updateStockRequestStatusSchema } from "./stock-requests.schema.js";
import { stockRequestsService } from "./stock-requests.service.js";

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ ok: true, data });

export const stockRequestsController = {
  create: asyncHandler(async (req: Request, res: Response) => ok(res, await stockRequestsService.create(stockRequestProductParamsSchema.parse(req.params).productId, req.user?.id, createStockRequestSchema.parse(req.body)), 201)),
  listMine: asyncHandler(async (req: Request, res: Response) => ok(res, await stockRequestsService.listMine(req.user!.id))),
  cancelMine: asyncHandler(async (req: Request, res: Response) => ok(res, await stockRequestsService.cancelMine(req.user!.id, stockRequestIdParamsSchema.parse(req.params).id))),
  listAdmin: asyncHandler(async (_req: Request, res: Response) => ok(res, await stockRequestsService.listAdmin())),
  updateStatus: asyncHandler(async (req: Request, res: Response) => ok(res, await stockRequestsService.updateStatus(stockRequestIdParamsSchema.parse(req.params).id, updateStockRequestStatusSchema.parse(req.body).status))),
};
