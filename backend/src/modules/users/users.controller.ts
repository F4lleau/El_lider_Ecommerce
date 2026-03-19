import type { Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { usersService } from "./users.service.js";
import { meSchema } from "./users.schema.js";

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
};
