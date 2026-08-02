import type { DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus } from "@/types/order";
import type { StockRequestStatus } from "@/types/stock-request";

type KnownOrderStatus = OrderStatus | "PENDING_CONFIRMATION";

const orderStatusLabels: Record<KnownOrderStatus, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pago aprobado",
  CONFIRMED: "Pedido confirmado",
  PENDING_CONFIRMATION: "Pendiente de confirmación",
  PREPARING: "En preparación",
  READY_FOR_PICKUP: "Listo para retirar",
  SHIPPED: "En camino",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
  COMPLETED: "Completado",
};

const pickupOrderStatusLabels: Partial<Record<KnownOrderStatus, string>> = {
  DELIVERED: "Retirado",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pago pendiente",
  APPROVED: "Pago aprobado",
  IN_PROCESS: "Pago en proceso",
  REJECTED: "Pago rechazado",
  CANCELLED: "Pago cancelado",
  REFUNDED: "Pago reembolsado",
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: "Efectivo",
  MERCADOPAGO: "Mercado Pago",
};

const deliveryMethodLabels: Record<DeliveryMethod, string> = {
  PICKUP: "Retiro en sucursal",
  SHIPPING: "Envío a domicilio",
};

const stockRequestStatusLabels: Record<StockRequestStatus, string> = {
  PENDING: "Pendiente",
  CONTACTED: "Contactado",
  NOTIFIED: "Notificado",
  CANCELLED: "Cancelado",
};

export const orderStatusLabel = (status: KnownOrderStatus, deliveryMethod?: DeliveryMethod) =>
  deliveryMethod === "PICKUP" ? pickupOrderStatusLabels[status] ?? orderStatusLabels[status] : orderStatusLabels[status];

export const paymentStatusLabel = (status: PaymentStatus) => paymentStatusLabels[status];

export const paymentMethodLabel = (method: PaymentMethod) => paymentMethodLabels[method];

export const deliveryMethodLabel = (method: DeliveryMethod) => deliveryMethodLabels[method];

export const stockRequestStatusLabel = (status: StockRequestStatus) => stockRequestStatusLabels[status];

export const orderStatusOptionsForDelivery = (deliveryMethod: DeliveryMethod, currentStatus?: OrderStatus): OrderStatus[] => {
  if (currentStatus === "PENDING_PAYMENT") return ["PENDING_PAYMENT", "CANCELLED"];
  if (currentStatus === "PAID") return ["PAID", "CONFIRMED", "CANCELLED", "REFUNDED"];
  const options: OrderStatus[] = deliveryMethod === "PICKUP"
    ? ["CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "DELIVERED", "CANCELLED"]
    : ["CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];
  return currentStatus && !options.includes(currentStatus) ? [currentStatus, ...options] : options;
};
