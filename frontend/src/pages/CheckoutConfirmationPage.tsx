import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order";
import { deliveryMethodLabel, orderStatusLabel, paymentMethodLabel } from "@/utils/order-labels";

const money = (value: string | number) => Number(value).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default function CheckoutConfirmationPage() {
  const order = (useLocation().state as { order?: Order } | null)?.order;
  if (!order) return <Navigate to="/carrito" replace />;

  const query = new URLSearchParams({ trackingCode: order.trackingCode, ...(order.guestEmail ? { email: order.guestEmail } : {}) }).toString();
  const isCash = order.paymentMethod === "CASH";
  const isShipping = order.deliveryMethod === "SHIPPING";
  const message = isCash
    ? isShipping
      ? "Tu pedido fue registrado para envío a domicilio y pago en efectivo al recibir."
      : "Tu pedido fue registrado para retirar en sucursal y pagar en efectivo al retirar."
    : "La orden quedó pendiente de pago online. Para confirmar tu compra, completá el pago con Mercado Pago.";

  return <div className="section-shell"><div className="empty-state mx-auto max-w-2xl"><CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-primary" /><h1 className="section-title">{isCash ? "Pedido confirmado" : "Orden creada"}</h1><p className="mt-3 text-muted-foreground">{message}</p><div className="my-6 rounded-2xl bg-secondary p-5 text-left"><p className="text-sm">Número de orden</p><p className="font-heading text-xl font-bold">{order.orderNumber}</p><p className="mt-3 text-sm">Número de seguimiento</p><p className="font-heading text-xl font-bold">{order.trackingCode}</p><p className="mt-3 text-sm">Método de entrega: <b>{deliveryMethodLabel(order.deliveryMethod)}</b></p><p className="mt-2 text-sm">Método de pago: <b>{paymentMethodLabel(order.paymentMethod)}</b></p><p className="mt-2 text-sm">Estado: <b>{orderStatusLabel(order.status, order.deliveryMethod)}</b></p>{isShipping ? <><p className="mt-2 text-sm">Costo de envío: <b>{money(order.shippingCost)}</b></p><p className="mt-2 text-sm">Total: <b>{money(order.total)}</b></p></> : null}<p className="mt-4 rounded-xl bg-background p-3 text-sm font-semibold">Guardá este código para consultar el estado de tu pedido.</p></div><div className="flex flex-wrap justify-center gap-3">{order.paymentMethod === "MERCADOPAGO" ? <Button asChild><Link to={`/checkout/payment/${order.id}?${query}`}><CreditCard /> Pagar con Mercado Pago</Link></Button> : null}<Button variant="outline" asChild><Link to={`/pedido/${order.trackingCode}`}>Ver seguimiento</Link></Button></div></div></div>;
}
