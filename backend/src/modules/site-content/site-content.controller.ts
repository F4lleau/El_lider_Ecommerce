import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { siteContentService } from "./site-content.service.js";
import { siteContentKeyParamsSchema } from "./site-content.schema.js";

export const siteContentController = {
  getByKey: asyncHandler(async (req: Request, res: Response) => {
    const { key } = siteContentKeyParamsSchema.parse(req.params);
    const content = await siteContentService.getByKey(key);

    res.status(200).json({
      ok: true,
      data: content,
    });
  }),
};
