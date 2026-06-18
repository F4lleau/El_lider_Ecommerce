import { apiClient } from "@/services/api-client";
import type { AdminCategory, AdminDashboardData, AdminOrder, AdminStockRequest, CategoryWrite, OrderStatus, ProductWrite, StockRequestStatus } from "@/types/admin";
import type { Product } from "@/types/product";

export const adminProductsApi = {
  list: (query?: string) => apiClient.get<Product[]>(`/admin/products${query ? `?q=${encodeURIComponent(query)}` : ""}`),
  get: (id: number) => apiClient.get<Product>(`/admin/products/${id}`),
  create: (payload: ProductWrite) => apiClient.post<Product>("/admin/products", payload),
  update: (id: number, payload: Partial<ProductWrite>) => apiClient.patch<Product>(`/admin/products/${id}`, payload),
  deactivate: (id: number) => apiClient.delete<Product>(`/admin/products/${id}`),
  stock: (id: number, stock: number) => apiClient.patch<Product>(`/admin/products/${id}/stock`, { stock }),
  price: (id: number, price: number, compareAtPrice?: number | null, isOffer?: boolean) => apiClient.patch<Product>(`/admin/products/${id}/price`, { price, compareAtPrice, isOffer }),
};
export const adminCategoriesApi = {
  list: () => apiClient.get<AdminCategory[]>("/admin/categories"),
  get: (id: number) => apiClient.get<AdminCategory>(`/admin/categories/${id}`),
  create: (payload: CategoryWrite) => apiClient.post<AdminCategory>("/admin/categories", payload),
  update: (id: number, payload: Partial<CategoryWrite>) => apiClient.patch<AdminCategory>(`/admin/categories/${id}`, payload),
  deactivate: (id: number) => apiClient.delete<AdminCategory>(`/admin/categories/${id}`),
};
export const adminOrdersApi = {
  list: () => apiClient.get<AdminOrder[]>("/admin/orders"),
  get: (id: number) => apiClient.get<AdminOrder>(`/admin/orders/${id}`),
  status: (id: number, status: OrderStatus) => apiClient.patch<AdminOrder>(`/admin/orders/${id}/status`, { status }),
};
export const adminStockRequestsApi = {
  list: () => apiClient.get<AdminStockRequest[]>("/admin/stock-requests"),
  status: (id: number, status: StockRequestStatus) => apiClient.patch<AdminStockRequest>(`/admin/stock-requests/${id}/status`, { status }),
};
export const adminDashboardApi = {
  load: async (): Promise<AdminDashboardData> => {
    const [products, categories, orders, stockRequests] = await Promise.all([adminProductsApi.list(), adminCategoriesApi.list(), adminOrdersApi.list(), adminStockRequestsApi.list()]);
    return { products, categories, orders, stockRequests };
  },
};
