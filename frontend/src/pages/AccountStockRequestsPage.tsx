import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { stockRequestsApi } from "@/features/stock-requests/api";
import type { StockRequest } from "@/types/stock-request";
import { stockRequestStatusLabel } from "@/utils/order-labels";

export default function AccountStockRequestsPage() {
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      setRequests(await stockRequestsApi.listMine());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudieron cargar tus solicitudes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const cancel = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await stockRequestsApi.cancelMine(id);
      setSuccess("Solicitud cancelada.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo cancelar la solicitud");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold">Solicitudes de stock</h2>
        <p className="text-muted-foreground">Consulta los productos por los que pediste aviso de disponibilidad.</p>
      </div>

      {error ? <p className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      {success ? <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p> : null}
      {isLoading ? <p className="rounded-3xl border bg-card p-6">Cargando solicitudes...</p> : null}
      {!isLoading && requests.length === 0 ? (
        <div className="rounded-3xl border bg-card p-6 text-muted-foreground">No tenes solicitudes de stock.</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((request) => {
          const image = request.product.images[0]?.url;
          return (
            <article key={request.id} className="overflow-hidden rounded-3xl border bg-card shadow-sm">
              {image ? <img src={image} alt={request.product.name} className="h-40 w-full object-cover" /> : null}
              <div className="space-y-3 p-5">
                <div>
                  <h3 className="font-heading text-xl font-bold">{request.product.name}</h3>
                  <p className="text-sm text-muted-foreground">Fecha: {new Date(request.createdAt).toLocaleDateString("es-AR")}</p>
                  <p className="text-sm text-muted-foreground">Estado: {stockRequestStatusLabel(request.status)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/productos/${request.product.slug}`}>Ver producto</Link>
                  </Button>
                  {request.status === "PENDING" ? (
                    <Button variant="destructive" size="sm" onClick={() => void cancel(request.id)}>
                      Cancelar solicitud
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
