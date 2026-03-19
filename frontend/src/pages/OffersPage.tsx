import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

const Ofertas = () => {
  const offers = products.filter((p) => p.discount);

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-2">🔥 Ofertas Especiales</h1>
      <p className="text-muted-foreground mb-8">Aprovechá los mejores descuentos en productos seleccionados.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {offers.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
};

export default Ofertas;
