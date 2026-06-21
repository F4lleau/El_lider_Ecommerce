import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminState";
import { adminOrdersApi } from "@/features/admin/api";
import { useAdminData } from "@/features/admin/use-admin-data";
import { deliveryMethodLabel, orderStatusLabel, paymentMethodLabel, paymentStatusLabel } from "@/utils/order-labels";

const customer = (order: { user?: { firstName: string; lastName: string; email: string } | null; guestName?: string | null; guestEmail?: string | null }) =>
  order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestName ?? order.guestEmail ?? "Invitado";

export default function AdminOrdersPage() {
  const { data = [], isLoading, error } = useAdminData(adminOrdersApi.list);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [delivery, setDelivery] = useState("");
  const orders = data ?? [];
  const statuses = useMemo(() => [...new Set(orders.map((order) => order.status))], [orders]);
  const filtered = orders.filter((order) =>
    (!status || order.status === status) &&
    (!delivery || order.deliveryMethod === delivery) &&
    `${order.trackingCode} ${customer(order)}`.toLowerCase().includes(query.toLowerCase())
  );

  if (isLoading) return <AdminLoading />;
  if (error) return <AdminError message={error} />;

  return <div><div className="mb-6"><span className="eyebrow">Operación</span><h1 className="section-title">Pedidos</h1></div><div className="mb-5 grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-3"><Input placeholder="Código de seguimiento o cliente..." value={query} onChange={(event) => setQuery(event.target.value)} /><select className="admin-select" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos los estados</option>{statuses.map((item) => <option key={item} value={item}>{orderStatusLabel(item)}</option>)}</select><select className="admin-select" value={delivery} onChange={(event) => setDelivery(event.target.value)}><option value="">Toda entrega</option><option value="PICKUP">{deliveryMethodLabel("PICKUP")}</option><option value="SHIPPING">{deliveryMethodLabel("SHIPPING")}</option></select></div>{filtered.length === 0 ? <AdminEmpty message="No hay pedidos." /> : <div className="overflow-x-auto rounded-2xl border bg-card"><table className="admin-table"><thead><tr><th>Orden</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Pago</th><th>Entrega</th><th></th></tr></thead><tbody>{filtered.map((order) => <tr key={order.id}><td><p className="font-bold">{order.orderNumber}</p><p className="text-xs text-muted-foreground">N° seguimiento: {order.trackingCode}</p></td><td>{customer(order)}</td><td>{new Date(order.createdAt).toLocaleDateString("es-AR")}</td><td>${Number(order.total).toLocaleString("es-AR")}</td><td><Badge variant="outline">{orderStatusLabel(order.status, order.deliveryMethod)}</Badge></td><td><p>{paymentMethodLabel(order.paymentMethod)}</p><p className="text-xs text-muted-foreground">{paymentStatusLabel(order.paymentStatus)}</p></td><td>{deliveryMethodLabel(order.deliveryMethod)}</td><td><Button size="sm" variant="outline" asChild><Link to={`/admin/pedidos/${order.id}`}>Ver</Link></Button></td></tr>)}</tbody></table></div>}</div>;
}
