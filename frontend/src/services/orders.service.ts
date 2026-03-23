import { apiClient } from "./api-client";
import type { ApiResponse } from "../types/api";
import type { CheckoutPayload, Order } from "../types/order";

export const ordersService = {
  async getAll() {
    const { data } = await apiClient.get<ApiResponse<Order[]>>("/orders");
    return data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data;
  },

  async checkout(payload: CheckoutPayload) {
    const { data } = await apiClient.post<ApiResponse<Order>>(
      "/orders/checkout",
      payload
    );
    return data;
  },
};