import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ordersApi } from "@/features/orders/api";
import type { Order } from "@/types/order";
import { deliveryMethodLabel, orderStatusLabel, paymentMethodLabel, paymentStatusLabel } from "@/utils/order-labels";

export default function OrderTrackingPage() {
  const { trackingCode = "" } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void ordersApi.track(trackingCode).then(setOrder).catch((caught) => setError(caught instanceof Error ? caught.message : "Pedido no encontrado"));
  }, [trackingCode]);

  return <div className="section-shell"><h1 className="section-title">Seguimiento de pedido</h1>{error ? <div className="empty-state mt-8 text-destructive">{error}</div> : null}{order ? <div className="mt-8 rounded-3xl border bg-card p-6"><p className="font-heading text-xl font-bold">{order.orderNumber}</p><p className="mt-2">Número de seguimiento: <b>{order.trackingCode}</b></p><p className="mt-2">Estado: {orderStatusLabel(order.status, order.deliveryMethod)}</p><p>Pago: {paymentMethodLabel(order.paymentMethod)} · {paymentStatusLabel(order.paymentStatus)}</p><p>Entrega: {deliveryMethodLabel(order.deliveryMethod)}</p><div className="my-5 border-t" />{order.items.map((item) => <p key={item.id}>{item.quantity} x {item.productName}{item.productSku ? ` (${item.productSku})` : ""}</p>)}<p className="mt-5 font-heading text-xl font-bold">Total: ${Number(order.total).toLocaleString("es-AR")}</p></div> : null}</div>;
}
