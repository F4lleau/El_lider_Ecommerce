import type { DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus } from "./order";

export type Payment = {
  id: number;
  provider: "MERCADOPAGO";
  providerPaymentId: string | null;
  providerPreferenceId: string | null;
  status: PaymentStatus;
  amount: string;
  currency: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentPreference = {
  preferenceId: string;
  initPoint: string | null;
  sandboxInitPoint: string | null;
};

export type OrderPaymentStatus = {
  id: number;
  orderNumber: string;
  trackingCode: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  total: string;
  payment: Payment | null;
};
