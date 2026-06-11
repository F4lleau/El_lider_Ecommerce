import { apiClient } from "./api-client";
import type { AddCartItemPayload, Cart, CartItemsPayload, UpdateCartItemPayload } from "../types/cart";

export const cartService = {
  getCart: () => apiClient.get<Cart>("/cart"),
  addItem: (payload: AddCartItemPayload) => apiClient.post<Cart>("/cart/items", payload),
  updateItem: (itemId: number, payload: UpdateCartItemPayload) =>
    apiClient.patch<Cart>(`/cart/items/${itemId}`, payload),
  removeItem: (itemId: number) => apiClient.delete<Cart>(`/cart/items/${itemId}`),
  clearCart: () => apiClient.delete<Cart>("/cart"),
  sync: (payload: CartItemsPayload) => apiClient.post<Cart>("/cart/sync", payload),
  validate: (payload: CartItemsPayload) => apiClient.post<Cart>("/cart/validate", payload),
};
