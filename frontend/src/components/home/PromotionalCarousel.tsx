import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { promoDestinationTo } from "@/features/promotional-content/api";
import { usePromotionalSlides } from "@/features/promotional-content/hooks";
import type { PromotionalSlide } from "@/types/promotional-content";

function SlideContent({ slide }: { slide: PromotionalSlide }) {
  const normalPrice = slide.normalPrice ? Number(slide.normalPrice) : null;
  const promotionalPrice = slide.promotionalPrice ? Number(slide.promotionalPrice) : null;
  const hasPrice = normalPrice !== null || promotionalPrice !== null;
  const discount = normalPrice && promotionalPrice ? Math.max(0, Math.round((1 - promotionalPrice / normalPrice) * 100)) : null;

  return (
    <div className="relative grid min-h-[420px] overflow-hidden rounded-2xl bg-[#f43f5e] text-white shadow-elevated lg:grid-cols-[0.9fr_1.1fr]">
      <img
        src={slide.imageUrl}
        alt={slide.imageAlt}
        className="absolute inset-0 h-full w-full object-cover opacity-35 lg:static lg:order-last lg:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-rose-700/95 via-orange-500/78 to-yellow-300/30 lg:from-rose-700 lg:via-orange-500/95 lg:to-transparent" />
      <div className="relative order-first flex flex-col justify-center px-5 py-10 sm:px-8 lg:order-none lg:px-10">
        {slide.badge ? <span className="mb-4 w-fit rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-rose-600 shadow-sm">{slide.badge}</span> : null}
        <h1 className="max-w-2xl font-heading text-3xl font-extrabold leading-tight sm:text-5xl">{slide.title}</h1>
        {slide.subtitle ? <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-white/90 sm:text-base">{slide.subtitle}</p> : null}
        {hasPrice ? (
          <div className="mt-6 flex flex-wrap items-end gap-3">
            {promotionalPrice ? <span className="font-heading text-4xl font-extrabold leading-none sm:text-5xl">${promotionalPrice.toLocaleString("es-AR")}</span> : null}
            {normalPrice ? <span className="pb-1 text-base font-bold text-white/75 line-through">${normalPrice.toLocaleString("es-AR")}</span> : null}
            {discount ? <span className="mb-1 rounded-full bg-yellow-300 px-3 py-1 text-sm font-extrabold text-rose-700">{discount}% OFF</span> : null}
          </div>
        ) : null}
        <div className="mt-7">
          <Button size="lg" asChild>
            <Link to={promoDestinationTo(slide)}>{slide.ctaLabel}<ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PromotionalCarousel({ fallback }: { fallback: React.ReactNode }) {
  const { data = [], isLoading } = usePromotionalSlides();
  const [active, setActive] = useState(0);
  const slides = data.slice(0, 8);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (active >= slides.length) setActive(0);
  }, [active, slides.length]);

  if (!isLoading && slides.length === 0) return <>{fallback}</>;
  if (slides.length === 0) return <div className="min-h-[420px] animate-pulse rounded-2xl bg-secondary" />;

  const current = slides[active] ?? slides[0];
  const previous = () => setActive((value) => (value - 1 + slides.length) % slides.length);
  const next = () => setActive((value) => (value + 1) % slides.length);

  return (
    <div className="relative">
      <SlideContent slide={current} />
      {slides.length > 1 ? (
        <>
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Ver promocion ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${index === active ? "w-8 bg-white" : "w-2.5 bg-white/45"}`}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Promocion anterior" className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25" onClick={previous}><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" aria-label="Promocion siguiente" className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25" onClick={next}><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
