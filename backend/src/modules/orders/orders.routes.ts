import { UserRole } from "@prisma/client";
import { Router } from "express";
import { optionalAuth, requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { ordersController } from "./orders.controller.js";

const checkoutRouter = Router();
checkoutRouter.post("/validate", optionalAuth, ordersController.validateCheckout);
checkoutRouter.post("/", optionalAuth, ordersController.checkout);

const ordersRouter = Router();
ordersRouter.get("/track/:trackingCode", ordersController.track);

const meOrdersRouter = Router();
meOrdersRouter.use(requireAuth);
meOrdersRouter.get("/", ordersController.listMine);
meOrdersRouter.get("/:id", ordersController.getMine);

const adminOrdersRouter = Router();
adminOrdersRouter.use(requireAuth, requireRole(UserRole.ADMIN));
adminOrdersRouter.get("/", ordersController.listAdmin);
adminOrdersRouter.get("/:id", ordersController.getAdmin);
adminOrdersRouter.patch("/:id/status", ordersController.updateStatus);

export { adminOrdersRouter, checkoutRouter, meOrdersRouter, ordersRouter };
