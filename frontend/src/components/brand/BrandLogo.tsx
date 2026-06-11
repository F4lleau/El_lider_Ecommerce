import { PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function BrandLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label="El Líder, inicio">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-brand transition-transform group-hover:-rotate-3">
        <PackageOpen className="h-5 w-5" />
      </span>
      {!compact ? (
        <span className="leading-none">
          <span className="block font-heading text-lg font-extrabold tracking-tight text-foreground">El Líder</span>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Todo para crear</span>
        </span>
      ) : null}
    </Link>
  );
}
