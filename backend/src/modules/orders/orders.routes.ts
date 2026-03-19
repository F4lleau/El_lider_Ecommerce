import { Router } from "express";
import { ordersController } from "./orders.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const ordersRouter = Router();

ordersRouter.use(authMiddleware);

ordersRouter.post("/checkout", ordersController.checkout);
ordersRouter.get("/", ordersController.list);
ordersRouter.get("/:id", ordersController.getById);

export { ordersRouter };
