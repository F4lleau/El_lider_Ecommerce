import { Boxes, ClipboardList, PackageX, Tags, BellRing, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AdminError, AdminLoading } from "@/components/admin/AdminState";
import { adminDashboardApi } from "@/features/admin/api";
import { useAdminData } from "@/features/admin/use-admin-data";

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useAdminData(adminDashboardApi.load);
  if (isLoading) return <AdminLoading />;
  if (error || !data) return <AdminError message={error ?? "No se pudo cargar el dashboard"} />;
  const cards = [
    ["Productos activos", data.products.filter((item) => item.isActive).length, Boxes],
    ["Categorías activas", data.categories.filter((item) => item.isActive).length, Tags],
    ["Pedidos pendientes", data.orders.filter((item) => item.status === "PENDING_PAYMENT").length, Clock3],
    ["Solicitudes pendientes", data.stockRequests.filter((item) => item.status === "PENDING").length, BellRing],
    ["Productos sin stock", data.products.filter((item) => item.stock === 0).length, PackageX],
    ["Pedidos totales", data.orders.length, ClipboardList],
  ] as const;
  return <div><div className="mb-7"><span className="eyebrow">Operación</span><h1 className="section-title">Dashboard</h1><p className="mt-2 text-muted-foreground">Un vistazo rápido al estado de la tienda.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value, Icon]) => <article key={label} className="rounded-3xl border bg-card p-5 shadow-card"><Icon className="mb-5 h-6 w-6 text-primary" /><p className="text-sm font-bold text-muted-foreground">{label}</p><p className="mt-2 font-heading text-4xl font-extrabold">{value}</p></article>)}</div><div className="mt-8 flex flex-wrap gap-3"><Button asChild><Link to="/admin/productos/nuevo">Crear producto</Link></Button><Button variant="outline" asChild><Link to="/admin/categorias/nueva">Crear categoría</Link></Button><Button variant="outline" asChild><Link to="/admin/pedidos">Ver pedidos</Link></Button><Button variant="outline" asChild><Link to="/admin/solicitudes-stock">Ver solicitudes</Link></Button></div></div>;
}
