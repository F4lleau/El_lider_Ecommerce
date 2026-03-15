import { Router } from "express";
import { cartController } from "./cart.controller.js";

const cartRouter = Router();

cartRouter.get("/", cartController.list);

export { cartRouter };
