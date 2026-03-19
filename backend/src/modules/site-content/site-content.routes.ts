import { Router } from "express";
import { siteContentController } from "./site-content.controller.js";

const siteContentRouter = Router();

siteContentRouter.get("/:key", siteContentController.getByKey);

export { siteContentRouter };
