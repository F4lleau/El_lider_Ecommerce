import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  to: string;
}

const CategoryCard = ({ name, icon: Icon, color, to }: CategoryCardProps) => (
  <Link to={to} className="group flex min-h-28 flex-col justify-between rounded-xl border bg-card p-3 shadow-card transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-elevated sm:min-h-32 sm:p-4">
    <div className={`grid h-10 w-10 place-items-center rounded-lg ${color} transition-transform group-hover:scale-105 sm:h-11 sm:w-11`}><Icon className="h-5 w-5 sm:h-6 sm:w-6" /></div>
    <div className="flex items-end justify-between gap-2"><span className="font-heading text-sm font-extrabold">{name}</span><ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /></div>
  </Link>
);
export default CategoryCard;
