import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { BrandLogo } from "../components/brand/BrandLogo";
import { useAuthStore } from "../features/auth/store";
import { cn } from "../lib/utils";

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Productos", to: "/productos" },
  { label: "Ofertas", to: "/productos/ofertas" },
  { label: "Más vendidos", to: "/productos/mas-vendidos" },
  { label: "Nosotros", to: "/nosotros" },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-full px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
  );

export default function Header({ cartCount }: { cartCount: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="border-b border-primary/20 bg-primary py-1.5 text-center text-xs font-semibold text-primary-foreground">
        Polirrubro mayorista · Todo en insumos · Retiro en sucursal
      </div>
      <div className="container flex h-20 items-center gap-3 lg:h-24">
        <button
          className="touch-target rounded-xl border bg-card lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <BrandLogo className="mr-auto" />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {navItems.map((item) => <NavLink key={item.to} to={item.to} className={navClass}>{item.label}</NavLink>)}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <Link to="/productos" className="touch-target hidden rounded-xl border bg-card text-muted-foreground hover:text-accent sm:grid" aria-label="Buscar productos">
            <Search className="h-5 w-5" />
          </Link>
          <Link to={user ? "/mi-cuenta" : "/login"} className="touch-target rounded-xl border bg-card text-muted-foreground hover:text-accent" aria-label={user ? "Mi cuenta" : "Iniciar sesión"}>
            <UserRound className="h-5 w-5" />
          </Link>
          {user?.role === "ADMIN" ? <Link className="hidden rounded-full bg-foreground px-3 py-2 text-xs font-bold text-background sm:block" to="/admin">Admin</Link> : null}
          <Link to="/carrito" className="touch-target relative rounded-xl bg-accent text-accent-foreground shadow-brand hover:bg-accent/90" aria-label={`Carrito con ${cartCount} productos`}>
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? <span className="absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full border-2 border-background bg-accent px-1 text-[10px] font-extrabold text-accent-foreground">{cartCount}</span> : null}
          </Link>
        </div>
      </div>
      {mobileOpen ? (
        <nav className="container grid gap-1 border-t py-3 lg:hidden" aria-label="Navegación mobile">
          {navItems.map((item) => <NavLink key={item.to} to={item.to} className={navClass} onClick={() => setMobileOpen(false)}>{item.label}</NavLink>)}
          <NavLink to={user ? "/mi-cuenta" : "/login"} className={navClass} onClick={() => setMobileOpen(false)}>{user ? "Mi cuenta" : "Iniciar sesión"}</NavLink>
          {user?.role === "ADMIN" ? <NavLink to="/admin" className={navClass} onClick={() => setMobileOpen(false)}>Administración</NavLink> : null}
        </nav>
      ) : null}
    </header>
  );
}
