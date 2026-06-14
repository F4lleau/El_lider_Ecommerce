import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { adminOrdersQuerySchema, checkoutSchema, orderIdParamsSchema, trackingParamsSchema, updateOrderStatusSchema } from "./orders.schema.js";
import { ordersService } from "./orders.service.js";

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ ok: true, data });

export const ordersController = {
  validateCheckout: asyncHandler(async (req: Request, res: Response) => ok(res, await ordersService.calculate(req.user?.id, checkoutSchema.parse(req.body)))),
  checkout: asyncHandler(async (req: Request, res: Response) => ok(res, await ordersService.checkout(req.user?.id, checkoutSchema.parse(req.body)), 201)),
  track: asyncHandler(async (req: Request, res: Response) => ok(res, await ordersService.track(trackingParamsSchema.parse(req.params).trackingCode))),
  listMine: asyncHandler(async (req: Request, res: Response) => ok(res, await ordersService.listByUser(req.user!.id))),
  getMine: asyncHandler(async (req: Request, res: Response) => ok(res, await ordersService.getById(req.user!.id, orderIdParamsSchema.parse(req.params).id))),
  listAdmin: asyncHandler(async (req: Request, res: Response) => ok(res, await ordersService.listAdmin(adminOrdersQuerySchema.parse(req.query)))),
  getAdmin: asyncHandler(async (req: Request, res: Response) => ok(res, await ordersService.getAdminById(orderIdParamsSchema.parse(req.params).id))),
  updateStatus: asyncHandler(async (req: Request, res: Response) => ok(res, await ordersService.updateStatus(orderIdParamsSchema.parse(req.params).id, updateOrderStatusSchema.parse(req.body).status))),
};
