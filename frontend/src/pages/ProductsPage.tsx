import { useMemo, useState } from "react";
import { PackageSearch, Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/features/products/hooks";
import { cn } from "@/lib/utils";

const ProductsPage = () => {
  const { data: products, isLoading, error } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const categories = useMemo(() => ["Todas", ...new Set(products.map((product) => product.category.name))], [products]);
  const filtered = products.filter((product) => (category === "Todas" || product.category.name === category) && product.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="section-shell animate-fade-in">
      <div className="mb-8 max-w-3xl"><span className="eyebrow">Catálogo El Líder</span><h1 className="section-title text-3xl sm:text-4xl lg:text-5xl">Encontrá eso que hace avanzar tu idea</h1><p className="mt-4 text-muted-foreground sm:text-lg">Explorá productos para tu comercio, evento o próximo proyecto.</p></div>
      <div className="mb-8 rounded-3xl border bg-card p-4 shadow-card sm:p-5">
        <div className="relative"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre..." aria-label="Buscar productos" /></div>
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1"><SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />{categories.map((item) => <button key={item} className={cn("shrink-0 rounded-full px-3 py-2 text-sm font-bold transition-colors", category === item ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary")} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </div>
      {isLoading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-3xl bg-muted" />)}</div> : null}
      {error ? <div className="empty-state text-destructive"><PackageSearch className="mx-auto mb-4 h-10 w-10" /><h2 className="font-heading text-xl font-extrabold">No pudimos cargar el catálogo</h2><p className="mt-2 text-sm">{error}</p></div> : null}
      {!isLoading && !error && filtered.length === 0 ? <div className="empty-state"><PackageSearch className="mx-auto mb-4 h-10 w-10 text-primary" /><h2 className="font-heading text-xl font-extrabold">No encontramos productos</h2><p className="mt-2 text-muted-foreground">Probá con otra búsqueda o categoría.</p></div> : null}
      {!isLoading && !error ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">{filtered.map((product) => <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} compareAtPrice={product.compareAtPrice} image={product.images[0]?.url ?? "/placeholder.svg"} category={product.category.name} stock={product.stock} />)}</div> : null}
    </div>
  );
};
export default ProductsPage;
