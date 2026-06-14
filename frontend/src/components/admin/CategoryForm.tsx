import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminCategoriesApi } from "@/features/admin/api";
import type { AdminCategory } from "@/types/admin";

export function CategoryForm({ category }: { category?: AdminCategory }) {
  const navigate = useNavigate(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [form, setForm] = useState({ name: category?.name ?? "", slug: category?.slug ?? "", description: category?.description ?? "", isActive: category?.isActive ?? true });
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (!form.name.trim()) return setError("El nombre es requerido."); setLoading(true); setError(""); try { const payload = { name: form.name, ...(form.slug && { slug: form.slug }), description: form.description || null, isActive: form.isActive }; if (category) await adminCategoriesApi.update(category.id, payload); else await adminCategoriesApi.create(payload); navigate("/admin/categorias"); } catch (caught) { setError(caught instanceof Error ? caught.message : "No se pudo guardar"); } finally { setLoading(false); } };
  return <form className="max-w-3xl space-y-6" onSubmit={submit}><div className="space-y-4 rounded-3xl border bg-card p-5"><div><Label>Nombre</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div><div><Label>Descripción</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />Categoría activa</label></div>{error ? <p className="text-sm font-bold text-destructive">{error}</p> : null}<div className="flex gap-3"><Button disabled={loading}>{loading ? "Guardando..." : "Guardar categoría"}</Button><Button type="button" variant="outline" onClick={() => navigate("/admin/categorias")}>Cancelar</Button></div></form>;
}
