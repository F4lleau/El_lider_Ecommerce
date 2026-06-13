import { useState } from "react";
import { Bell, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";
import { stockRequestsApi } from "@/features/stock-requests/api";
import { StockRequestDialog } from "./StockRequestDialog";

type ProductCardProps = {
  id: number;
  name: string;
  price: string;
  compareAtPrice: string | null;
  image: string;
  category: string;
  stock: number;
};

const money = (value: number) => value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const ProductCard = ({ id, name, price, compareAtPrice, image, category, stock }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const priceValue = Number(price);
  const compareAtValue = compareAtPrice ? Number(compareAtPrice) : null;
  const hasDiscount = compareAtValue !== null && compareAtValue > priceValue;
  const discount = hasDiscount && compareAtValue ? Math.round((1 - priceValue / compareAtValue) * 100) : 0;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-elevated">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary sm:aspect-square">
        <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {hasDiscount ? <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-extrabold text-primary-foreground">-{discount}%</span> : null}
          {stock < 1 ? <span className="rounded-full bg-foreground px-2.5 py-1 text-xs font-extrabold text-background">Sin stock</span> : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{category}</p>
        <h3 className="mb-4 line-clamp-2 min-h-12 font-heading text-base font-extrabold leading-snug sm:text-lg">{name}</h3>
        <div className="mt-auto">
          {hasDiscount && compareAtValue ? <p className="text-sm text-muted-foreground line-through">{money(compareAtValue)}</p> : <div className="h-5" />}
          <p className="mb-4 font-heading text-2xl font-extrabold text-foreground">{money(priceValue)}</p>
          <Button
            className="w-full"
            variant={stock < 1 ? "outline" : "default"}
            title={stock < 1 ? "Avisarme cuando haya stock" : "Agregar al carrito"}
            onClick={() => {
              if (stock < 1) {
                if (!user) {
                  setRequestOpen(true);
                  return;
                }
                void stockRequestsApi.create(id).then(() => {
                  setFeedback("Solicitud enviada");
                }).catch((error: unknown) => setFeedback(error instanceof Error ? error.message : "No se pudo enviar"));
                return;
              }
              void addItem(id, stock).then(() => {
                setFeedback("Agregado");
                window.setTimeout(() => setFeedback(null), 1500);
              }).catch(() => setFeedback("Sin stock"));
            }}
          >
            {stock < 1 ? <Bell className="h-4 w-4" /> : feedback === "Agregado" ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            {feedback ?? (stock < 1 ? "Avisarme cuando haya stock" : "Agregar")}
          </Button>
        </div>
      </div>
      <StockRequestDialog open={requestOpen} onOpenChange={setRequestOpen} productId={id} productName={name} onSuccess={() => setFeedback("Solicitud enviada")} />
    </article>
  );
};
export default ProductCard;
