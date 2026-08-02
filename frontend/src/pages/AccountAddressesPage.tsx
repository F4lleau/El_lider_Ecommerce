import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usersService } from "@/services/users.service";
import type { UserAddress, UserAddressPayload } from "@/types/user";

const emptyForm: UserAddressPayload = {
  label: "",
  recipient: "",
  phone: "",
  street: "",
  number: "",
  apartment: "",
  city: "",
  state: "",
  postalCode: "",
  country: "AR",
  isDefault: false,
};

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [form, setForm] = useState<UserAddressPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const editingAddress = useMemo(() => addresses.find((address) => address.id === editingId) ?? null, [addresses, editingId]);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAddresses(await usersService.listAddresses());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudieron cargar tus direcciones");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateField = (key: keyof UserAddressPayload, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startEdit = (address: UserAddress) => {
    setEditingId(address.id);
    setForm({
      label: address.label ?? "",
      recipient: address.recipient,
      phone: address.phone ?? "",
      street: address.street,
      number: address.number,
      apartment: address.apartment ?? "",
      city: address.city,
      state: address.state ?? "",
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setSuccess(null);
    setError(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.recipient.trim() || !form.street.trim() || !form.number.trim() || !form.city.trim() || !form.postalCode.trim()) {
      setError("Completa destinatario, calle, numero, ciudad y codigo postal.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await usersService.updateAddress(editingId, form);
        setSuccess("Direccion actualizada correctamente.");
      } else {
        await usersService.createAddress(form);
        setSuccess("Direccion guardada correctamente.");
      }
      resetForm();
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar la direccion");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await usersService.deleteAddress(id);
      setSuccess("Direccion eliminada.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo eliminar la direccion");
    }
  };

  const setDefault = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await usersService.setDefaultAddress(id);
      setSuccess("Direccion principal actualizada.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo marcar como principal");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold">Mis direcciones</h2>
        <p className="text-muted-foreground">Guarda direcciones para acelerar futuras compras con envio.</p>
      </div>

      {error ? <p className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      {success ? <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {isLoading ? <p className="rounded-3xl border bg-card p-6">Cargando direcciones...</p> : null}
          {!isLoading && addresses.length === 0 ? (
            <div className="rounded-3xl border bg-card p-6 text-muted-foreground">No tenes direcciones cargadas.</div>
          ) : null}
          {addresses.map((address) => (
            <article key={address.id} className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-xl font-bold">{address.label || address.recipient}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {address.street} {address.number}{address.apartment ? `, ${address.apartment}` : ""}, {address.city}
                    {address.state ? `, ${address.state}` : ""} ({address.postalCode})
                  </p>
                  <p className="text-sm text-muted-foreground">Destinatario: {address.recipient}{address.phone ? ` - ${address.phone}` : ""}</p>
                  {address.isDefault ? <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Direccion principal</span> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {!address.isDefault ? <Button size="sm" variant="outline" onClick={() => void setDefault(address.id)}>Marcar principal</Button> : null}
                  <Button size="sm" variant="outline" onClick={() => startEdit(address)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => void remove(address.id)}>Eliminar</Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border bg-card p-5 shadow-sm">
          <h3 className="font-heading text-xl font-bold">{editingAddress ? "Editar direccion" : "Agregar direccion"}</h3>
          <div className="space-y-2">
            <Label>Alias</Label>
            <Input value={form.label ?? ""} onChange={(event) => updateField("label", event.target.value)} placeholder="Casa, trabajo..." />
          </div>
          <div className="space-y-2">
            <Label>Destinatario</Label>
            <Input value={form.recipient} onChange={(event) => updateField("recipient", event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Telefono</Label>
            <Input value={form.phone ?? ""} onChange={(event) => updateField("phone", event.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_110px]">
            <div className="space-y-2">
              <Label>Calle</Label>
              <Input value={form.street} onChange={(event) => updateField("street", event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Numero</Label>
              <Input value={form.number} onChange={(event) => updateField("number", event.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Departamento / piso</Label>
            <Input value={form.apartment ?? ""} onChange={(event) => updateField("apartment", event.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input value={form.city} onChange={(event) => updateField("city", event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Provincia</Label>
              <Input value={form.state ?? ""} onChange={(event) => updateField("state", event.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Codigo postal</Label>
            <Input value={form.postalCode} onChange={(event) => updateField("postalCode", event.target.value)} required />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.isDefault} onChange={(event) => updateField("isDefault", event.target.checked)} />
            Marcar como direccion principal
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSaving}>{isSaving ? "Guardando..." : "Guardar"}</Button>
            {editingId ? <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
