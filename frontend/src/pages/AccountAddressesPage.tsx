import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { usersService } from "../services/users.service";
import type { UserAddress, UserAddressPayload } from "../types/user";

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

type AddressFormProps = {
  form: UserAddressPayload;
  isSaving: boolean;
  submitLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (key: keyof UserAddressPayload, value: string | boolean) => void;
  onCancel?: () => void;
};

const AddressForm = ({ form, isSaving, submitLabel, onSubmit, onChange, onCancel }: AddressFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="address-label">Alias</Label>
        <Input
          id="address-label"
          value={form.label ?? ""}
          onChange={(event) => onChange("label", event.target.value)}
          placeholder="Casa, trabajo..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-recipient">Destinatario</Label>
        <Input
          id="address-recipient"
          value={form.recipient}
          onChange={(event) => onChange("recipient", event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-phone">Teléfono</Label>
        <Input id="address-phone" value={form.phone ?? ""} onChange={(event) => onChange("phone", event.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-street">Calle</Label>
        <Input
          id="address-street"
          value={form.street}
          onChange={(event) => onChange("street", event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-number">Altura</Label>
        <Input
          id="address-number"
          value={form.number}
          onChange={(event) => onChange("number", event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-apartment">Depto. / piso</Label>
        <Input
          id="address-apartment"
          value={form.apartment ?? ""}
          onChange={(event) => onChange("apartment", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-city">Localidad</Label>
        <Input id="address-city" value={form.city} onChange={(event) => onChange("city", event.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-state">Provincia</Label>
        <Input id="address-state" value={form.state ?? ""} onChange={(event) => onChange("state", event.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-postal-code">Código postal</Label>
        <Input
          id="address-postal-code"
          value={form.postalCode}
          onChange={(event) => onChange("postalCode", event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-country">País</Label>
        <Input id="address-country" value={form.country ?? "AR"} onChange={(event) => onChange("country", event.target.value)} />
      </div>
    </div>

    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={!!form.isDefault}
        onChange={(event) => onChange("isDefault", event.target.checked)}
      />
      Marcar como dirección principal
    </label>

    <div className="flex flex-wrap gap-2">
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Guardando..." : submitLabel}
      </Button>
      {onCancel ? (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      ) : null}
    </div>
  </form>
);

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [form, setForm] = useState<UserAddressPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const editingAddress = useMemo(
    () => addresses.find((address) => address.id === editingId) ?? null,
    [addresses, editingId],
  );
  const hasAddresses = addresses.length > 0;
  const showInlineForm = !isLoading && !hasAddresses;

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

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const openCreateModal = () => {
    resetForm();
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.recipient.trim() || !form.street.trim() || !form.number.trim() || !form.city.trim() || !form.postalCode.trim()) {
      setError("Completá destinatario, calle, número, ciudad y código postal.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await usersService.updateAddress(editingId, form);
        setSuccess("Dirección actualizada correctamente.");
      } else {
        await usersService.createAddress(form);
        setSuccess("Dirección guardada correctamente.");
      }
      closeModal();
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar la dirección");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await usersService.deleteAddress(id);
      setSuccess("Dirección eliminada.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo eliminar la dirección");
    }
  };

  const setDefault = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await usersService.setDefaultAddress(id);
      setSuccess("Dirección principal actualizada.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo marcar como principal");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-bold">Mis direcciones</h2>
          <p className="text-muted-foreground">Guardá direcciones para acelerar futuras compras con envío.</p>
        </div>
        {hasAddresses ? (
          <Button type="button" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Agregar dirección
          </Button>
        ) : null}
      </div>

      {error ? <p className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      {success ? <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p> : null}

      {isLoading ? <p className="rounded-3xl border bg-card p-6">Cargando direcciones...</p> : null}

      {showInlineForm ? (
        <div className="max-w-5xl rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="font-heading text-xl font-bold">Agregá tu primera dirección</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No tenés direcciones guardadas. Cargá una para usarla en tus próximas compras.
            </p>
          </div>
          <AddressForm
            form={form}
            isSaving={isSaving}
            submitLabel="Guardar dirección"
            onSubmit={onSubmit}
            onChange={updateField}
          />
        </div>
      ) : null}

      {hasAddresses ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <article key={address.id} className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-xl font-bold">{address.label || address.recipient}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {address.street} {address.number}
                    {address.apartment ? `, ${address.apartment}` : ""}, {address.city}
                    {address.state ? `, ${address.state}` : ""} ({address.postalCode})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Destinatario: {address.recipient}
                    {address.phone ? ` - ${address.phone}` : ""}
                  </p>
                  {address.isDefault ? (
                    <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Dirección principal
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {!address.isDefault ? (
                    <Button size="sm" variant="outline" onClick={() => void setDefault(address.id)}>
                      Marcar principal
                    </Button>
                  ) : null}
                  <Button size="sm" variant="outline" onClick={() => startEdit(address)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => void remove(address.id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <Dialog open={isModalOpen} onOpenChange={(open) => (open ? setIsModalOpen(true) : closeModal())}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Editar dirección" : "Agregar dirección"}</DialogTitle>
            <DialogDescription>
              Completá los datos para usar esta dirección en futuras compras con envío.
            </DialogDescription>
          </DialogHeader>
          <AddressForm
            form={form}
            isSaving={isSaving}
            submitLabel={editingAddress ? "Guardar cambios" : "Guardar dirección"}
            onSubmit={onSubmit}
            onChange={updateField}
            onCancel={closeModal}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
