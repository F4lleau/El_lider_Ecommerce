import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminError, AdminLoading } from "@/components/admin/AdminState";
import { adminPromotionalApi } from "@/features/admin/api";
import { useAdminData } from "@/features/admin/use-admin-data";
import type { PopupFrequency, PromoLinkType, PromotionalPopup, PromotionalPopupWrite, PromotionalSlide, PromotionalSlideWrite } from "@/types/promotional-content";

const linkOptions: Array<{ value: PromoLinkType; label: string }> = [
  { value: "OFFERS", label: "Ofertas" },
  { value: "BEST_SELLERS", label: "Mas vendidos" },
  { value: "CATEGORY", label: "Categoria" },
  { value: "PRODUCT", label: "Producto" },
  { value: "SEARCH", label: "Busqueda" },
  { value: "INTERNAL_URL", label: "URL interna" },
];

const frequencyOptions: Array<{ value: PopupFrequency; label: string }> = [
  { value: "ONCE_PER_DAY", label: "Una vez por dia" },
  { value: "ONCE", label: "Una sola vez" },
  { value: "ONCE_PER_SESSION", label: "Una vez por sesion" },
  { value: "ALWAYS", label: "Siempre" },
];

const toDateInput = (value?: string | null) => value ? value.slice(0, 16) : "";
const fromDateInput = (value: string) => value ? new Date(value).toISOString() : null;
const parseIds = (value: string) => value.split(",").map((item) => Number(item.trim())).filter((item) => Number.isInteger(item) && item > 0);
const idsText = (value?: number[] | null) => Array.isArray(value) ? value.join(", ") : "";

const emptySlide: PromotionalSlideWrite = {
  title: "",
  subtitle: "",
  imageUrl: "",
  imageAlt: "",
  ctaLabel: "Ver mas",
  linkType: "OFFERS",
  linkValue: "",
  badge: "",
  startsAt: null,
  endsAt: null,
  priority: 0,
  isFeatured: false,
  isActive: true,
};

const emptyPopup: PromotionalPopupWrite = {
  title: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  ctaLabel: "",
  linkType: null,
  linkValue: "",
  frequency: "ONCE_PER_DAY",
  startsAt: null,
  endsAt: null,
  productIds: [],
  categoryIds: [],
  priority: 0,
  isActive: true,
};

function SlideForm({ editing, onSaved, onCancel }: { editing?: PromotionalSlide | null; onSaved: () => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<PromotionalSlideWrite>(editing ?? emptySlide);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = { ...form, startsAt: fromDateInput(String(form.startsAt ?? "")), endsAt: fromDateInput(String(form.endsAt ?? "")) };
      if (editing) await adminPromotionalApi.updateSlide(editing.id, payload);
      else await adminPromotionalApi.createSlide(payload);
      await onSaved();
      if (!editing) setForm(emptySlide);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar el slide");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4 rounded-2xl border bg-card p-4" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>Titulo</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Badge</Label><Input value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} /></div>
        <div className="md:col-span-2"><Label>Subtitulo</Label><Textarea value={form.subtitle ?? ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
        <div><Label>Imagen URL</Label><Input required value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
        <div><Label>Alt imagen</Label><Input required value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} /></div>
        <div><Label>CTA</Label><Input required value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} /></div>
        <div><Label>Destino</Label><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.linkType} onChange={(e) => setForm({ ...form, linkType: e.target.value as PromoLinkType })}>{linkOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        <div><Label>Valor destino</Label><Input placeholder="slug, id, busqueda o /ruta" value={form.linkValue ?? ""} onChange={(e) => setForm({ ...form, linkValue: e.target.value })} /></div>
        <div><Label>Prioridad</Label><Input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} /></div>
        <div><Label>Inicio</Label><Input type="datetime-local" value={toDateInput(String(form.startsAt ?? ""))} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} /></div>
        <div><Label>Fin</Label><Input type="datetime-local" value={toDateInput(String(form.endsAt ?? ""))} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} /></div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm font-bold">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />Destacada</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />Activa</label>
      </div>
      {error ? <p className="text-sm font-bold text-destructive">{error}</p> : null}
      <div className="flex gap-2"><Button disabled={saving}>{saving ? "Guardando..." : editing ? "Actualizar slide" : "Crear slide"}</Button>{editing ? <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button> : null}</div>
    </form>
  );
}

function PopupForm({ editing, onSaved, onCancel }: { editing?: PromotionalPopup | null; onSaved: () => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<PromotionalPopupWrite>(editing ?? emptyPopup);
  const [productIds, setProductIds] = useState(idsText(editing?.productIds));
  const [categoryIds, setCategoryIds] = useState(idsText(editing?.categoryIds));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = { ...form, startsAt: fromDateInput(String(form.startsAt ?? "")), endsAt: fromDateInput(String(form.endsAt ?? "")), productIds: parseIds(productIds), categoryIds: parseIds(categoryIds) };
      if (editing) await adminPromotionalApi.updatePopup(editing.id, payload);
      else await adminPromotionalApi.createPopup(payload);
      await onSaved();
      if (!editing) setForm(emptyPopup);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar el popup");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4 rounded-2xl border bg-card p-4" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>Titulo</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Frecuencia</Label><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value as PopupFrequency })}>{frequencyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        <div className="md:col-span-2"><Label>Descripcion</Label><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div><Label>Imagen URL</Label><Input value={form.imageUrl ?? ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
        <div><Label>Alt imagen</Label><Input value={form.imageAlt ?? ""} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} /></div>
        <div><Label>CTA</Label><Input value={form.ctaLabel ?? ""} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} /></div>
        <div><Label>Destino</Label><select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.linkType ?? ""} onChange={(e) => setForm({ ...form, linkType: e.target.value ? e.target.value as PromoLinkType : null })}><option value="">Sin CTA</option>{linkOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        <div><Label>Valor destino</Label><Input value={form.linkValue ?? ""} onChange={(e) => setForm({ ...form, linkValue: e.target.value })} /></div>
        <div><Label>Prioridad</Label><Input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} /></div>
        <div><Label>Productos asociados</Label><Input placeholder="1, 2, 3" value={productIds} onChange={(e) => setProductIds(e.target.value)} /></div>
        <div><Label>Categorias asociadas</Label><Input placeholder="1, 2, 3" value={categoryIds} onChange={(e) => setCategoryIds(e.target.value)} /></div>
        <div><Label>Inicio</Label><Input type="datetime-local" value={toDateInput(String(form.startsAt ?? ""))} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} /></div>
        <div><Label>Fin</Label><Input type="datetime-local" value={toDateInput(String(form.endsAt ?? ""))} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />Popup activo</label>
      {error ? <p className="text-sm font-bold text-destructive">{error}</p> : null}
      <div className="flex gap-2"><Button disabled={saving}>{saving ? "Guardando..." : editing ? "Actualizar popup" : "Crear popup"}</Button>{editing ? <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button> : null}</div>
    </form>
  );
}

export default function AdminPromotionsPage() {
  const { data, isLoading, error, reload } = useAdminData(async () => {
    const [slides, popups] = await Promise.all([adminPromotionalApi.listSlides(), adminPromotionalApi.listPopups()]);
    return { slides, popups };
  });
  const [editingSlide, setEditingSlide] = useState<PromotionalSlide | null>(null);
  const [editingPopup, setEditingPopup] = useState<PromotionalPopup | null>(null);
  const sortedSlides = useMemo(() => [...(data?.slides ?? [])].sort((a, b) => b.priority - a.priority), [data?.slides]);
  const sortedPopups = useMemo(() => [...(data?.popups ?? [])].sort((a, b) => b.priority - a.priority), [data?.popups]);

  if (isLoading) return <AdminLoading />;
  if (error) return <AdminError message={error} />;

  const refresh = async () => { setEditingSlide(null); setEditingPopup(null); await reload(); };

  return (
    <div className="space-y-10">
      <div><span className="eyebrow">Marketing</span><h1 className="section-title">Promociones</h1></div>
      <section className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="mb-3 font-heading text-xl font-extrabold">Slides del carousel</h2>
          <SlideForm key={editingSlide?.id ?? "new-slide"} editing={editingSlide} onSaved={refresh} onCancel={() => setEditingSlide(null)} />
        </div>
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="admin-table">
            <thead><tr><th>Titulo</th><th>Prioridad</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>{sortedSlides.map((slide) => <tr key={slide.id}><td className="font-bold">{slide.title}</td><td>{slide.priority}{slide.isFeatured ? " / destacada" : ""}</td><td><Badge variant={slide.isActive ? "secondary" : "destructive"}>{slide.isActive ? "Activa" : "Inactiva"}</Badge></td><td><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setEditingSlide(slide)}>Editar</Button><Button size="sm" variant="destructive" onClick={() => void adminPromotionalApi.deactivateSlide(slide.id).then(reload)}>Desactivar</Button></div></td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <section className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="mb-3 font-heading text-xl font-extrabold">Pop-ups promocionales</h2>
          <PopupForm key={editingPopup?.id ?? "new-popup"} editing={editingPopup} onSaved={refresh} onCancel={() => setEditingPopup(null)} />
        </div>
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="admin-table">
            <thead><tr><th>Titulo</th><th>Frecuencia</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>{sortedPopups.map((popup) => <tr key={popup.id}><td className="font-bold">{popup.title}</td><td>{popup.frequency}</td><td><Badge variant={popup.isActive ? "secondary" : "destructive"}>{popup.isActive ? "Activo" : "Inactivo"}</Badge></td><td><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setEditingPopup(popup)}>Editar</Button><Button size="sm" variant="destructive" onClick={() => void adminPromotionalApi.deactivatePopup(popup.id).then(reload)}>Desactivar</Button></div></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
