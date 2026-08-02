import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMyOrders } from "@/features/orders/hooks";
import { deliveryMethodLabel, orderStatusLabel, paymentMethodLabel, paymentStatusLabel } from "@/utils/order-labels";

export default function MyOrdersPage() {
  const { data, isLoading, error } = useMyOrders();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold">Mis pedidos</h2>
        <p className="text-muted-foreground">Historial de compras realizadas con tu cuenta.</p>
      </div>

      {isLoading ? <p className="rounded-3xl border bg-card p-6">Cargando pedidos...</p> : null}
      {error ? <p className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      {!isLoading && data.length === 0 ? (
        <div className="rounded-3xl border bg-card p-6 text-muted-foreground">Todavia no tenes pedidos.</div>
      ) : null}

      <div className="grid gap-4">
        {data.map((order) => (
          <article key={order.id} className="rounded-3xl border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-heading text-xl font-bold">{order.orderNumber}</h3>
                <p className="text-sm text-muted-foreground">Numero de seguimiento: {order.trackingCode}</p>
                <p className="text-sm text-muted-foreground">Fecha: {new Date(order.createdAt).toLocaleDateString("es-AR")}</p>
              </div>
              <p className="font-heading text-2xl font-bold">${Number(order.total).toLocaleString("es-AR")}</p>
            </div>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <p><span className="text-muted-foreground">Entrega:</span> {deliveryMethodLabel(order.deliveryMethod)}</p>
              <p><span className="text-muted-foreground">Pago:</span> {paymentMethodLabel(order.paymentMethod)}</p>
              <p><span className="text-muted-foreground">Pedido:</span> {orderStatusLabel(order.status, order.deliveryMethod)}</p>
              <p><span className="text-muted-foreground">Estado de pago:</span> {paymentStatusLabel(order.paymentStatus)}</p>
            </div>

            <Button asChild className="mt-5">
              <Link to={`/mi-cuenta/pedidos/${order.id}`}>Ver detalle</Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
