import { apiClient } from "@/services/api-client";
import type { Category, CategoryWithProducts } from "./types";

export const categoriesApi = {
  list: () => apiClient.get<Category[]>("/categories"),
  getProductsBySlug: (slug: string) => apiClient.get<CategoryWithProducts>(`/categories/${slug}/products`),
};
