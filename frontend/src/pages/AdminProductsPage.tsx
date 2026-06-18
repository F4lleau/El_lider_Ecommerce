import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminState";
import { adminProductsApi } from "@/features/admin/api";
import { useAdminData } from "@/features/admin/use-admin-data";

export default function AdminProductsPage() {
  const { data = [], isLoading, error, reload } = useAdminData(adminProductsApi.list);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [stock, setStock] = useState("");
  const [offer, setOffer] = useState(false);
  const [feedback, setFeedback] = useState("");
  const products = data ?? [];
  const categories = useMemo(() => [...new Set(products.map((item) => item.category.name))], [products]);
  const filtered = products.filter((product) => `${product.name} ${product.sku ?? ""}`.toLowerCase().includes(query.toLowerCase())
    && (!category || product.category.name === category) && (!state || String(product.isActive) === state)
    && (!stock || (stock === "empty" ? product.stock === 0 : product.stock > 0)) && (!offer || product.isOffer));
  const action = async (operation: () => Promise<unknown>, message: string) => {
    try { await operation(); setFeedback(message); await reload(); }
    catch (caught) { setFeedback(caught instanceof Error ? caught.message : "No se pudo completar la acción"); }
  };
  if (isLoading) return <AdminLoading />;
  if (error) return <AdminError message={error} />;
  return <div>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><span className="eyebrow">Catálogo</span><h1 className="section-title">Productos</h1></div><Button asChild><Link to="/admin/productos/nuevo">Crear producto</Link></Button></div>
    {feedback ? <p className="mb-4 rounded-xl bg-secondary p-3 text-sm font-bold">{feedback}</p> : null}
    <div className="mb-5 grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-2 xl:grid-cols-5"><Input placeholder="Buscar nombre o SKU..." value={query} onChange={(event) => setQuery(event.target.value)} /><select className="admin-select" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas las categorías</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><select className="admin-select" value={state} onChange={(event) => setState(event.target.value)}><option value="">Todos los estados</option><option value="true">Activos</option><option value="false">Inactivos</option></select><select className="admin-select" value={stock} onChange={(event) => setStock(event.target.value)}><option value="">Todo stock</option><option value="with">Con stock</option><option value="empty">Sin stock</option></select><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={offer} onChange={(event) => setOffer(event.target.checked)} /> Sólo ofertas</label></div>
    {filtered.length === 0 ? <AdminEmpty message="No hay productos con esos filtros." /> : <div className="overflow-x-auto rounded-2xl border bg-card"><table className="admin-table"><thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Flags</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}>
      <td><div className="flex min-w-56 items-center gap-3"><img src={product.images[0]?.url ?? "/placeholder.svg"} className="h-12 w-12 rounded-xl object-cover" /><div><p className="font-bold">{product.name}</p><p className="text-xs text-muted-foreground">{product.slug}</p></div></div></td>
      <td className="font-mono text-xs">{product.sku ?? "Sin SKU"}</td><td>{product.category.name}</td>
      <td>${Number(product.price).toLocaleString("es-AR")} {product.compareAtPrice ? <span className="block text-xs line-through">${Number(product.compareAtPrice).toLocaleString("es-AR")}</span> : null}</td><td>{product.stock}</td>
      <td><div className="flex flex-wrap gap-1">{product.isOffer ? <Badge>Oferta</Badge> : null}{product.isNew ? <Badge variant="secondary">Nuevo</Badge> : null}{product.isFeatured ? <Badge variant="outline">Destacado</Badge> : null}</div></td><td><Badge variant={product.isActive ? "secondary" : "destructive"}>{product.isActive ? "Activo" : "Inactivo"}</Badge></td>
      <td><div className="flex min-w-64 flex-wrap gap-2"><Button size="sm" variant="outline" asChild><Link to={`/admin/productos/${product.id}/editar`}>Editar</Link></Button><Button size="sm" variant="outline" onClick={() => { const value = window.prompt("Nuevo stock", String(product.stock)); if (value !== null) void action(() => adminProductsApi.stock(product.id, Number(value)), "Stock actualizado"); }}>Stock</Button><Button size="sm" variant="outline" onClick={() => { const value = window.prompt("Nuevo precio", product.price); if (value !== null) void action(() => adminProductsApi.price(product.id, Number(value), product.compareAtPrice ? Number(product.compareAtPrice) : null, product.isOffer), "Precio actualizado"); }}>Precio</Button><Button size="sm" variant={product.isActive ? "destructive" : "default"} onClick={() => void action(() => product.isActive ? adminProductsApi.deactivate(product.id) : adminProductsApi.update(product.id, { isActive: true }), product.isActive ? "Producto desactivado" : "Producto activado")}>{product.isActive ? "Desactivar" : "Activar"}</Button></div></td>
    </tr>)}</tbody></table></div>}
  </div>;
}
