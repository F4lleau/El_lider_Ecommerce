import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/features/products/hooks";

const ProductCategories = () => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return <div className="container py-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container py-8 text-destructive">Error: {error}</div>;
  }

  const grouped = products.reduce<Record<string, typeof products>>((acc, product) => {
    (acc[product.category.name] = acc[product.category.name] || []).push(product);
    return acc;
  }, {});

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-8">Categorías de Productos</h1>
      {Object.entries(grouped).map(([categoryName, items]) => (
        <section key={categoryName} className="mb-10">
          <h2 className="font-heading text-xl font-semibold mb-4 text-primary">{categoryName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((product) => (
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
        </section>
      ))}
    </div>
  );
};

export default ProductCategories;
