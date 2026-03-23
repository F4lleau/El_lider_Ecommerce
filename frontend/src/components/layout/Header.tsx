import { ShoppingCart, Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-20 items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="El Líder - Art. Descartables" className="h-16 w-auto" />
        </Link>

        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              className="pl-10 bg-muted/50 border-none focus-visible:ring-primary/30"
            />
          </div>
        </div>

        <nav className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/productos/categorias">Productos</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/nosotros">Nosotros</Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/carrito">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
