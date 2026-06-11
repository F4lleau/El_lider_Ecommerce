import { apiClient } from "./api-client";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth";
import type { User } from "../types/user";

export const authService = {
  async login(payload: LoginPayload) {
    return apiClient.post<AuthResponse>("/auth/login", payload);
  },

  async register(payload: RegisterPayload) {
    return apiClient.post<AuthResponse>("/auth/register", payload);
  },

  me: () => apiClient.get<User>("/auth/me"),
};
