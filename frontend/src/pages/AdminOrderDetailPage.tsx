import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AdminError, AdminLoading } from "@/components/admin/AdminState";
import { adminOrdersApi } from "@/features/admin/api";
import { useAdminData } from "@/features/admin/use-admin-data";
import type { OrderStatus } from "@/types/order";

const states: OrderStatus[] = ["PENDING_PAYMENT", "PAID", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED", "COMPLETED"];

export default function AdminOrderDetailPage() {
  const id = Number(useParams().id);
  const { data: order, isLoading, error, reload } = useAdminData(() => adminOrdersApi.get(id));
  const [feedback, setFeedback] = useState("");
  if (isLoading) return <AdminLoading />;
  if (error || !order) return <AdminError message={error ?? "Pedido no encontrado"} />;
  const name = order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestName ?? "Invitado";
  const email = order.user?.email ?? order.guestEmail;
  const change = async (status: OrderStatus) => {
    try {
      await adminOrdersApi.status(id, status);
      setFeedback("Estado actualizado");
      await reload();
    } catch (caught) {
      setFeedback(caught instanceof Error ? caught.message : "No se pudo actualizar");
    }
  };

  return <div>
    <Button variant="outline" size="sm" asChild><Link to="/admin/pedidos">Volver</Link></Button>
    <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_340px]">
      <section className="space-y-5">
        <div className="rounded-3xl border bg-card p-5"><h1 className="font-heading text-2xl font-bold">{order.orderNumber}</h1><p className="mt-1 text-sm text-muted-foreground">{order.trackingCode}</p><div className="mt-5 grid gap-3 sm:grid-cols-3"><p><b>Cliente:</b><br />{name}<br />{email}</p><p><b>Estado:</b><br />{order.status}<br />Pago: {order.paymentMethod}<br />{order.paymentStatus}</p><p><b>Entrega:</b><br />{order.deliveryMethod}</p></div>{order.deliveryMethod === "SHIPPING" ? <p className="mt-5 rounded-xl bg-secondary p-4 text-sm">{order.shippingRecipient}, {order.shippingStreet} {order.shippingNumber}, {order.shippingCity}, {order.shippingProvince} ({order.shippingPostalCode})</p> : null}</div>
        <div className="rounded-3xl border bg-card p-5"><h2 className="mb-4 font-heading text-xl font-bold">Productos</h2>{order.items.map((item) => <div key={item.id} className="flex justify-between border-b py-3 last:border-0"><span>{item.quantity} x {item.productName}{item.productSku ? <small className="ml-2 font-mono text-muted-foreground">({item.productSku})</small> : null}</span><b>${Number(item.totalPrice).toLocaleString("es-AR")}</b></div>)}</div>
      </section>
      <aside className="h-fit rounded-3xl border bg-card p-5"><h2 className="font-heading text-xl font-bold">Totales</h2><p className="mt-4 flex justify-between"><span>Subtotal</span><b>${Number(order.subtotal).toLocaleString("es-AR")}</b></p><p className="mt-2 flex justify-between"><span>Envio</span><b>${Number(order.shippingCost).toLocaleString("es-AR")}</b></p><p className="mt-4 flex justify-between text-xl"><span>Total</span><b>${Number(order.total).toLocaleString("es-AR")}</b></p><div className="mt-6"><label className="text-sm font-bold">Cambiar estado</label><select className="admin-select mt-2" value={order.status} onChange={(event) => void change(event.target.value as OrderStatus)}>{states.map((state) => <option key={state}>{state}</option>)}</select>{feedback ? <p className="mt-3 text-sm font-bold">{feedback}</p> : null}</div></aside>
    </div>
  </div>;
}
