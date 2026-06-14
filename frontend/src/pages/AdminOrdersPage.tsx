import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminState";
import { adminOrdersApi } from "@/features/admin/api";
import { useAdminData } from "@/features/admin/use-admin-data";

const customer = (order: { user?: { firstName: string; lastName: string; email: string } | null; guestName?: string | null; guestEmail?: string | null }) => order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestName ?? order.guestEmail ?? "Invitado";
export default function AdminOrdersPage() {
  const { data = [], isLoading, error } = useAdminData(adminOrdersApi.list); const [query, setQuery] = useState(""); const [status, setStatus] = useState(""); const [delivery, setDelivery] = useState("");
  const statuses = useMemo(() => [...new Set((data ?? []).map((o) => o.status))], [data]); const filtered = (data ?? []).filter((o) => (!status || o.status === status) && (!delivery || o.deliveryMethod === delivery) && `${o.trackingCode} ${customer(o)}`.toLowerCase().includes(query.toLowerCase()));
  if (isLoading) return <AdminLoading />; if (error) return <AdminError message={error} />;
  return <div><div className="mb-6"><span className="eyebrow">Operación</span><h1 className="section-title">Pedidos</h1></div><div className="mb-5 grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-3"><Input placeholder="Tracking o cliente..." value={query} onChange={(e) => setQuery(e.target.value)} /><select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos los estados</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select><select className="admin-select" value={delivery} onChange={(e) => setDelivery(e.target.value)}><option value="">Toda entrega</option><option>PICKUP</option><option>SHIPPING</option></select></div>{filtered.length === 0 ? <AdminEmpty message="No hay pedidos." /> : <div className="overflow-x-auto rounded-2xl border bg-card"><table className="admin-table"><thead><tr><th>Orden</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Pago</th><th>Entrega</th><th></th></tr></thead><tbody>{filtered.map((o) => <tr key={o.id}><td><p className="font-bold">{o.orderNumber}</p><p className="text-xs text-muted-foreground">{o.trackingCode}</p></td><td>{customer(o)}</td><td>{new Date(o.createdAt).toLocaleDateString("es-AR")}</td><td>${Number(o.total).toLocaleString("es-AR")}</td><td><Badge variant="outline">{o.status}</Badge></td><td>{o.paymentStatus}</td><td>{o.deliveryMethod}</td><td><Button size="sm" variant="outline" asChild><Link to={`/admin/pedidos/${o.id}`}>Ver</Link></Button></td></tr>)}</tbody></table></div>}</div>;
}
