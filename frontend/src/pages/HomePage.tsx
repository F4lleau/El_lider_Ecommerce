import { Link } from "react-router-dom";
import { ArrowRight, Box, Cake, CreditCard, MapPin, MessageCircle, Package, PartyPopper, ShieldCheck, Sparkles, Truck, Utensils } from "lucide-react";
import { Button } from "../components/ui/button";
import ProductCard from "../components/products/ProductCard";
import CategoryCard from "../components/home/CategoryCard";
import { useProducts } from "../features/products/hooks";
import heroBanner from "../assets/hero-banner.jpg";

const categories = [
  { name: "Repostería", icon: Cake, color: "bg-primary/10 text-primary", to: "/productos/categorias" },
  { name: "Descartables", icon: Package, color: "bg-sky text-sky-foreground", to: "/productos/categorias" },
  { name: "Cotillón", icon: PartyPopper, color: "bg-accent/30 text-accent-foreground", to: "/productos/categorias" },
  { name: "Envases", icon: Box, color: "bg-mint text-mint-foreground", to: "/productos/categorias" },
  { name: "Gastronomía", icon: Utensils, color: "bg-peach text-peach-foreground", to: "/productos/categorias" },
];
const trust = [
  { icon: MapPin, title: "Retiro en sucursal", text: "Comprá online y retiralo en Av. Belgrano 103." },
  { icon: Truck, title: "Envíos coordinados", text: "Te ayudamos a recibir todo donde lo necesitás." },
  { icon: CreditCard, title: "Compra simple", text: "Precios claros y un catálogo fácil de recorrer." },
  { icon: ShieldCheck, title: "Atención cercana", text: "Asesoramiento para comercios y emprendedores." },
];

const HomePage = () => {
  const { data: offers = [] } = useProducts({ mode: "offers" });
  const { data: featured = [] } = useProducts({ mode: "featured" });

  return (
    <div className="animate-fade-in">
      <section className="container pt-4 sm:pt-6">
        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-foreground shadow-elevated sm:min-h-[560px] lg:min-h-[620px]">
          <img src={heroBanner} alt="Productos de repostería de El Líder" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-primary/20" />
          <div className="relative flex min-h-[520px] max-w-3xl flex-col justify-center px-5 py-12 sm:min-h-[560px] sm:px-10 lg:min-h-[620px] lg:px-16">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-background/20 bg-background/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-background"><Sparkles className="h-3.5 w-3.5 text-accent" /> Todo para crear</span>
            <h1 className="max-w-2xl font-heading text-4xl font-extrabold leading-[1.05] text-background sm:text-5xl lg:text-7xl">Tu negocio merece <span className="text-accent">más ideas</span> y menos vueltas.</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-background/75 sm:text-lg">Repostería, descartables, cotillón, envases y gastronomía con variedad, atención cercana y precios para avanzar.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild><Link to="/productos">Explorar catálogo <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button size="lg" variant="secondary" asChild><Link to="/productos/ofertas">Ver ofertas</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-7 sm:flex sm:items-end sm:justify-between"><div><span className="eyebrow">Encontrá rápido</span><h2 className="section-title">Todo lo que necesitás, por categoría</h2></div><Link className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary sm:mt-0" to="/productos">Ver catálogo <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">{categories.map((category) => <CategoryCard key={category.name} {...category} />)}</div>
      </section>

      <section className="bg-secondary/70"><div className="section-shell"><div className="mb-7 flex items-end justify-between gap-4"><div><span className="eyebrow">Precios que ayudan</span><h2 className="section-title">Ofertas para aprovechar</h2></div><Button variant="outline" size="sm" asChild><Link to="/productos/ofertas">Ver todas</Link></Button></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">{offers.slice(0, 4).map((product) => <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} compareAtPrice={product.compareAtPrice} image={product.images?.[0]?.url ?? "/placeholder.svg"} category={product.category?.name ?? ""} stock={product.stock} />)}</div></div></section>

      <section className="section-shell"><div className="mb-7 flex items-end justify-between gap-4"><div><span className="eyebrow">Elegidos por clientes</span><h2 className="section-title">Los que nunca fallan</h2></div><Button variant="outline" size="sm" asChild><Link to="/productos/mas-vendidos">Ver todos</Link></Button></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">{featured.slice(0, 6).map((product) => <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} compareAtPrice={product.compareAtPrice} image={product.images?.[0]?.url ?? "/placeholder.svg"} category={product.category?.name ?? ""} stock={product.stock} />)}</div></section>

      <section className="container"><div className="grid gap-4 rounded-[2rem] bg-foreground p-5 text-background sm:grid-cols-2 sm:p-8 lg:grid-cols-4 lg:p-10">{trust.map((item) => <div key={item.title} className="rounded-2xl border border-background/10 bg-background/5 p-5"><item.icon className="mb-4 h-6 w-6 text-accent" /><h3 className="font-heading font-extrabold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-background/65">{item.text}</p></div>)}</div></section>

      <a href="https://wa.me/541112345678" className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-extrabold text-white shadow-elevated transition-transform hover:-translate-y-1 sm:bottom-6 sm:right-6" aria-label="Contactar por WhatsApp"><MessageCircle className="h-5 w-5" /><span className="hidden sm:inline">¿Necesitás ayuda?</span></a>
    </div>
  );
};
export default HomePage;
