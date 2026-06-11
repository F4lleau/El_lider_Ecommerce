import type { Product } from "./product";

export interface GuestCartItem {
  productId: number;
  quantity: number;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  subtotal: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  summary: {
    itemsCount: number;
    subtotal: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AddCartItemPayload {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface CartItemsPayload {
  items: GuestCartItem[];
}
