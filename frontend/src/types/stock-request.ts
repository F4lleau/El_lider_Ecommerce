import type { ProductImage } from "./product";

export type StockRequestStatus = "PENDING" | "CONTACTED" | "NOTIFIED" | "CANCELLED";

export type StockRequest = {
  id: number;
  productId: number;
  userId: number | null;
  name: string | null;
  email: string;
  phone: string | null;
  status: StockRequestStatus;
  notifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    name: string;
    slug: string;
    stock: number;
    images: ProductImage[];
  };
};
