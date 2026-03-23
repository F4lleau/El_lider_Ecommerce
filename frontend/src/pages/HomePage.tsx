import { ArrowRight, Cake, Package, PartyPopper, Box, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import CategoryCard from "@/components/home/CategoryCard";
import heroBanner from "@/assets/hero-banner.jpg";
import { useProducts } from "@/features/products/hooks";

const categories = [
  { name: "Repostería", icon: Cake, color: "bg-lilac text-lilac-foreground", to: "/productos/categorias" },
  { name: "Descartables", icon: Package, color: "bg-sky text-sky-foreground", to: "/productos/categorias" },
  { name: "Cotillón", icon: PartyPopper, color: "bg-peach text-peach-foreground", to: "/productos/categorias" },
  { name: "Envases", icon: Box, color: "bg-mint text-mint-foreground", to: "/productos/categorias" },
  { name: "Gastronomía", icon: Utensils, color: "bg-accent text-accent-foreground", to: "/productos/categorias" },
];

const HomePage = () => {
  const { data: offers } = useProducts({ mode: "offers" });
  const { data: featured } = useProducts({ mode: "featured" });

  return (
    <div className="animate-fade-in">
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
                <Link to="/productos/categorias">
                  Ver Productos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/productos/ofertas">Ofertas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <h2 className="font-heading text-2xl font-bold mb-6">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} {...cat} />
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold">🔥 Ofertas</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/productos/ofertas">Ver todas <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {offers.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                image={product.images[0]?.url ?? "/placeholder.svg"}
                category={product.category.name}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold">⭐ Más Vendidos</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/productos/mas-vendidos">Ver todos <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              image={product.images[0]?.url ?? "/placeholder.svg"}
              category={product.category.name}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
