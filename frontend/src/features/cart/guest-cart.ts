import type { GuestCartItem } from "../../types/cart";

export const addGuestItem = (
  items: GuestCartItem[],
  productId: number,
  stock: number,
): GuestCartItem[] => {
  const existing = items.find((item) => item.productId === productId);
  const quantity = (existing?.quantity ?? 0) + 1;
  if (stock < 1 || quantity > stock) {
    throw new Error("No hay stock suficiente para ese producto");
  }
  return existing
    ? items.map((item) => item.productId === productId ? { ...item, quantity } : item)
    : [...items, { productId, quantity }];
};

export const updateGuestItem = (
  items: GuestCartItem[],
  productId: number,
  quantity: number,
): GuestCartItem[] =>
  quantity < 1
    ? items.filter((item) => item.productId !== productId)
    : items.map((item) => item.productId === productId ? { ...item, quantity } : item);

export const removeGuestItem = (items: GuestCartItem[], productId: number): GuestCartItem[] =>
  items.filter((item) => item.productId !== productId);

export const guestItemsCount = (items: GuestCartItem[]): number =>
  items.reduce((total, item) => total + item.quantity, 0);
