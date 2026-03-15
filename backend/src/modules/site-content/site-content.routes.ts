import { Router } from "express";
import { site_contentController } from "./site-content.controller.js";

const site_contentRouter = Router();

site_contentRouter.get("/", site_contentController.list);

export { site_contentRouter };
