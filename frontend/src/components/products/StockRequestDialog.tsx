import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { stockRequestsApi } from "@/features/stock-requests/api";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; productId: number; productName: string; onSuccess: () => void };

export function StockRequestDialog({ open, onOpenChange, productId, productName, onSuccess }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await stockRequestsApi.create(productId, form);
      onSuccess();
      onOpenChange(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo registrar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-xl"><Bell className="h-5 w-5 text-primary" /> Avisarme cuando haya stock</DialogTitle>
          <DialogDescription>Dejanos tus datos y registraremos tu interés por {productName}.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <div><Label htmlFor={`stock-name-${productId}`}>Nombre</Label><Input id={`stock-name-${productId}`} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
          <div><Label htmlFor={`stock-email-${productId}`}>Email</Label><Input id={`stock-email-${productId}`} type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
          <div><Label htmlFor={`stock-phone-${productId}`}>Teléfono</Label><Input id={`stock-phone-${productId}`} type="tel" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></div>
          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
          <Button className="w-full" disabled={loading}>{loading ? "Enviando..." : "Registrar solicitud"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
