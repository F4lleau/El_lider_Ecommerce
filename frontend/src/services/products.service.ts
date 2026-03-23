import { apiClient } from "./api-client";
import type { ApiResponse } from "../types/api";
import type { Product } from "../types/product";

export const productsService = {
  async getAll() {
    const { data } = await apiClient.get<ApiResponse<Product[]>>("/products");
    return data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return data;
  },

  async getFeatured() {
    const { data } = await apiClient.get<ApiResponse<Product[]>>("/products/featured");
    return data;
  },

  async getOffers() {
    const { data } = await apiClient.get<ApiResponse<Product[]>>("/products/offers");
    return data;
  },

  async getNew() {
    const { data } = await apiClient.get<ApiResponse<Product[]>>("/products/new");
    return data;
  },
};
