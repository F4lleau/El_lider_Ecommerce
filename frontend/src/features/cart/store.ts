import { create } from "zustand";
import { cartService } from "../../services/cart.service";
import type { Cart, GuestCartItem } from "../../types/cart";
import { addGuestItem, removeGuestItem, updateGuestItem } from "./guest-cart";

const STORAGE_KEY = "guest-cart";

const emptyCart = (): Cart => ({
  id: 0,
  userId: 0,
  items: [],
  summary: { itemsCount: 0, subtotal: 0 },
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
});

const hasSession = () => Boolean(localStorage.getItem("token"));

const readGuestItems = (): GuestCartItem[] => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as GuestCartItem[];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const saveGuestItems = (items: GuestCartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

type CartState = {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  feedback: string | null;
  initialize: () => Promise<void>;
  syncAfterLogin: () => Promise<void>;
  addItem: (productId: number, stock: number) => Promise<void>;
  updateItem: (itemId: number, productId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number, productId: number) => Promise<void>;
  clear: () => Promise<void>;
  clearFeedback: () => void;
};

export const useCartStore = create<CartState>((set) => {
  const run = async (operation: () => Promise<Cart>, feedback?: string) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await operation();
      set({ cart, isLoading: false, feedback: feedback ?? null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar el carrito";
      set({ isLoading: false, error: message });
      throw error;
    }
  };

  const validateGuest = async (items: GuestCartItem[]) => {
    if (items.length === 0) return emptyCart();
    return cartService.validate({ items });
  };

  return {
    cart: emptyCart(),
    isLoading: false,
    error: null,
    feedback: null,

    initialize: async () => {
      await run(() => hasSession() ? cartService.getCart() : validateGuest(readGuestItems()));
    },

    syncAfterLogin: async () => {
      const items = readGuestItems();
      await run(() => items.length ? cartService.sync({ items }) : cartService.getCart(), "Carrito sincronizado");
      localStorage.removeItem(STORAGE_KEY);
    },

    addItem: async (productId, stock) => {
      if (stock < 1) {
        set({ error: "Producto sin stock disponible" });
        return;
      }
      if (hasSession()) {
        await run(() => cartService.addItem({ productId, quantity: 1 }), "Producto agregado");
        return;
      }

      const items = readGuestItems();
      const next = addGuestItem(items, productId, stock);
      await run(async () => {
        const cart = await validateGuest(next);
        saveGuestItems(next);
        return cart;
      }, "Producto agregado");
    },

    updateItem: async (itemId, productId, quantity) => {
      if (quantity < 1) {
        const state = useCartStore.getState();
        await state.removeItem(itemId, productId);
        return;
      }
      if (hasSession()) {
        await run(() => cartService.updateItem(itemId, { quantity }));
        return;
      }
      const next = updateGuestItem(readGuestItems(), productId, quantity);
      await run(async () => {
        const cart = await validateGuest(next);
        saveGuestItems(next);
        return cart;
      });
    },

    removeItem: async (itemId, productId) => {
      if (hasSession()) {
        await run(() => cartService.removeItem(itemId));
        return;
      }
      const next = removeGuestItem(readGuestItems(), productId);
      await run(async () => {
        const cart = await validateGuest(next);
        saveGuestItems(next);
        return cart;
      });
    },

    clear: async () => {
      if (hasSession()) {
        await run(() => cartService.clearCart());
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      set({ cart: emptyCart(), error: null, feedback: null });
    },

    clearFeedback: () => set({ feedback: null, error: null }),
  };
});
