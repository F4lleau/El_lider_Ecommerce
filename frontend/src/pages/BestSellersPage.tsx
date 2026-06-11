import { useProducts } from "../features/products/hooks";
import ProductCard from "../components/products/ProductCard";

const BestSellersPage = () => {
  // Obtiene productos destacados desde el hook personalizado
  const { data: featured = [], isLoading, error } = useProducts({ mode: "featured" });

  // Muestra mensaje de carga
  if (isLoading) return <div className="container py-8">Cargando destacados...</div>;
  // Muestra mensaje de error
  if (error) return <div className="container py-8 text-destructive">Error: {error}</div>;

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-2">⭐ Más Vendidos</h1>
      <p className="text-muted-foreground mb-8">Los productos más elegidos por nuestros clientes.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            image={product.images?.[0]?.url ?? "/placeholder.svg"}
            category={product.category?.name ?? ""}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellersPage;
