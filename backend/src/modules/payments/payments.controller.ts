import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { orderPaymentAccessSchema, orderPaymentParamsSchema, paymentParamsSchema, preferenceSchema, webhookSchema } from "./payments.schema.js";
import { paymentsService } from "./payments.service.js";
import { validateWebhookSignature } from "./webhook-signature.js";

const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ ok: true, data });

export const paymentsController = {
  preference: asyncHandler(async (req: Request, res: Response) => ok(res, await paymentsService.createPreference(preferenceSchema.parse(req.body), req.user), 201)),
  webhook: asyncHandler(async (req: Request, res: Response) => {
    const payload = webhookSchema.parse({ ...req.query, ...req.body, data: req.body?.data ?? (req.query["data.id"] ? { id: req.query["data.id"] } : undefined) });
    const paymentId = payload.data ? String(payload.data.id) : undefined;
    validateWebhookSignature(req.header("x-signature"), req.header("x-request-id"), paymentId);
    return ok(res, await paymentsService.processWebhook(payload.type, paymentId));
  }),
  getStatus: asyncHandler(async (req: Request, res: Response) => ok(res, await paymentsService.getById(paymentParamsSchema.parse(req.params).id, req.user))),
  getOrderPayment: asyncHandler(async (req: Request, res: Response) => ok(res, await paymentsService.getByOrder(orderPaymentParamsSchema.parse(req.params).orderId, orderPaymentAccessSchema.parse(req.query), req.user))),
};
