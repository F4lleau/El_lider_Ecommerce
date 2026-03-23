import { apiClient } from "./api-client";
import type { ApiResponse } from "../types/api";
import type { Category } from "../types/category";
import type { Product } from "../types/product";

export const categoriesService = {
  async getAll() {
    const { data } = await apiClient.get<ApiResponse<Category[]>>("/categories");
    return data;
  },

  async getProductsBySlug(slug: string) {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(
      `/categories/${slug}/products`
    );
    return data;
  },
};