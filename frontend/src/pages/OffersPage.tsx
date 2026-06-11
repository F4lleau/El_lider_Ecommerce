import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/features/products/hooks";

const OffersPage = () => {
  const { data: offers, isLoading, error } = useProducts({ mode: "offers" });

  if (isLoading) return <div className="container py-8">Cargando ofertas...</div>;
  if (error) return <div className="container py-8 text-destructive">Error: {error}</div>;

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-2">🔥 Ofertas Especiales</h1>
      <p className="text-muted-foreground mb-8">Aprovechá los mejores descuentos en productos seleccionados.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {offers.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            image={product.images[0]?.url ?? "/placeholder.svg"}
            category={product.category.name}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
