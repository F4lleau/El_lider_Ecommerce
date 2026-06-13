import { UserRole } from "@prisma/client";
import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { productsController } from "./products.controller.js";

const productsRouter = Router();
productsRouter.get("/", productsController.list);
productsRouter.get("/featured", productsController.listFeatured);
productsRouter.get("/offers", productsController.listOffers);
productsRouter.get("/new", productsController.listNew);
productsRouter.get("/best-sellers", productsController.listBestSellers);
productsRouter.get("/slug/:slug", productsController.getBySlug);
productsRouter.get("/:id", productsController.getById);

const adminProductsRouter = Router();
adminProductsRouter.use(requireAuth, requireRole(UserRole.ADMIN));
adminProductsRouter.get("/", productsController.listAdmin);
adminProductsRouter.post("/", productsController.create);
adminProductsRouter.get("/:id", productsController.getAdminById);
adminProductsRouter.patch("/:id", productsController.update);
adminProductsRouter.delete("/:id", productsController.deactivate);
adminProductsRouter.patch("/:id/stock", productsController.updateStock);
adminProductsRouter.patch("/:id/price", productsController.updatePrice);

export { adminProductsRouter, productsRouter };
