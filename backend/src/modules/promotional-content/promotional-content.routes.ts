import { UserRole } from "@prisma/client";
import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { promotionalContentController } from "./promotional-content.controller.js";

const promotionalContentRouter = Router();
promotionalContentRouter.get("/slides", promotionalContentController.publicSlides);
promotionalContentRouter.get("/popup", promotionalContentController.publicPopup);

const adminPromotionalContentRouter = Router();
adminPromotionalContentRouter.use(requireAuth, requireRole(UserRole.ADMIN));

adminPromotionalContentRouter.get("/slides", promotionalContentController.listSlides);
adminPromotionalContentRouter.post("/slides", promotionalContentController.createSlide);
adminPromotionalContentRouter.patch("/slides/reorder", promotionalContentController.reorderSlides);
adminPromotionalContentRouter.get("/slides/:id", promotionalContentController.getSlide);
adminPromotionalContentRouter.patch("/slides/:id", promotionalContentController.updateSlide);
adminPromotionalContentRouter.delete("/slides/:id", promotionalContentController.deleteSlide);

adminPromotionalContentRouter.get("/popups", promotionalContentController.listPopups);
adminPromotionalContentRouter.post("/popups", promotionalContentController.createPopup);
adminPromotionalContentRouter.get("/popups/:id", promotionalContentController.getPopup);
adminPromotionalContentRouter.patch("/popups/:id", promotionalContentController.updatePopup);
adminPromotionalContentRouter.delete("/popups/:id", promotionalContentController.deletePopup);

export { adminPromotionalContentRouter, promotionalContentRouter };
