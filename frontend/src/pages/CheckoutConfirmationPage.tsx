import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order";

export default function CheckoutConfirmationPage() {
  const order = (useLocation().state as { order?: Order } | null)?.order;
  if (!order) return <Navigate to="/carrito" replace />;
  return <div className="section-shell"><div className="empty-state mx-auto max-w-2xl"><CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-primary" /><h1 className="section-title">Orden creada</h1><p className="mt-3 text-muted-foreground">La orden quedó pendiente de pago. Conservá tu código para seguirla.</p><div className="my-6 rounded-2xl bg-secondary p-5"><p className="text-sm">Número de orden</p><p className="font-heading text-xl font-bold">{order.orderNumber}</p><p className="mt-3 text-sm">Tracking</p><p className="font-heading text-xl font-bold">{order.trackingCode}</p></div><Button asChild><Link to={`/pedido/${order.trackingCode}`}>Ver seguimiento</Link></Button></div></div>;
}
