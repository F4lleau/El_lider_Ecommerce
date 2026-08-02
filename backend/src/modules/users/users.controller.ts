import type { Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { usersService } from "./users.service.js";
import { addressIdParamsSchema, addressSchema, meSchema, updateAddressSchema, updateMeSchema } from "./users.schema.js";

export const usersController = {
  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const payload = meSchema.parse({ userId: req.user.id });
    const user = await usersService.getMe(payload.userId);

    res.status(200).json({
      ok: true,
      data: user,
    });
  }),
  updateMe: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado");
    }

    const payload = meSchema.parse({ userId: req.user.id });
    const user = await usersService.updateMe(payload.userId, updateMeSchema.parse(req.body));

    res.status(200).json({
      ok: true,
      data: user,
    });
  }),
  listAddresses: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "No autenticado");
    res.status(200).json({ ok: true, data: await usersService.listAddresses(req.user.id) });
  }),
  createAddress: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "No autenticado");
    res.status(201).json({ ok: true, data: await usersService.createAddress(req.user.id, addressSchema.parse(req.body)) });
  }),
  updateAddress: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "No autenticado");
    const { id } = addressIdParamsSchema.parse(req.params);
    res.status(200).json({ ok: true, data: await usersService.updateAddress(req.user.id, id, updateAddressSchema.parse(req.body)) });
  }),
  deleteAddress: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "No autenticado");
    const { id } = addressIdParamsSchema.parse(req.params);
    res.status(200).json({ ok: true, data: await usersService.deleteAddress(req.user.id, id) });
  }),
  setDefaultAddress: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "No autenticado");
    const { id } = addressIdParamsSchema.parse(req.params);
    res.status(200).json({ ok: true, data: await usersService.setDefaultAddress(req.user.id, id) });
  }),
};
