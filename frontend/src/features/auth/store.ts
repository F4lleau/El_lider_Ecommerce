import { create } from "zustand";
import type { LoginPayload, RegisterPayload } from "../../types/auth";
import type { User } from "../../types/user";
import { authService } from "../../services/auth.service";
import { useCartStore } from "../cart/store";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  clearError: () => void;
};

const saveSession = (token: string, user: User) => {
  localStorage.setItem("token", token);
  localStorage.setItem("auth-user", JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("auth-user");
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, isInitialized: true });
      return;
    }

    try {
      const user = await authService.me();
      localStorage.setItem("auth-user", JSON.stringify(user));
      set({ user, isInitialized: true });
    } catch {
      clearSession();
      set({ user: null, isInitialized: true });
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authService.login(payload);
      saveSession(token, user);
      set({ user, isLoading: false });
      await useCartStore.getState().syncAfterLogin().catch(() => undefined);
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo iniciar sesión";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authService.register(payload);
      saveSession(token, user);
      set({ user, isLoading: false });
      await useCartStore.getState().syncAfterLogin().catch(() => undefined);
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear la cuenta";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  logout: () => {
    clearSession();
    set({ user: null, error: null });
    void useCartStore.getState().initialize();
  },

  clearError: () => set({ error: null }),
}));
