import { apiClient } from "./api-client";
import type { ApiResponse } from "../types/api";
import type { User } from "../types/user";

export const usersService = {
  async getMe() {
    const { data } = await apiClient.get<ApiResponse<User>>("/users/me");
    return data;
  },
};