import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../features/auth/store";
import { ordersApi } from "../features/orders/api";
import { stockRequestsApi } from "../features/stock-requests/api";
import { usersService } from "../services/users.service";
import type { Order } from "../types/order";
import type { StockRequest } from "../types/stock-request";
import type { UserAddress } from "../types/user";
import { orderStatusLabel, stockRequestStatusLabel } from "../utils/order-labels";

export default function AccountPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      ordersApi.listMine(),
      stockRequestsApi.listMine(),
      usersService.listAddresses(),
    ])
      .then(([loadedOrders, loadedRequests, loadedAddresses]) => {
        setOrders(loadedOrders);
        setRequests(loadedRequests);
        setAddresses(loadedAddresses);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "No se pudo cargar tu cuenta"))
      .finally(() => setIsLoading(false));
  }, []);

  const recentOrders = orders.slice(0, 3);
  const pendingRequests = requests.filter((request) => request.status === "PENDING");
  const defaultAddress = useMemo(() => addresses.find((address) => address.isDefault) ?? addresses[0] ?? null, [addresses]);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm">
        <p className="text-sm opacity-80">Resumen</p>
        <h2 className="mt-1 font-heading text-3xl font-bold">Hola, {user?.firstName}</h2>
        <p className="mt-2 max-w-2xl opacity-90">Desde aca podes revisar tus pedidos, direcciones y solicitudes de stock.</p>
      </div>

      {isLoading ? <p className="rounded-3xl border bg-card p-6">Cargando tu cuenta...</p> : null}
      {error ? <p className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pedidos</p>
          <p className="font-heading text-3xl font-bold">{orders.length}</p>
          <Button asChild variant="link" className="px-0"><Link to="/mi-cuenta/pedidos">Ver mis pedidos</Link></Button>
        </article>
        <article className="rounded-3xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Solicitudes pendientes</p>
          <p className="font-heading text-3xl font-bold">{pendingRequests.length}</p>
          <Button asChild variant="link" className="px-0"><Link to="/mi-cuenta/solicitudes-stock">Ver solicitudes</Link></Button>
        </article>
        <article className="rounded-3xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Direccion principal</p>
          {defaultAddress ? (
            <p className="mt-2 text-sm">{defaultAddress.street} {defaultAddress.number}, {defaultAddress.city}</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">No tenes una direccion principal.</p>
          )}
          <Button asChild variant="link" className="px-0"><Link to="/mi-cuenta/direcciones">Administrar</Link></Button>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-heading text-xl font-bold">Ultimos pedidos</h3>
            <Button asChild variant="outline" size="sm"><Link to="/mi-cuenta/pedidos">Ver todos</Link></Button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavia no realizaste pedidos.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order.id} to={`/mi-cuenta/pedidos/${order.id}`} className="block rounded-2xl border p-4 transition hover:bg-muted">
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{orderStatusLabel(order.status, order.deliveryMethod)} - ${Number(order.total).toLocaleString("es-AR")}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-heading text-xl font-bold">Solicitudes pendientes</h3>
            <Button asChild variant="outline" size="sm"><Link to="/mi-cuenta/solicitudes-stock">Ver todas</Link></Button>
          </div>
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tenes solicitudes pendientes.</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((request) => (
                <article key={request.id} className="rounded-2xl border p-4">
                  <p className="font-semibold">{request.product.name}</p>
                  <p className="text-sm text-muted-foreground">{stockRequestStatusLabel(request.status)}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild><Link to="/mi-cuenta/perfil">Editar mis datos</Link></Button>
        <Button asChild variant="outline"><Link to="/mi-cuenta/direcciones">Mis direcciones</Link></Button>
        <Button asChild variant="outline"><Link to="/productos">Ir al catalogo</Link></Button>
      </div>
    </section>
  );
}
