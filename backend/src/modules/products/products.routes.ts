import { Router } from "express";
import { productsController } from "./products.controller.js";

const productsRouter = Router();

productsRouter.get("/", productsController.list);

export { productsRouter };
