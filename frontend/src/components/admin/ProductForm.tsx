import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminCategoriesApi, adminProductsApi } from "@/features/admin/api";
import type { Product } from "@/types/product";

export function ProductForm({ product }: { product?: Product }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Array<{ id: number; name: string; isActive: boolean }>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name ?? "", sku: product?.sku ?? "", slug: product?.slug ?? "",
    description: product?.description ?? "", price: product?.price ?? "",
    compareAtPrice: product?.compareAtPrice ?? "", stock: String(product?.stock ?? 0),
    categoryId: String(product?.categoryId ?? ""), image: product?.images[0]?.url ?? "",
    isFeatured: product?.isFeatured ?? false, isOffer: product?.isOffer ?? false,
    isNew: product?.isNew ?? false, isActive: product?.isActive ?? true,
  });

  useEffect(() => { void adminCategoriesApi.list().then(setCategories); }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const price = Number(form.price);
    const compareAtPrice = form.compareAtPrice ? Number(form.compareAtPrice) : null;
    if (!form.name || !form.categoryId || price <= 0 || Number(form.stock) < 0) return setError("Revisá nombre, categoría, precio y stock.");
    if (form.isOffer && (!compareAtPrice || compareAtPrice <= price)) return setError("En oferta, el precio anterior debe ser mayor.");
    setLoading(true);
    try {
      const payload = {
        name: form.name, sku: form.sku || null, ...(form.slug && { slug: form.slug }),
        description: form.description || null, price, compareAtPrice, stock: Number(form.stock),
        categoryId: Number(form.categoryId), isFeatured: form.isFeatured, isOffer: form.isOffer,
        isNew: form.isNew, isActive: form.isActive,
        images: form.image ? [{ url: form.image, alt: form.name, isPrimary: true }] : [],
      };
      if (product) await adminProductsApi.update(product.id, payload);
      else await adminProductsApi.create(payload);
      navigate("/admin/productos");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  };

  const text = (key: "name" | "sku" | "slug" | "price" | "compareAtPrice" | "stock" | "image", label: string, type = "text") => (
    <div><Label>{label}</Label><Input type={type} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></div>
  );

  return <form onSubmit={submit} className="space-y-6">
    <div className="grid gap-4 rounded-3xl border bg-card p-5 sm:grid-cols-2">
      {text("name", "Nombre")}{text("sku", "SKU / Código interno")}{text("slug", "Slug")}
      {text("price", "Precio", "number")}{text("compareAtPrice", "Precio anterior", "number")}{text("stock", "Stock", "number")}
      <div><Label>Categoría</Label><select className="admin-select" required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="">Seleccionar</option>{categories.filter((category) => category.isActive || category.id === product?.categoryId).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
      <div className="sm:col-span-2">{text("image", "URL de imagen")}</div>
      <div className="sm:col-span-2"><Label>Descripción</Label><Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
      <div className="sm:col-span-2 flex flex-wrap gap-5">{(["isOffer", "isNew", "isFeatured", "isActive"] as const).map((key) => <label key={key} className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.checked })} />{key}</label>)}</div>
    </div>
    {error ? <p className="text-sm font-bold text-destructive">{error}</p> : null}
    <div className="flex gap-3"><Button disabled={loading}>{loading ? "Guardando..." : "Guardar producto"}</Button><Button type="button" variant="outline" onClick={() => navigate("/admin/productos")}>Cancelar</Button></div>
  </form>;
}
