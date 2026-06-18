import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentsApi } from "@/features/payments/api";
import type { OrderPaymentStatus } from "@/types/payment";

export default function CheckoutPaymentPage() {
  const orderId = Number(useParams().orderId);
  const [params] = useSearchParams();
  const trackingCode = params.get("trackingCode") ?? undefined;
  const email = params.get("email") ?? undefined;
  const [order, setOrder] = useState<OrderPaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  useEffect(() => {
    void paymentsApi.getOrderPayment(orderId, trackingCode).then(setOrder).catch((caught) => setError(caught instanceof Error ? caught.message : "No se pudo consultar la orden")).finally(() => setLoading(false));
  }, [orderId, trackingCode]);
  const pay = async () => {
    setPaying(true); setError(null);
    try {
      const preference = await paymentsApi.createPreference(orderId, trackingCode, email);
      const destination = preference.initPoint ?? preference.sandboxInitPoint;
      if (!destination) throw new Error("Mercado Pago no devolvió una URL de pago");
      window.location.assign(destination);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No se pudo iniciar el pago"); setPaying(false); }
  };
  if (loading) return <div className="section-shell"><div className="empty-state">Consultando orden...</div></div>;
  if (!order) return <div className="section-shell"><div className="empty-state text-destructive">{error ?? "Orden no encontrada"}</div></div>;
  if (order.paymentMethod !== "MERCADOPAGO") return <div className="section-shell"><div className="empty-state">Esta orden se paga en efectivo.</div></div>;
  return <div className="section-shell"><div className="empty-state mx-auto max-w-2xl"><CreditCard className="mx-auto mb-5 h-14 w-14 text-primary" /><h1 className="section-title">Pagar orden</h1><p className="mt-3 text-muted-foreground">{order.orderNumber} · {order.paymentStatus}</p><p className="my-6 font-heading text-3xl font-bold">${Number(order.total).toLocaleString("es-AR")}</p>{error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}{order.paymentStatus === "APPROVED" ? <Button asChild><Link to={`/pedido/${order.trackingCode}`}>Ver pedido pagado</Link></Button> : <Button size="lg" disabled={paying} onClick={() => void pay()}>{paying ? "Conectando..." : "Pagar con Mercado Pago"}</Button>}<Button className="mt-3" variant="outline" asChild><Link to={`/pedido/${order.trackingCode}`}>Ver seguimiento</Link></Button></div></div>;
}
