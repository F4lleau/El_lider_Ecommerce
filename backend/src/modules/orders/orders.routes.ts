import { Router } from "express";
import { ordersController } from "./orders.controller.js";

const ordersRouter = Router();

ordersRouter.get("/", ordersController.list);

export { ordersRouter };
