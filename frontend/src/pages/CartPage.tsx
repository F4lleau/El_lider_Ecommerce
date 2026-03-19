import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Carrito = () => {
  return (
    <div className="container py-12 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-8">Tu Carrito</h1>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="font-heading text-xl font-semibold mb-2">Tu carrito está vacío</h2>
        <p className="text-muted-foreground mb-6">Explorá nuestros productos y agregá lo que necesites.</p>
        <Button asChild>
          <Link to="/productos/categorias">Ver Productos</Link>
        </Button>
      </div>
    </div>
  );
};

export default Carrito;
