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
      className={`flex flex-col items-center gap-4 px-4 py-7 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group min-h-[170px]`}
      style={{ textDecoration: "none" }}
    >
      <div
        className={`w-16 h-16 rounded-xl flex items-center justify-center mb-2 ${color} transition-transform group-hover:scale-110 shadow-sm`}
      >
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <span className="font-heading font-semibold text-base text-center text-gray-800 group-hover:text-primary transition-colors">
        {name}
      </span>
    </Link>
  );
};

export default CategoryCard;
