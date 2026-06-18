import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Banknote, CreditCard, MapPin, PackageCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store";
import { useCartStore } from "@/features/cart/store";
import { ordersApi } from "@/features/orders/api";
import type { CheckoutPayload, CheckoutSummary, DeliveryMethod, PaymentMethod } from "@/types/order";

const money = (value: number) => value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { cart, clear } = useCartStore();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("PICKUP");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MERCADOPAGO");
  const [customer, setCustomer] = useState({ name: user ? `${user.firstName} ${user.lastName}` : "", email: user?.email ?? "", phone: "" });
  const [address, setAddress] = useState({ recipient: "", phone: "", street: "", number: "", city: "", province: "", postalCode: "", references: "" });
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const items = useMemo(() => cart.items.map(({ productId, quantity }) => ({ productId, quantity })), [cart.items]);
  const payload = (): CheckoutPayload => ({ deliveryMethod, paymentMethod, customer, items, ...(deliveryMethod === "SHIPPING" ? { address: { ...address, recipient: address.recipient || customer.name, phone: address.phone || customer.phone } } : {}) });

  useEffect(() => {
    if (!cart.items.length || !customer.phone) return;
    const timer = window.setTimeout(() => void ordersApi.validate(payload()).then(setSummary).catch(() => setSummary(null)), 250);
    return () => window.clearTimeout(timer);
  }, [deliveryMethod, paymentMethod, customer.phone, address.city, address.street, cart.items.length]);

  if (!cart.items.length) return <Navigate to="/carrito" replace />;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError(null);
    try {
      const order = await ordersApi.checkout(payload());
      await clear();
      navigate("/checkout/confirmacion", { state: { order } });
    } catch (caught) { setError(caught instanceof Error ? caught.message : "No se pudo crear la orden"); }
    finally { setLoading(false); }
  };

  return <div className="section-shell"><div className="mb-8"><span className="eyebrow">Último paso</span><h1 className="section-title">Checkout</h1></div><form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-5"><h2 className="mb-4 font-heading text-xl font-bold">Datos del comprador</h2><div className="grid gap-4 sm:grid-cols-2"><div><Label>Nombre</Label><Input required disabled={Boolean(user)} value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} /></div><div><Label>Email</Label><Input required type="email" disabled={Boolean(user)} value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} /></div><div><Label>Teléfono</Label><Input required value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} /></div></div></section>
      <section className="rounded-3xl border bg-card p-5"><h2 className="mb-4 font-heading text-xl font-bold">Entrega</h2><div className="grid gap-3 sm:grid-cols-2"><Button type="button" variant={deliveryMethod === "PICKUP" ? "default" : "outline"} onClick={() => setDeliveryMethod("PICKUP")}><PackageCheck /> Retiro</Button><Button type="button" variant={deliveryMethod === "SHIPPING" ? "default" : "outline"} onClick={() => setDeliveryMethod("SHIPPING")}><Truck /> Envío</Button></div>{deliveryMethod === "PICKUP" ? <p className="mt-4 rounded-2xl bg-secondary p-4 text-sm"><MapPin className="mr-2 inline h-4 w-4" />Retiro en sucursal, sin costo.</p> : <div className="mt-5 grid gap-4 sm:grid-cols-2">{(["recipient", "phone", "street", "number", "city", "province", "postalCode", "references"] as const).map((field) => <div key={field}><Label>{field}</Label><Input required={field !== "references"} value={address[field]} onChange={(event) => setAddress({ ...address, [field]: event.target.value })} /></div>)}</div>}</section>
      <section className="rounded-3xl border bg-card p-5"><h2 className="mb-4 font-heading text-xl font-bold">Método de pago</h2><div className="grid gap-3 sm:grid-cols-2"><Button type="button" variant={paymentMethod === "MERCADOPAGO" ? "default" : "outline"} onClick={() => setPaymentMethod("MERCADOPAGO")}><CreditCard /> Mercado Pago</Button><Button type="button" variant={paymentMethod === "CASH" ? "default" : "outline"} onClick={() => setPaymentMethod("CASH")}><Banknote /> Efectivo</Button></div><p className="mt-3 text-sm text-muted-foreground">{paymentMethod === "CASH" ? deliveryMethod === "PICKUP" ? "Pagás al retirar en sucursal." : "Pagás al recibir el pedido." : "Pagás online mediante Mercado Pago."}</p></section>
    </div>
    <aside className="h-fit rounded-3xl border bg-card p-5 shadow-elevated"><h2 className="font-heading text-xl font-bold">Resumen</h2><div className="my-4 space-y-2 text-sm">{cart.items.map((item) => <div key={item.productId} className="flex justify-between gap-3"><span>{item.quantity} × {item.product.name}</span><span>{money(item.subtotal)}</span></div>)}</div><div className="border-t pt-4"><div className="flex justify-between"><span>Subtotal</span><span>{money(summary?.summary.subtotal ?? cart.summary.subtotal)}</span></div><div className="mt-2 flex justify-between"><span>Envío</span><span>{money(summary?.summary.shippingCost ?? 0)}</span></div><div className="mt-4 flex justify-between font-heading text-xl font-bold"><span>Total</span><span>{money(summary?.summary.total ?? cart.summary.subtotal)}</span></div></div>{error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}<Button className="mt-5 w-full" size="lg" disabled={loading}>{loading ? "Creando orden..." : paymentMethod === "MERCADOPAGO" ? "Crear pedido y pagar" : "Confirmar pedido"}</Button></aside>
  </form></div>;
}
