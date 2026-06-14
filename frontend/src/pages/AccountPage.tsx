import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../features/auth/store";
import { stockRequestsApi } from "../features/stock-requests/api";
import type { StockRequest } from "../types/stock-request";

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const [requests, setRequests] = useState<StockRequest[]>([]);

  useEffect(() => {
    void stockRequestsApi.listMine().then(setRequests).catch(() => setRequests([]));
  }, []);

  return (
    <div className="container space-y-8 py-8">
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-bold">Mi cuenta</h1>
        <p>{user?.firstName} {user?.lastName}</p>
        <p className="text-muted-foreground">{user?.email}</p>
        <div className="flex flex-wrap gap-3"><Button asChild><Link to="/mi-cuenta/pedidos">Ver mis pedidos</Link></Button><Button variant="outline" onClick={logout}>Cerrar sesión</Button></div>
      </div>
      <section>
        <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold"><Bell className="h-5 w-5 text-primary" /> Avisos de stock</h2>
        {requests.length === 0 ? <p className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">Todavía no solicitaste avisos de stock.</p> : (
          <div className="grid gap-3 sm:grid-cols-2">
            {requests.map((request) => <article key={request.id} className="rounded-2xl border bg-card p-4"><p className="font-bold">{request.product.name}</p><p className="mt-1 text-sm text-muted-foreground">Estado: {request.status}</p></article>)}
          </div>
        )}
      </section>
    </div>
  );
}
