import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleAlert, CircleCheck, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentsApi } from "@/features/payments/api";
import type { OrderPaymentStatus } from "@/types/payment";
import { orderStatusLabel, paymentStatusLabel } from "@/utils/order-labels";

type ResultKind = "success" | "pending" | "failure";
const content = {
  success: { title: "Pago recibido", text: "Estamos consultando el estado real del pago.", Icon: CircleCheck },
  pending: { title: "Pago pendiente", text: "Mercado Pago todavía está procesando la operación.", Icon: Clock3 },
  failure: { title: "Pago no completado", text: "Podés consultar el estado real o intentar nuevamente.", Icon: CircleAlert },
};

export default function CheckoutPaymentResultPage({ kind }: { kind: ResultKind }) {
  const [params] = useSearchParams();
  const orderId = Number(params.get("orderId"));
  const trackingCode = params.get("trackingCode") ?? undefined;
  const email = params.get("email") ?? undefined;
  const [order, setOrder] = useState<OrderPaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selected = content[kind];

  useEffect(() => {
    if (!Number.isInteger(orderId)) { setError("Falta identificar la orden"); return; }
    void paymentsApi.getOrderPayment(orderId, trackingCode).then(setOrder).catch((caught) => setError(caught instanceof Error ? caught.message : "No se pudo consultar el pago"));
  }, [orderId, trackingCode]);

  const retryQuery = order ? new URLSearchParams({ trackingCode: order.trackingCode, ...(email ? { email } : {}) }).toString() : "";
  return <div className="section-shell"><div className="empty-state mx-auto max-w-2xl"><selected.Icon className="mx-auto mb-5 h-14 w-14 text-primary" /><h1 className="section-title">{selected.title}</h1><p className="mt-3 text-muted-foreground">{selected.text}</p>{error ? <p className="mt-5 text-destructive">{error}</p> : null}{order ? <div className="my-6 rounded-2xl bg-secondary p-5"><p className="font-bold">{order.orderNumber}</p><p className="mt-2">Estado del pago: <b>{paymentStatusLabel(order.paymentStatus)}</b></p><p>Estado de la orden: <b>{orderStatusLabel(order.status, order.deliveryMethod)}</b></p><p className="mt-2 text-sm">Número de seguimiento: {order.trackingCode}</p></div> : <p className="my-6">Consultando estado real...</p>}<div className="flex flex-wrap justify-center gap-3">{order ? <Button asChild><Link to={`/pedido/${order.trackingCode}`}>Ver seguimiento</Link></Button> : null}{order && order.paymentStatus !== "APPROVED" ? <Button variant="outline" asChild><Link to={`/checkout/payment/${order.id}?${retryQuery}`}>Reintentar pago</Link></Button> : null}<Button variant="outline" asChild><Link to="/">Volver al inicio</Link></Button></div></div></div>;
}
