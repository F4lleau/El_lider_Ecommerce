import type { ReactNode } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { BrandLogo } from "../brand/BrandLogo";

export function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="container grid min-h-[calc(100vh-8rem)] items-center gap-8 py-8 lg:grid-cols-[1fr_480px] lg:py-14">
      <section className="hidden rounded-2xl bg-primary p-10 text-primary-foreground shadow-elevated lg:block">
        <BrandLogo className="mb-16 [&_*]:text-primary-foreground" />
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider"><Sparkles className="h-4 w-4 text-white" />Todo en insumos</span>
        <h2 className="mt-6 max-w-xl font-heading text-5xl font-extrabold leading-tight">Guardá tu carrito y comprá más rápido.</h2>
        <div className="mt-10 grid gap-4 text-sm text-primary-foreground/72">
          {["Sincronizá tu carrito automáticamente", "Accedé desde cualquier dispositivo", "Comprá con precios y stock actualizados"].map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-white" />{item}</p>)}
        </div>
      </section>
      <section className="rounded-2xl border bg-card p-5 shadow-elevated sm:p-8">
        <BrandLogo className="mb-8 lg:hidden" />
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="section-title text-3xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        <div className="mt-8">{children}</div>
      </section>
    </div>
  );
}
