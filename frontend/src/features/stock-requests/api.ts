import { apiClient } from "@/services/api-client";
import type { StockRequest } from "@/types/stock-request";

export type GuestStockRequestPayload = { name: string; email: string; phone: string };

export const stockRequestsApi = {
  create: (productId: number, payload?: GuestStockRequestPayload) =>
    apiClient.post<StockRequest>(`/products/${productId}/stock-requests`, payload ?? {}),
  listMine: () => apiClient.get<StockRequest[]>("/users/me/stock-requests"),
  cancelMine: (id: number) => apiClient.patch<StockRequest>(`/users/me/stock-requests/${id}/cancel`),
};
