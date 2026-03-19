import { Router } from "express";
import { productsController } from "./products.controller.js";

const productsRouter = Router();

productsRouter.get("/", productsController.list);
productsRouter.get("/featured", productsController.listFeatured);
productsRouter.get("/offers", productsController.listOffers);
productsRouter.get("/new", productsController.listNew);
productsRouter.get("/:id", productsController.getById);

export { productsRouter };
