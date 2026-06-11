import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";

const money = (value: number) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

const CartPage = () => {
  const { cart, isLoading, error, updateItem, removeItem, clear } = useCartStore();

  if (isLoading && cart.items.length === 0) {
    return <div className="container py-12">Cargando carrito...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="container py-12 animate-fade-in">
        <h1 className="font-heading text-3xl font-bold mb-8">Tu Carrito</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-xl font-semibold mb-2">Tu carrito está vacío</h2>
          {error ? <p className="text-sm text-destructive mb-3">{error}</p> : null}
          <p className="text-muted-foreground mb-6">Explorá nuestros productos y agregá lo que necesites.</p>
          <Button asChild><Link to="/productos">Ver Productos</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold">Tu Carrito</h1>
        <Button variant="outline" onClick={() => void clear().catch(() => undefined)} disabled={isLoading}>Vaciar carrito</Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="space-y-4">
        {cart.items.map((item) => (
          <article key={item.productId} className="flex flex-col sm:flex-row gap-4 rounded-lg border bg-card p-4">
            <img
              className="h-24 w-24 rounded-md object-cover bg-muted"
              src={item.product.images[0]?.url ?? "/placeholder.svg"}
              alt={item.product.name}
            />
            <div className="flex-1 space-y-2">
              <h2 className="font-heading font-semibold">{item.product.name}</h2>
              <p className="text-sm text-muted-foreground">{money(Number(item.product.price))} por unidad</p>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" aria-label="Restar cantidad" disabled={isLoading} onClick={() => void updateItem(item.id, item.productId, item.quantity - 1).catch(() => undefined)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-8 text-center">{item.quantity}</span>
                <Button size="icon" variant="outline" aria-label="Sumar cantidad" disabled={isLoading || item.quantity >= item.product.stock} onClick={() => void updateItem(item.id, item.productId, item.quantity + 1).catch(() => undefined)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Eliminar producto" disabled={isLoading} onClick={() => void removeItem(item.id, item.productId).catch(() => undefined)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="font-heading font-bold">{money(item.subtotal)}</p>
          </article>
        ))}
      </div>

      <section className="ml-auto max-w-md rounded-lg border bg-card p-5 space-y-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Subtotal</span>
          <span>{money(cart.summary.subtotal)}</span>
        </div>
        <p className="text-sm text-muted-foreground">El precio y stock se validan nuevamente desde backend.</p>
        <Button className="w-full" disabled title="Checkout se implementará en un próximo change">Ir a checkout</Button>
        <Button className="w-full" variant="outline" asChild><Link to="/productos">Continuar comprando</Link></Button>
      </section>
    </div>
  );
};

export default CartPage;
