import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usersService } from "@/services/users.service";
import type { User } from "@/types/user";

export default function AccountProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void usersService.getMe()
      .then((loaded) => {
        setUser(loaded);
        setFirstName(loaded.firstName);
        setLastName(loaded.lastName);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "No se pudo cargar tu perfil"))
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError("Nombre y apellido deben tener al menos 2 caracteres.");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await usersService.updateMe({ firstName: firstName.trim(), lastName: lastName.trim() });
      setUser(updated);
      setSuccess("Tus datos fueron actualizados.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudieron guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="rounded-3xl border bg-card p-6">Cargando tus datos...</p>;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold">Mis datos</h2>
        <p className="text-muted-foreground">Actualiza tu informacion basica. El email queda solo lectura.</p>
      </div>

      <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-3xl border bg-card p-6 shadow-sm">
        {error ? <p className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
        {success ? <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email ?? ""} readOnly className="bg-muted" />
          <p className="text-xs text-muted-foreground">El cambio de email requiere verificacion y queda para una etapa posterior.</p>
        </div>

        <Button type="submit" disabled={isSaving}>{isSaving ? "Guardando..." : "Guardar cambios"}</Button>
      </form>
    </section>
  );
}
