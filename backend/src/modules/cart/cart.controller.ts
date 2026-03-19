import type { Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { cartService } from "./cart.service.js";
import {
  addCartItemSchema,
  cartItemParamsSchema,
  updateCartItemSchema,
} from "./cart.schema.js";

export const cartController = {
  getMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const cart = await cartService.getByUser(req.user.id);

    res.status(200).json({
      ok: true,
      data: cart,
    });
  }),

  addItem: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const payload = addCartItemSchema.parse(req.body);
    const cart = await cartService.addItem(
      req.user.id,
      payload.productId,
      payload.quantity,
    );

    res.status(200).json({
      ok: true,
      message: "Producto agregado al carrito",
      data: cart,
    });
  }),

  updateItem: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const { itemId } = cartItemParamsSchema.parse(req.params);
    const payload = updateCartItemSchema.parse(req.body);

    const cart = await cartService.updateItem(req.user.id, itemId, payload.quantity);

    res.status(200).json({
      ok: true,
      message: "Item de carrito actualizado",
      data: cart,
    });
  }),

  removeItem: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const { itemId } = cartItemParamsSchema.parse(req.params);
    const cart = await cartService.removeItem(req.user.id, itemId);

    res.status(200).json({
      ok: true,
      message: "Item eliminado del carrito",
      data: cart,
    });
  }),

  clearMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const cart = await cartService.clear(req.user.id);

    res.status(200).json({
      ok: true,
      message: "Carrito vaciado",
      data: cart,
    });
  }),
};
