import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

const MasVendidos = () => {
  const bestSellers = products.filter((p) => p.bestSeller);

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-2">⭐ Más Vendidos</h1>
      <p className="text-muted-foreground mb-8">Los productos más elegidos por nuestros clientes.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {bestSellers.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
};

export default MasVendidos;
