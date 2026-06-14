import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminState";
import { adminStockRequestsApi } from "@/features/admin/api";
import { useAdminData } from "@/features/admin/use-admin-data";
import type { StockRequestStatus } from "@/types/stock-request";

const statuses: StockRequestStatus[] = ["PENDING","CONTACTED","NOTIFIED","CANCELLED"];
export default function AdminStockRequestsPage() {
  const { data = [], isLoading, error, reload } = useAdminData(adminStockRequestsApi.list); const [status, setStatus] = useState(""); const [feedback, setFeedback] = useState(""); const filtered = (data ?? []).filter((item) => !status || item.status === status);
  const change = async (id: number, next: StockRequestStatus) => { try { await adminStockRequestsApi.status(id, next); setFeedback("Solicitud actualizada"); await reload(); } catch (caught) { setFeedback(caught instanceof Error ? caught.message : "No se pudo actualizar"); } };
  if (isLoading) return <AdminLoading />; if (error) return <AdminError message={error} />;
  return <div><div className="mb-6"><span className="eyebrow">Operación</span><h1 className="section-title">Solicitudes de stock</h1></div><div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4"><select className="admin-select max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos los estados</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>{feedback ? <p className="text-sm font-bold">{feedback}</p> : null}</div>{filtered.length === 0 ? <AdminEmpty message="No hay solicitudes." /> : <div className="overflow-x-auto rounded-2xl border bg-card"><table className="admin-table"><thead><tr><th>Producto</th><th>Cliente</th><th>Contacto</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td className="font-bold">{item.product.name}</td><td>{item.user ? `${item.user.firstName} ${item.user.lastName}` : item.name ?? "Invitado"}</td><td>{item.email}<br /><span className="text-xs text-muted-foreground">{item.phone ?? "-"}</span></td><td>{new Date(item.createdAt).toLocaleDateString("es-AR")}</td><td><div className="flex items-center gap-2"><Badge variant="outline">{item.status}</Badge><select className="admin-select min-w-36" value={item.status} onChange={(e) => void change(item.id, e.target.value as StockRequestStatus)}>{statuses.map((state) => <option key={state}>{state}</option>)}</select></div></td></tr>)}</tbody></table></div>}</div>;
}
