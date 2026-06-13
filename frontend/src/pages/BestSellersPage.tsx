import { Star } from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import { useProducts } from "../features/products/hooks";

const BestSellersPage = () => {
  const { data: featured = [], isLoading, error } = useProducts({ mode: "best-sellers" });
  return <div className="section-shell animate-fade-in"><div className="mb-8 max-w-2xl"><span className="eyebrow">Favoritos</span><h1 className="section-title text-3xl sm:text-5xl">Los más elegidos</h1><p className="mt-3 text-muted-foreground">Productos que acompañan todos los días a nuestros clientes.</p></div>{isLoading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-3xl bg-muted" />)}</div> : null}{error ? <div className="empty-state text-destructive">{error}</div> : null}{!isLoading && !error && featured.length === 0 ? <div className="empty-state"><Star className="mx-auto mb-4 h-10 w-10 text-primary" /><h2 className="font-heading text-xl font-extrabold">Todavía no hay destacados</h2></div> : null}<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">{featured.map((product) => <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} compareAtPrice={product.compareAtPrice} image={product.images?.[0]?.url ?? "/placeholder.svg"} category={product.category?.name ?? ""} stock={product.stock} />)}</div></div>;
};
export default BestSellersPage;
