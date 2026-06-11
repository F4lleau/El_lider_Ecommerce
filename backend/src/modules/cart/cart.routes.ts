import { Router } from "express";
import { cartController } from "./cart.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const cartRouter = Router();

cartRouter.post("/validate", cartController.validateGuest);

cartRouter.use(requireAuth);

cartRouter.get("/", cartController.getMine);
cartRouter.post("/sync", cartController.syncMine);
cartRouter.post("/items", cartController.addItem);
cartRouter.patch("/items/:itemId", cartController.updateItem);
cartRouter.delete("/items/:itemId", cartController.removeItem);
cartRouter.delete("/", cartController.clearMine);

export { cartRouter };
