import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export function BrandLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("group flex min-w-0 items-center gap-3", className)} aria-label="El Líder, inicio">
      <span className="flex h-14 w-28 shrink-0 items-center justify-center overflow-visible transition-transform group-hover:-translate-y-0.5 sm:h-16 sm:w-36 lg:h-[4.5rem] lg:w-44">
        <img src="/el_lider_logo.png" alt="" className="h-full w-full object-contain" />
      </span>
      {!compact ? (
        <span className="min-w-0 leading-none">
          <span className="block font-heading text-lg font-extrabold tracking-tight text-foreground sm:text-xl">El Líder</span>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Todo en insumos</span>
        </span>
      ) : null}
    </Link>
  );
}
