import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";

const parseSignature = (value: string) => Object.fromEntries(value.split(",").map((part) => part.trim().split("=", 2)));

export const validateWebhookSignature = (signature: string | undefined, requestId: string | undefined, paymentId: string | undefined) => {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET || env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return;
  if (!signature || !requestId || !paymentId) throw new ApiError(401, "Firma de webhook incompleta");
  const parsed = parseSignature(signature);
  if (!parsed.ts || !parsed.v1) throw new ApiError(401, "Firma de webhook invalida");
  const manifest = `id:${paymentId};request-id:${requestId};ts:${parsed.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const received = parsed.v1;
  if (expected.length !== received.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(received))) {
    throw new ApiError(401, "Firma de webhook invalida");
  }
};
