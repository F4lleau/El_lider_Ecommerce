import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";

const money = (value: number) => value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const CartPage = () => {
  const { cart, isLoading, error, updateItem, removeItem, clear } = useCartStore();
  if (isLoading && cart.items.length === 0) return <div className="section-shell"><div className="h-72 animate-pulse rounded-3xl bg-muted" /></div>;

  if (cart.items.length === 0) {
    return <div className="section-shell animate-fade-in"><div className="empty-state mx-auto max-w-3xl py-20"><div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-primary/10 text-primary"><ShoppingBag className="h-9 w-9" /></div><span className="eyebrow">Tu selección</span><h1 className="section-title">Tu carrito espera una buena idea</h1>{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}<p className="mx-auto mt-4 max-w-md text-muted-foreground">Explorá el catálogo y agregá todo lo que necesitás. Tu carrito invitado queda guardado para cuando vuelvas.</p><Button className="mt-7" size="lg" asChild><Link to="/productos">Explorar productos <ArrowRight className="h-4 w-4" /></Link></Button></div></div>;
  }

  return (
    <div className="section-shell animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><span className="eyebrow">Tu selección</span><h1 className="section-title">Carrito de compras</h1><p className="mt-2 text-muted-foreground">{cart.summary.itemsCount} {cart.summary.itemsCount === 1 ? "producto" : "productos"} en tu carrito</p></div><Button variant="outline" onClick={() => void clear().catch(() => undefined)} disabled={isLoading}><Trash2 className="h-4 w-4" />Vaciar carrito</Button></div>
      {error ? <div className="mb-5 rounded-2xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">{error}</div> : null}
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          {cart.items.map((item) => (
            <article key={item.productId} className="grid min-w-0 gap-4 rounded-3xl border bg-card p-4 shadow-card sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:p-5">
              <img className="aspect-square w-full rounded-2xl bg-secondary object-cover sm:w-[120px]" src={item.product.images[0]?.url ?? "/placeholder.svg"} alt={item.product.name} />
              <div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-wider text-primary">{item.product.category.name}</p><h2 className="mt-1 font-heading text-lg font-extrabold">{item.product.name}</h2><p className="mt-2 text-sm text-muted-foreground">{money(Number(item.product.price))} por unidad</p><div className="mt-4 flex flex-wrap items-center gap-2"><div className="flex items-center rounded-xl border bg-background p-1"><button className="touch-target min-h-9 min-w-9 rounded-lg hover:bg-secondary" aria-label="Restar cantidad" disabled={isLoading} onClick={() => void updateItem(item.id, item.productId, item.quantity - 1).catch(() => undefined)}><Minus className="h-4 w-4" /></button><span className="min-w-10 text-center font-bold">{item.quantity}</span><button className="touch-target min-h-9 min-w-9 rounded-lg hover:bg-secondary" aria-label="Sumar cantidad" disabled={isLoading || item.quantity >= item.product.stock} onClick={() => void updateItem(item.id, item.productId, item.quantity + 1).catch(() => undefined)}><Plus className="h-4 w-4" /></button></div><Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => void removeItem(item.id, item.productId).catch(() => undefined)}><Trash2 className="h-4 w-4" />Eliminar</Button></div></div>
              <p className="font-heading text-xl font-extrabold sm:text-right">{money(item.subtotal)}</p>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-3xl border bg-card p-5 shadow-elevated lg:sticky lg:top-28 sm:p-6"><h2 className="font-heading text-xl font-extrabold">Resumen</h2><div className="my-5 border-t" /><div className="flex justify-between text-sm text-muted-foreground"><span>Productos</span><span>{cart.summary.itemsCount}</span></div><div className="mt-4 flex justify-between font-heading text-xl font-extrabold"><span>Subtotal</span><span>{money(cart.summary.subtotal)}</span></div><div className="mt-5 flex gap-2 rounded-2xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" />Precio y stock validados desde backend.</div><Button className="mt-5 w-full" size="lg" disabled title="Checkout se implementará en un próximo change">Ir a checkout</Button><Button className="mt-3 w-full" variant="outline" asChild><Link to="/productos">Seguir comprando</Link></Button></aside>
      </div>
    </div>
  );
};
export default CartPage;
