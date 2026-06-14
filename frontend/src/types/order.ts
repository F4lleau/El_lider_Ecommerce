import type { CartItem, GuestCartItem } from "./cart";

export type DeliveryMethod = "PICKUP" | "SHIPPING";
export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "CONFIRMED" | "PREPARING" | "READY_FOR_PICKUP" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "REFUNDED" | "IN_PROCESS";

export type ShippingAddress = {
  recipient: string; phone: string; street: string; number: string; floor?: string;
  apartment?: string; city: string; province: string; postalCode: string; references?: string;
};

export type CheckoutPayload = {
  deliveryMethod: DeliveryMethod;
  customer?: { name: string; email: string; phone: string };
  address?: ShippingAddress;
  items?: GuestCartItem[];
  notes?: string;
};

export type CheckoutSummary = {
  customer: { name: string; email: string; phone: string };
  deliveryMethod: DeliveryMethod;
  items: CartItem[];
  summary: { subtotal: number; shippingCost: number; total: number };
  pickupAddress?: string;
};

export type OrderItem = {
  id: number; productId: number; productName: string; productSlug: string;
  quantity: number; unitPrice: string; totalPrice: string;
};

export type Order = {
  id: number; orderNumber: string; trackingCode: string; userId: number | null;
  status: OrderStatus; paymentStatus: PaymentStatus; deliveryMethod: DeliveryMethod;
  subtotal: string; shippingCost: string; total: string; items: OrderItem[]; createdAt: string;
};
