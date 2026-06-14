import type { Category } from "./category";
import type { Order, OrderStatus } from "./order";
import type { Product } from "./product";
import type { StockRequest, StockRequestStatus } from "./stock-request";

export type AdminCategory = Omit<Category, "icon" | "color"> & { _count?: { products: number } };
export type AdminOrder = Order & {
  guestName?: string | null; guestEmail?: string | null; guestPhone?: string | null;
  user?: { id: number; firstName: string; lastName: string; email: string } | null;
  shippingRecipient?: string | null; shippingPhone?: string | null; shippingStreet?: string | null;
  shippingNumber?: string | null; shippingFloor?: string | null; shippingApartment?: string | null;
  shippingCity?: string | null; shippingProvince?: string | null; shippingPostalCode?: string | null;
  shippingReferences?: string | null;
};
export type AdminStockRequest = StockRequest & { user?: { id: number; firstName: string; lastName: string; email: string } | null };

export type ProductWrite = {
  name: string; slug?: string; description?: string | null; price: number; compareAtPrice?: number | null;
  stock: number; categoryId: number; isFeatured?: boolean; isOffer?: boolean; isNew?: boolean; isActive?: boolean;
  images?: Array<{ url: string; alt?: string | null; isPrimary?: boolean }>;
};
export type CategoryWrite = { name: string; slug?: string; description?: string | null; isActive?: boolean };

export type AdminDashboardData = {
  products: Product[]; categories: AdminCategory[]; orders: AdminOrder[]; stockRequests: AdminStockRequest[];
};
export type { OrderStatus, StockRequestStatus };
