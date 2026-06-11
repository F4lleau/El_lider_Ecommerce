import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  to: string;
}

const CategoryCard = ({ name, icon: Icon, color, to }: CategoryCardProps) => (
  <Link to={to} className="group flex min-h-36 flex-col justify-between rounded-3xl border bg-card p-4 shadow-card transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-elevated sm:min-h-44 sm:p-5">
    <div className={`grid h-12 w-12 place-items-center rounded-2xl ${color} transition-transform group-hover:scale-105 sm:h-14 sm:w-14`}><Icon className="h-6 w-6 sm:h-7 sm:w-7" /></div>
    <div className="flex items-end justify-between gap-2"><span className="font-heading text-sm font-extrabold sm:text-base">{name}</span><ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /></div>
  </Link>
);
export default CategoryCard;
