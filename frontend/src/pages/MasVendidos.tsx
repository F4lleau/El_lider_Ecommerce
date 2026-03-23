import ProductCard from "@/components/products/ProductCard";
import { useEffect, useState } from "react";
import { productsService } from "@/services/products.service";
import type { Product } from "@/types/product";

const MasVendidos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    productsService.getAll().then((res) => setProducts(res.data));
  }, []);
  const bestSellers = products.filter((p) => p.isFeatured);
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-2">⭐ Más Vendidos</h1>
      <p className="text-muted-foreground mb-8">Los productos más elegidos por nuestros clientes.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {bestSellers.map((p) => (
          <ProductCard
            key={p.id}
            {...p}
            image={p.image ?? (p.images?.[0]?.url || "/placeholder.png")}
          />
        ))}
      </div>
    </div>
  );
};

export default MasVendidos;
