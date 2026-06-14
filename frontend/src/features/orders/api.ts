import { apiClient } from "@/services/api-client";
import type { CheckoutPayload, CheckoutSummary, Order } from "@/types/order";

export const ordersApi = {
  validate: (payload: CheckoutPayload) => apiClient.post<CheckoutSummary>("/checkout/validate", payload),
  checkout: (payload: CheckoutPayload) => apiClient.post<Order>("/checkout", payload),
  track: (trackingCode: string) => apiClient.get<Order>(`/orders/track/${encodeURIComponent(trackingCode)}`),
  listMine: () => apiClient.get<Order[]>("/me/orders"),
  getMine: (id: number) => apiClient.get<Order>(`/me/orders/${id}`),
};
