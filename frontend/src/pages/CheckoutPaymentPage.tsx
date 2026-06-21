import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentsApi } from "@/features/payments/api";
import type { OrderPaymentStatus } from "@/types/payment";
import { deliveryMethodLabel, orderStatusLabel, paymentMethodLabel, paymentStatusLabel } from "@/utils/order-labels";

const money = (value: string | number) => Number(value).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const paymentErrorMessage = "No se pudo iniciar el pago con Mercado Pago. Revisá la configuración o intentá nuevamente.";

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
    setPaying(true);
    setError(null);
    try {
      const preference = await paymentsApi.createPreference(orderId, trackingCode, email);
      const destination = preference.initPoint ?? preference.sandboxInitPoint;
      if (!destination) throw new Error("Mercado Pago no devolvió una URL de pago");
      window.location.assign(destination);
    } catch (caught) {
      const detail = caught instanceof Error ? caught.message : "";
      setError(detail && detail !== "Error inesperado en la API" ? detail : paymentErrorMessage);
      setPaying(false);
    }
  };

  if (loading) return <div className="section-shell"><div className="empty-state">Consultando orden...</div></div>;
  if (!order) return <div className="section-shell"><div className="empty-state text-destructive">{error ?? "Orden no encontrada"}</div></div>;
  if (order.paymentMethod !== "MERCADOPAGO") return <div className="section-shell"><div className="empty-state">Esta orden se paga en efectivo.</div></div>;

  return <div className="section-shell"><div className="empty-state mx-auto max-w-2xl"><CreditCard className="mx-auto mb-5 h-14 w-14 text-primary" /><h1 className="section-title">Pagar pedido</h1><p className="mt-3 text-muted-foreground">Para confirmar tu compra, completá el pago online con Mercado Pago.</p><div className="my-6 rounded-2xl bg-secondary p-5 text-left"><p className="text-sm">Número de orden</p><p className="font-heading text-xl font-bold">{order.orderNumber}</p><p className="mt-3 text-sm">Número de seguimiento</p><p className="font-heading text-xl font-bold">{order.trackingCode}</p><p className="mt-3 text-sm">Método de pago: <b>{paymentMethodLabel(order.paymentMethod)}</b></p><p className="mt-2 text-sm">Método de entrega: <b>{deliveryMethodLabel(order.deliveryMethod)}</b></p><p className="mt-2 text-sm">Estado del pedido: <b>{orderStatusLabel(order.status, order.deliveryMethod)}</b></p><p className="mt-2 text-sm">Estado de pago: <b>{paymentStatusLabel(order.paymentStatus)}</b></p><p className="mt-4 font-heading text-3xl font-bold">{money(order.total)}</p></div>{error ? <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><p className="font-bold">{paymentErrorMessage}</p><p className="mt-1">{error}</p></div> : null}<div className="flex flex-wrap justify-center gap-3">{order.paymentStatus === "APPROVED" ? <Button asChild><Link to={`/pedido/${order.trackingCode}`}>Ver pedido pagado</Link></Button> : <Button size="lg" disabled={paying} onClick={() => void pay()}>{paying ? "Conectando..." : error ? "Reintentar" : "Pagar con Mercado Pago"}</Button>}<Button variant="outline" asChild><Link to={`/pedido/${order.trackingCode}`}>Ver seguimiento</Link></Button></div></div></div>;
}
