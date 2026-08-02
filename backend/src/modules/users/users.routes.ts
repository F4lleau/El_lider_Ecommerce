import { Router } from "express";
import { ordersController } from "../orders/orders.controller.js";
import { stockRequestsController } from "../stock-requests/stock-requests.controller.js";
import { usersController } from "./users.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const usersRouter = Router();

usersRouter.get("/me", requireAuth, usersController.me);
usersRouter.patch("/me", requireAuth, usersController.updateMe);
usersRouter.get("/me/addresses", requireAuth, usersController.listAddresses);
usersRouter.post("/me/addresses", requireAuth, usersController.createAddress);
usersRouter.patch("/me/addresses/:id", requireAuth, usersController.updateAddress);
usersRouter.delete("/me/addresses/:id", requireAuth, usersController.deleteAddress);
usersRouter.patch("/me/addresses/:id/default", requireAuth, usersController.setDefaultAddress);
usersRouter.get("/me/orders", requireAuth, ordersController.listMine);
usersRouter.get("/me/orders/:id", requireAuth, ordersController.getMine);
usersRouter.get("/me/stock-requests", requireAuth, stockRequestsController.listMine);
usersRouter.patch("/me/stock-requests/:id/cancel", requireAuth, stockRequestsController.cancelMine);

export { usersRouter };
