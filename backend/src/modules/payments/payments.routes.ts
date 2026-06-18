import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middlewares/auth.middleware.js";
import { paymentsController } from "./payments.controller.js";

const paymentsRouter = Router();

paymentsRouter.post("/mercadopago/preference", optionalAuth, paymentsController.preference);
paymentsRouter.post("/mercadopago/webhook", paymentsController.webhook);
paymentsRouter.get("/:id/status", requireAuth, paymentsController.getStatus);

const orderPaymentsRouter = Router();
orderPaymentsRouter.get("/:orderId/payment", optionalAuth, paymentsController.getOrderPayment);

export { orderPaymentsRouter, paymentsRouter };
