import { Router } from "express";
import { cartController } from "./cart.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const cartRouter = Router();

cartRouter.use(authMiddleware);

cartRouter.get("/", cartController.getMine);
cartRouter.post("/items", cartController.addItem);
cartRouter.patch("/items/:itemId", cartController.updateItem);
cartRouter.delete("/items/:itemId", cartController.removeItem);
cartRouter.delete("/", cartController.clearMine);

export { cartRouter };
