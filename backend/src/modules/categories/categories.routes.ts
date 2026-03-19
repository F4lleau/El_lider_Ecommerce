import { Router } from "express";
import { categoriesController } from "./categories.controller.js";

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.list);
categoriesRouter.get("/:slug/products", categoriesController.listProductsBySlug);

export { categoriesRouter };
