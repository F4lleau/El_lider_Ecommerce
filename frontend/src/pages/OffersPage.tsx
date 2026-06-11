import { BadgePercent } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/features/products/hooks";

const OffersPage = () => {
  const { data: offers, isLoading, error } = useProducts({ mode: "offers" });
  return <div className="section-shell animate-fade-in"><div className="mb-8 max-w-2xl"><span className="eyebrow">Oportunidades</span><h1 className="section-title text-3xl sm:text-5xl">Ofertas para comprar mejor</h1><p className="mt-3 text-muted-foreground">Productos seleccionados con precios para aprovechar.</p></div>{isLoading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-3xl bg-muted" />)}</div> : null}{error ? <div className="empty-state text-destructive">{error}</div> : null}{!isLoading && !error && offers.length === 0 ? <div className="empty-state"><BadgePercent className="mx-auto mb-4 h-10 w-10 text-primary" /><h2 className="font-heading text-xl font-extrabold">Pronto habrá nuevas ofertas</h2></div> : null}<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">{offers.map((product) => <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} compareAtPrice={product.compareAtPrice} image={product.images[0]?.url ?? "/placeholder.svg"} category={product.category.name} stock={product.stock} />)}</div></div>;
};
export default OffersPage;
