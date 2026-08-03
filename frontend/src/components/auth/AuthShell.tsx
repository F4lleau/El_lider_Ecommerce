import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(0_0%_100%/0.035)_1px,transparent_1px),linear-gradient(180deg,hsl(0_0%_100%/0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
      <div className="container relative grid min-h-[calc(100vh-8.75rem)] place-items-center py-6 sm:py-8 lg:min-h-[calc(100vh-9.5rem)]">
        <section className="w-full max-w-md rounded-2xl border border-white/12 bg-white p-5 shadow-elevated sm:p-8">
          {eyebrow ? (
            <span className="mb-4 inline-flex rounded-full bg-sky/15 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-7">{children}</div>
        </section>
      </div>
    </main>
  );
}
