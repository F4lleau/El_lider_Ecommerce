import { Router } from "express";
import { usersController } from "./users.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const usersRouter = Router();

usersRouter.get("/me", requireAuth, usersController.me);

export { usersRouter };
