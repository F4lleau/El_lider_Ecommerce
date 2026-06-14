import { Link } from "react-router-dom";
import { useMyOrders } from "@/features/orders/hooks";

export default function MyOrdersPage() {
  const { data, isLoading, error } = useMyOrders();
  return <div className="section-shell"><h1 className="section-title">Mis pedidos</h1>{isLoading ? <p className="mt-6">Cargando...</p> : null}{error ? <p className="mt-6 text-destructive">{error}</p> : null}{!isLoading && !data.length ? <div className="empty-state mt-8">Todavía no tenés pedidos.</div> : <div className="mt-8 grid gap-4">{data.map((order) => <Link to={`/mi-cuenta/pedidos/${order.id}`} key={order.id} className="rounded-2xl border bg-card p-5"><p className="font-bold">{order.orderNumber}</p><p className="text-sm text-muted-foreground">{order.status} · {order.trackingCode}</p><p className="mt-2 font-bold">${Number(order.total).toLocaleString("es-AR")}</p></Link>)}</div>}</div>;
}
