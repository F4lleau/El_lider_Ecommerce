import { apiClient } from "@/services/api-client";
import type { Product } from "../../types/product";

export const productsApi = {
  list: () => apiClient.get<Product[]>("/products"),
  listFeatured: () => apiClient.get<Product[]>("/products/featured"),
  listOffers: () => apiClient.get<Product[]>("/products/offers"),
  listNew: () => apiClient.get<Product[]>("/products/new"),
  listBestSellers: () => apiClient.get<Product[]>("/products/best-sellers"),
  getById: (id: number) => apiClient.get<Product>(`/products/${id}`),
};
