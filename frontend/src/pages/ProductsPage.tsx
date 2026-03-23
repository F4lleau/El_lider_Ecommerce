import ProductCard from "@/components/products/ProductCard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";

const ProductCategories = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);
  const grouped = products.reduce((acc, p) => {
    (acc[p.category] = acc[p.category] || []).push(p);
    return acc;
  }, {});
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-8">Categorías de Productos</h1>
      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat} className="mb-10">
          <h2 className="font-heading text-xl font-semibold mb-4 text-primary">{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductCategories;
