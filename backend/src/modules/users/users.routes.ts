import { Router } from "express";
import { usersController } from "./users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const usersRouter = Router();

usersRouter.get("/me", authMiddleware, usersController.me);

export { usersRouter };
