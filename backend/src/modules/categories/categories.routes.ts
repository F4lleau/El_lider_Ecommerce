import { UserRole } from "@prisma/client";
import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { categoriesController } from "./categories.controller.js";

const categoriesRouter = Router();
categoriesRouter.get("/", categoriesController.list);
categoriesRouter.get("/slug/:slug/products", categoriesController.listProductsBySlug);
categoriesRouter.get("/:identifier/products", categoriesController.listProductsByIdentifier);

const adminCategoriesRouter = Router();
adminCategoriesRouter.use(requireAuth, requireRole(UserRole.ADMIN));
adminCategoriesRouter.get("/", categoriesController.listAdmin);
adminCategoriesRouter.post("/", categoriesController.create);
adminCategoriesRouter.get("/:id", categoriesController.getAdminById);
adminCategoriesRouter.patch("/:id", categoriesController.update);
adminCategoriesRouter.delete("/:id", categoriesController.deactivate);

export { adminCategoriesRouter, categoriesRouter };
