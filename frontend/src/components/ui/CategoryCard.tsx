import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  to: string;
}

const CategoryCard = ({ name, icon: Icon, color, to }: CategoryCardProps) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-3 p-6 rounded-xl border bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group`}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} transition-transform group-hover:scale-110`}>
        <Icon className="h-7 w-7" />
      </div>
      <span className="font-heading font-semibold text-sm text-center">{name}</span>
    </Link>
  );
};

export default CategoryCard;
