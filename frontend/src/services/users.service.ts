import { apiClient } from "./api-client";
import type { UpdateUserPayload, User, UserAddress, UserAddressPayload } from "../types/user";

export const usersService = {
  async getMe() {
    return apiClient.get<User>("/users/me");
  },
  updateMe(payload: UpdateUserPayload) {
    return apiClient.patch<User>("/users/me", payload);
  },
  listAddresses() {
    return apiClient.get<UserAddress[]>("/users/me/addresses");
  },
  createAddress(payload: UserAddressPayload) {
    return apiClient.post<UserAddress>("/users/me/addresses", payload);
  },
  updateAddress(id: number, payload: Partial<UserAddressPayload>) {
    return apiClient.patch<UserAddress>(`/users/me/addresses/${id}`, payload);
  },
  deleteAddress(id: number) {
    return apiClient.delete<UserAddress>(`/users/me/addresses/${id}`);
  },
  setDefaultAddress(id: number) {
    return apiClient.patch<UserAddress>(`/users/me/addresses/${id}/default`);
  },
};
