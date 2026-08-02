import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ordersApi } from "@/features/orders/api";
import { paymentsApi } from "@/features/payments/api";
import type { Order } from "@/types/order";
import { deliveryMethodLabel, orderStatusLabel, paymentMethodLabel, paymentStatusLabel } from "@/utils/order-labels";

const money = (value: string | number) => `$${Number(value).toLocaleString("es-AR")}`;

export default function MyOrderDetailPage() {
  const id = Number(useParams().id);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError("Pedido no encontrado");
      setIsLoading(false);
      return;
    }
    void ordersApi.getMine(id)
      .then(setOrder)
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Pedido no encontrado"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const payWithMercadoPago = async () => {
    if (!order) return;
    setIsPaying(true);
    setPaymentError(null);
    try {
      const preference = await paymentsApi.createPreference(order.id);
      const redirectTo = preference.sandboxInitPoint || preference.initPoint;
      if (!redirectTo) throw new Error("Mercado Pago no devolvio una URL de pago.");
      window.location.assign(redirectTo);
    } catch (caught) {
      setPaymentError(caught instanceof Error ? caught.message : "No se pudo iniciar el pago con Mercado Pago.");
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) return <p className="rounded-3xl border bg-card p-6">Cargando pedido...</p>;
  if (error) return <div className="rounded-3xl border bg-card p-6 text-destructive">{error}</div>;
  if (!order) return <div className="rounded-3xl border bg-card p-6 text-muted-foreground">Pedido no encontrado.</div>;

  const isMercadoPagoPending = order.paymentMethod === "MERCADOPAGO" && order.paymentStatus === "PENDING";

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button asChild variant="link" className="mb-2 px-0">
            <Link to="/mi-cuenta/pedidos">Volver a mis pedidos</Link>
          </Button>
          <h2 className="font-heading text-3xl font-bold">{order.orderNumber}</h2>
          <p className="text-muted-foreground">Numero de seguimiento: {order.trackingCode}</p>
        </div>
        <p className="font-heading text-3xl font-bold">{money(order.total)}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Estado del pedido" value={orderStatusLabel(order.status, order.deliveryMethod)} />
        <InfoCard label="Estado de pago" value={paymentStatusLabel(order.paymentStatus)} />
        <InfoCard label="Metodo de pago" value={paymentMethodLabel(order.paymentMethod)} />
        <InfoCard label="Metodo de entrega" value={deliveryMethodLabel(order.deliveryMethod)} />
      </div>

      {order.paymentMethod === "CASH" && order.deliveryMethod === "PICKUP" ? (
        <p className="rounded-3xl border bg-card p-5 text-sm">Pago pendiente en efectivo al retirar. Te avisaremos cuando el pedido este listo para retirar.</p>
      ) : null}
      {order.paymentMethod === "CASH" && order.deliveryMethod === "SHIPPING" ? (
        <p className="rounded-3xl border bg-card p-5 text-sm">Pago pendiente en efectivo al recibir el pedido en tu domicilio.</p>
      ) : null}
      {isMercadoPagoPending ? (
        <div className="rounded-3xl border bg-card p-5">
          <h3 className="font-heading text-xl font-bold">Pago pendiente con Mercado Pago</h3>
          <p className="mt-1 text-sm text-muted-foreground">Para confirmar tu compra, completa el pago online.</p>
          {paymentError ? <p className="mt-3 rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">{paymentError}</p> : null}
          <Button className="mt-4" onClick={() => void payWithMercadoPago()} disabled={isPaying}>
            {isPaying ? "Iniciando pago..." : "Pagar con Mercado Pago"}
          </Button>
        </div>
      ) : null}

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <h3 className="font-heading text-xl font-bold">Productos</h3>
        <div className="mt-4 divide-y">
          {order.items.map((item) => {
            const image = item.product?.images?.[0]?.url;
            return (
              <article key={item.id} className="grid gap-4 py-4 sm:grid-cols-[80px_1fr_auto] sm:items-center">
                {image ? <img src={image} alt={item.productName} className="h-20 w-20 rounded-2xl object-cover" /> : <div className="h-20 w-20 rounded-2xl bg-muted" />}
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">SKU: {item.productSku || "Sin SKU"}</p>
                  <p className="text-sm text-muted-foreground">Cantidad: {item.quantity} - Unitario: {money(item.unitPrice)}</p>
                </div>
                <p className="font-heading text-lg font-bold">{money(item.totalPrice)}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <h3 className="font-heading text-xl font-bold">Totales</h3>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex justify-between"><span>Subtotal productos</span><strong>{money(order.subtotal)}</strong></p>
            <p className="flex justify-between"><span>Costo de envio</span><strong>{money(order.shippingCost)}</strong></p>
            <p className="flex justify-between border-t pt-3 text-lg"><span>Total</span><strong>{money(order.total)}</strong></p>
          </div>
        </section>

        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <h3 className="font-heading text-xl font-bold">Entrega</h3>
          {order.deliveryMethod === "PICKUP" ? (
            <p className="mt-3 text-sm text-muted-foreground">Retiro en sucursal. Te avisaremos cuando este listo para retirar.</p>
          ) : (
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p>{order.shippingRecipient}</p>
              <p>{order.shippingStreet} {order.shippingNumber}{order.shippingApartment ? `, ${order.shippingApartment}` : ""}</p>
              <p>{order.shippingCity}, {order.shippingProvince} ({order.shippingPostalCode})</p>
              {order.shippingReferences ? <p>Referencia: {order.shippingReferences}</p> : null}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-3xl border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </article>
  );
}
