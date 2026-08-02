import { apiClient } from "./api-client";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  ResetPasswordResponse,
  ValidateResetTokenPayload,
  ValidateResetTokenResponse,
} from "../types/auth";
import type { User } from "../types/user";

export const authService = {
  async login(payload: LoginPayload) {
    return apiClient.post<AuthResponse>("/auth/login", payload);
  },

  async register(payload: RegisterPayload) {
    return apiClient.post<AuthResponse>("/auth/register", payload);
  },

  me: () => apiClient.get<User>("/auth/me"),

  forgotPassword: (payload: ForgotPasswordPayload) => apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", payload),
  validateResetToken: (payload: ValidateResetTokenPayload) => apiClient.post<ValidateResetTokenResponse>("/auth/validate-reset-token", payload),
  resetPassword: (payload: ResetPasswordPayload) => apiClient.post<ResetPasswordResponse>("/auth/reset-password", payload),
};
