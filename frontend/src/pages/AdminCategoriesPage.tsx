import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminState";
import { adminCategoriesApi } from "@/features/admin/api";
import { useAdminData } from "@/features/admin/use-admin-data";

export default function AdminCategoriesPage() {
  const { data = [], isLoading, error, reload } = useAdminData(adminCategoriesApi.list); const action = async (id: number, active: boolean) => { if (active) await adminCategoriesApi.deactivate(id); else await adminCategoriesApi.update(id, { isActive: true }); await reload(); };
  if (isLoading) return <AdminLoading />; if (error) return <AdminError message={error} />;
  return <div><div className="mb-6 flex items-end justify-between gap-3"><div><span className="eyebrow">Catálogo</span><h1 className="section-title">Categorías</h1></div><Button asChild><Link to="/admin/categorias/nueva">Crear categoría</Link></Button></div>{!data?.length ? <AdminEmpty message="No hay categorías." /> : <div className="overflow-x-auto rounded-2xl border bg-card"><table className="admin-table"><thead><tr><th>Nombre</th><th>Slug</th><th>Productos</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{data.map((c) => <tr key={c.id}><td className="font-bold">{c.name}</td><td>{c.slug}</td><td>{c._count?.products ?? "-"}</td><td><Badge variant={c.isActive ? "secondary" : "destructive"}>{c.isActive ? "Activa" : "Inactiva"}</Badge></td><td><div className="flex gap-2"><Button size="sm" variant="outline" asChild><Link to={`/admin/categorias/${c.id}/editar`}>Editar</Link></Button><Button size="sm" variant={c.isActive ? "destructive" : "default"} onClick={() => void action(c.id, c.isActive)}>{c.isActive ? "Desactivar" : "Activar"}</Button></div></td></tr>)}</tbody></table></div>}</div>;
}
