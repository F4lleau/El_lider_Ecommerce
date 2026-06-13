import { UserRole } from "@prisma/client";
import { Router } from "express";
import { optionalAuth, requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { stockRequestsController } from "./stock-requests.controller.js";

const stockRequestsRouter = Router();
stockRequestsRouter.post("/products/:productId/stock-requests", optionalAuth, stockRequestsController.create);
stockRequestsRouter.get("/me/stock-requests", requireAuth, stockRequestsController.listMine);
stockRequestsRouter.get("/admin/stock-requests", requireAuth, requireRole(UserRole.ADMIN), stockRequestsController.listAdmin);
stockRequestsRouter.patch("/admin/stock-requests/:id/status", requireAuth, requireRole(UserRole.ADMIN), stockRequestsController.updateStatus);

export { stockRequestsRouter };
