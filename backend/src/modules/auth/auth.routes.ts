import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { authController } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/validate-reset-token", authController.validateResetToken);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.get("/me", requireAuth, authController.me);

export { authRouter };
