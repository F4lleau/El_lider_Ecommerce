import type { Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ordersService } from "./orders.service.js";
import { checkoutSchema, orderIdParamsSchema } from "./orders.schema.js";

export const ordersController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const orders = await ordersService.listByUser(req.user.id);

    res.status(200).json({
      ok: true,
      data: orders,
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const { id } = orderIdParamsSchema.parse(req.params);
    const order = await ordersService.getById(req.user.id, id);

    res.status(200).json({
      ok: true,
      data: order,
    });
  }),

  checkout: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const payload = checkoutSchema.parse(req.body);
    const order = await ordersService.checkout(req.user.id, payload);

    res.status(201).json({
      ok: true,
      message: "Orden creada correctamente",
      data: order,
    });
  }),
};
