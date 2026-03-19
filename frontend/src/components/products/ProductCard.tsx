import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
}

const ProductCard = ({ name, price, image, category, discount }: ProductCardProps) => {
  const finalPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <div className="group bg-card rounded-lg border overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in">
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}
        <span className="absolute top-2 right-2 bg-mint text-mint-foreground text-xs font-medium px-2 py-1 rounded-md">
          {category}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-heading font-semibold text-sm leading-tight line-clamp-2">{name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-lg text-primary">
              ${finalPrice.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>
            {discount && (
              <span className="text-xs text-muted-foreground line-through">
                ${price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <Button size="icon" variant="outline" className="h-8 w-8 shrink-0">
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
