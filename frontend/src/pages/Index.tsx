import { useEffect, useState } from "react";
import { ArrowRight, Cake, Package, PartyPopper, Box, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import CategoryCard from "@/components/home/CategoryCard";
import heroBanner from "@/assets/hero-banner.jpg";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

// 1. Estado para productos y categorías
const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // 2. Cargar productos y categorías desde el backend
  useEffect(() => {
    productsService.getAll().then((res) => setProducts(res.data));
    categoriesService.getAll().then((res) => setCategories(res.data));
  }, []);

  // 3. Filtrar productos destacados/ofertas
  const offers = products.filter((p) => p.isOffer);
  const bestSellers = products.filter((p) => p.isFeatured);

  return (
    <div className="animate-fade-in">
      {/* 4. Hero principal */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        </div>
        <div className="relative container py-20 md:py-28">
          <div className="max-w-lg space-y-5">
            <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-primary-foreground leading-tight">
              Todo para tu negocio en un solo lugar
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Descartables, repostería, cotillón, envases y mucho más. Los mejores precios del mercado.
            </p>
            <div className="flex gap-3">
              <Button size="lg" asChild>
                <Link to="/productos">
                  Ver Productos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/ofertas">Ofertas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Categorías dinámicas */}
      <section className="container py-12">
        <h2 className="font-heading text-2xl font-bold mb-6">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              icon={Cake} // Puedes mapear iconos según categoría si lo deseas
              color="bg-lilac text-lilac-foreground"
              to={`/productos/categorias/${cat.slug}`}
            />
          ))}
        </div>
      </section>

      {/* 6. Ofertas */}
      <section className="bg-muted/40 py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold">🔥 Ofertas</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/ofertas">Ver todas <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {offers.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Más vendidos */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold">⭐ Más Vendidos</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/mas-vendidos">Ver todos <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
};


export default Index;
