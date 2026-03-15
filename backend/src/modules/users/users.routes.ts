import { Router } from "express";
import { usersController } from "./users.controller.js";

const usersRouter = Router();

usersRouter.get("/", usersController.list);

export { usersRouter };
