import { Link } from "react-router-dom";
import { ArrowRight, Box, Cake, CreditCard, Droplets, Gift, MapPin, Package, PartyPopper, ShieldCheck, Sparkles, Truck, Utensils, type LucideIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import ProductCard from "../components/products/ProductCard";
import CategoryCard from "../components/home/CategoryCard";
import { useProducts } from "../features/products/hooks";

type StorefrontCategory = {
  name: string;
  icon: LucideIcon;
  color: string;
  to: string;
  showInHero?: boolean;
};

const categories: StorefrontCategory[] = [
  { name: "Descartables", icon: Package, color: "bg-sky text-sky-foreground", to: "/productos/categorias", showInHero: true },
  { name: "Repostería", icon: Cake, color: "bg-primary/10 text-primary", to: "/productos/categorias", showInHero: true },
  { name: "Pastelería", icon: Sparkles, color: "bg-secondary text-secondary-foreground", to: "/productos/categorias", showInHero: true },
  { name: "Panificación", icon: Utensils, color: "bg-peach text-peach-foreground", to: "/productos/categorias", showInHero: true },
  { name: "Limpieza", icon: Droplets, color: "bg-mint text-mint-foreground", to: "/productos/categorias", showInHero: true },
  { name: "Golosinas", icon: Gift, color: "bg-accent/10 text-accent", to: "/productos/categorias", showInHero: true },
  { name: "Cotillón", icon: PartyPopper, color: "bg-lilac text-lilac-foreground", to: "/productos/categorias" },
  { name: "Envases", icon: Box, color: "bg-card text-primary", to: "/productos/categorias" },
];

const heroCategories = categories.filter((category) => category.showInHero);

const trust = [
  { icon: MapPin, title: "Retiro en sucursal", text: "Av. Manuel Belgrano, La Leonesa, Chaco." },
  { icon: Truck, title: "Envíos coordinados", text: "Preparamos pedidos para comercios y emprendedores." },
  { icon: CreditCard, title: "Compra simple", text: "Precios claros y catálogo fácil de recorrer." },
  { icon: ShieldCheck, title: "Atención mayorista", text: "Variedad de insumos para múltiples rubros." },
];

const HomePage = () => {
  const { data: offers = [] } = useProducts({ mode: "offers" });
  const { data: featured = [] } = useProducts({ mode: "featured" });

  return (
    <div className="animate-fade-in">
      <section className="container pt-4 sm:pt-5">
        <div className="relative overflow-hidden rounded-2xl bg-hero-gradient shadow-elevated">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sky/60 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(0_0%_100%/0.035)_1px,transparent_1px),linear-gradient(180deg,hsl(0_0%_100%/0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
          <div className="relative mx-auto flex min-h-[390px] max-w-5xl flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[430px] sm:px-8 lg:py-14">
            <div className="max-w-4xl">
              <h1 className="mx-auto max-w-4xl font-heading text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Todo en <span className="text-gradient">insumos</span> en un solo lugar.
              </h1>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {heroCategories.map((category) => (
                  <span
                    key={category.name}
                    className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-xs font-extrabold text-white transition-colors hover:border-accent/70 hover:bg-accent hover:text-accent-foreground"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild><Link to="/productos">Explorar catálogo <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:border-white/25 hover:bg-white/10 hover:text-white" asChild><Link to="/productos/ofertas">Ver ofertas</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-8 sm:pt-10 lg:pt-12">
        <div className="mb-6 sm:flex sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Rubros principales</span>
            <h2 className="section-title">Encontrá insumos por categoría</h2>
          </div>
          <Link className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary sm:mt-0" to="/productos">Ver catálogo <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 lg:gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} name={category.name} icon={category.icon} color={category.color} to={category.to} />
          ))}
        </div>
      </section>

      <section className="bg-secondary/70">
        <div className="section-shell">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div><span className="eyebrow">Precios que ayudan</span><h2 className="section-title">Ofertas para aprovechar</h2></div>
            <Button variant="outline" size="sm" asChild><Link to="/productos/ofertas">Ver todas</Link></Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">{offers.slice(0, 4).map((product) => <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} compareAtPrice={product.compareAtPrice} image={product.images?.[0]?.url ?? "/placeholder.svg"} category={product.category?.name ?? ""} stock={product.stock} />)}</div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><span className="eyebrow">Elegidos por clientes</span><h2 className="section-title">Insumos destacados</h2></div>
          <Button variant="outline" size="sm" asChild><Link to="/productos/mas-vendidos">Ver todos</Link></Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">{featured.slice(0, 6).map((product) => <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} compareAtPrice={product.compareAtPrice} image={product.images?.[0]?.url ?? "/placeholder.svg"} category={product.category?.name ?? ""} stock={product.stock} />)}</div>
      </section>

      <section className="container pb-2">
        <div className="grid gap-3 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((item) => (
            <div key={item.title} className="flex items-start gap-3 px-1 py-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-sm font-extrabold">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
