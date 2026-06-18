import { apiClient } from "@/services/api-client";
import type { OrderPaymentStatus, PaymentPreference } from "@/types/payment";

export const paymentsApi = {
  createPreference: (orderId: number, trackingCode?: string, email?: string) => apiClient.post<PaymentPreference>("/payments/mercadopago/preference", { orderId, trackingCode, email }),
  getOrderPayment: (orderId: number, trackingCode?: string) => apiClient.get<OrderPaymentStatus>(`/orders/${orderId}/payment${trackingCode ? `?trackingCode=${encodeURIComponent(trackingCode)}` : ""}`),
};
