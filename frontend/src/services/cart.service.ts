import { apiClient } from "./api-client";
import type { ApiResponse } from "../types/api";
import type { AddCartItemPayload, Cart, UpdateCartItemPayload } from "../types/cart";

export const cartService = {
  async getCart() {
    const { data } = await apiClient.get<ApiResponse<Cart>>("/cart");
    return data;
  },

  async addItem(payload: AddCartItemPayload) {
    const { data } = await apiClient.post<ApiResponse<Cart>>("/cart/items", payload);
    return data;
  },

  async updateItem(itemId: string, payload: UpdateCartItemPayload) {
    const { data } = await apiClient.patch<ApiResponse<Cart>>(
      `/cart/items/${itemId}`,
      payload
    );
    return data;
  },

  async removeItem(itemId: string) {
    const { data } = await apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return data;
  },

  async clearCart() {
    const { data } = await apiClient.delete<ApiResponse<Cart>>("/cart");
    return data;
  },
};