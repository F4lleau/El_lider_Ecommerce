import { apiClient } from "./api-client";
import type { ApiResponse } from "../types/api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth";

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload
    );
    return data;
  },

  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      payload
    );
    return data;
  },
};