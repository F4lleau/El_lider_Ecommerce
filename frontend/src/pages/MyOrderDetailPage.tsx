import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ordersApi } from "@/features/orders/api";
import type { Order } from "@/types/order";
import { deliveryMethodLabel, orderStatusLabel, paymentMethodLabel, paymentStatusLabel } from "@/utils/order-labels";

export default function MyOrderDetailPage() {
  const id = Number(useParams().id);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void ordersApi.getMine(id).then(setOrder).catch((caught) => setError(caught instanceof Error ? caught.message : "Pedido no encontrado"));
  }, [id]);

  return <div className="section-shell">{error ? <div className="empty-state text-destructive">{error}</div> : null}{order ? <><h1 className="section-title">{order.orderNumber}</h1><div className="mt-3 space-y-1 text-muted-foreground"><p>Número de seguimiento: {order.trackingCode}</p><p>{orderStatusLabel(order.status, order.deliveryMethod)} · {paymentMethodLabel(order.paymentMethod)} · {paymentStatusLabel(order.paymentStatus)} · {deliveryMethodLabel(order.deliveryMethod)}</p></div><div className="mt-6 rounded-3xl border bg-card p-6">{order.items.map((item) => <p key={item.id}>{item.quantity} x {item.productName}{item.productSku ? ` (${item.productSku})` : ""} · ${Number(item.totalPrice).toLocaleString("es-AR")}</p>)}<p className="mt-5 font-heading text-xl font-bold">Total: ${Number(order.total).toLocaleString("es-AR")}</p></div></> : null}</div>;
}
