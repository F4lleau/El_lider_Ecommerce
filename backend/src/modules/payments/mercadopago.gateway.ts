import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";

export type ProviderPayment = {
  id: string;
  status: string;
  externalReference: string;
  amount: number;
  currency: string;
  paidAt: Date | null;
  raw: unknown;
};

export type PreferenceInput = {
  orderId: number;
  orderNumber: string;
  trackingCode: string;
  payerEmail: string;
  items: Array<{ id: string; title: string; quantity: number; unitPrice: number }>;
};

export type PreferenceResult = {
  id: string;
  initPoint: string | null;
  sandboxInitPoint: string | null;
  raw: unknown;
};

export type MercadoPagoGateway = {
  createPreference(input: PreferenceInput): Promise<PreferenceResult>;
  getPayment(id: string): Promise<ProviderPayment>;
};

const client = new MercadoPagoConfig({ accessToken: env.MERCADOPAGO_ACCESS_TOKEN || "missing-token" });
const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

const requireCredentials = () => {
  if (!env.MERCADOPAGO_ACCESS_TOKEN) throw new ApiError(503, "Mercado Pago no esta configurado");
};

const realGateway: MercadoPagoGateway = {
  async createPreference(input) {
    requireCredentials();
    const response = await preferenceClient.create({
      body: {
        external_reference: String(input.orderId),
        items: input.items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          currency_id: "ARS",
        })),
        payer: { email: input.payerEmail },
        notification_url: `${env.BACKEND_URL}/api/payments/mercadopago/webhook`,
        back_urls: {
          success: `${env.FRONTEND_URL}/checkout/success?orderId=${input.orderId}&trackingCode=${encodeURIComponent(input.trackingCode)}&email=${encodeURIComponent(input.payerEmail)}`,
          pending: `${env.FRONTEND_URL}/checkout/pending?orderId=${input.orderId}&trackingCode=${encodeURIComponent(input.trackingCode)}&email=${encodeURIComponent(input.payerEmail)}`,
          failure: `${env.FRONTEND_URL}/checkout/failure?orderId=${input.orderId}&trackingCode=${encodeURIComponent(input.trackingCode)}&email=${encodeURIComponent(input.payerEmail)}`,
        },
        auto_return: "approved",
        metadata: { order_number: input.orderNumber, tracking_code: input.trackingCode },
      },
    });
    if (!response.id) throw new ApiError(502, "Mercado Pago no devolvio una preferencia valida");
    return {
      id: response.id,
      initPoint: response.init_point ?? null,
      sandboxInitPoint: response.sandbox_init_point ?? null,
      raw: response,
    };
  },
  async getPayment(id) {
    requireCredentials();
    const response = await paymentClient.get({ id });
    if (!response.id || !response.external_reference || response.transaction_amount == null) {
      throw new ApiError(502, "Mercado Pago devolvio un pago incompleto");
    }
    return {
      id: String(response.id),
      status: response.status ?? "pending",
      externalReference: response.external_reference,
      amount: Number(response.transaction_amount),
      currency: response.currency_id ?? "ARS",
      paidAt: response.date_approved ? new Date(response.date_approved) : null,
      raw: response,
    };
  },
};

let gateway: MercadoPagoGateway = realGateway;

export const mercadoPagoGateway = {
  createPreference: (input: PreferenceInput) => gateway.createPreference(input),
  getPayment: (id: string) => gateway.getPayment(id),
};

export const setMercadoPagoGatewayForTests = (replacement: MercadoPagoGateway) => {
  gateway = replacement;
};

export const resetMercadoPagoGatewayForTests = () => {
  gateway = realGateway;
};
