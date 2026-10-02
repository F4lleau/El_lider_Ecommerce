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
    <div className="relative grid min-h-[265px] overflow-hidden rounded-2xl bg-[#f43f5e] text-white shadow-elevated sm:min-h-[310px] lg:min-h-[340px] lg:grid-cols-[0.9fr_1.1fr]">
      <img
        src={slide.imageUrl}
        alt={slide.imageAlt}
        className="absolute bottom-0 right-0 h-full w-[58%] object-contain object-right-bottom opacity-95 lg:static lg:order-last lg:w-full lg:object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-rose-700 via-rose-600/92 to-orange-400/25 lg:from-rose-700 lg:via-orange-500/95 lg:to-transparent" />
      <div className="relative order-first flex max-w-[68%] flex-col justify-center px-5 py-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:max-w-[60%] sm:px-8 lg:order-none lg:max-w-none lg:px-10 lg:drop-shadow-none">
        {slide.badge ? <span className="mb-3 w-fit rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-rose-600 shadow-sm sm:text-xs">{slide.badge}</span> : null}
        <h1 className="max-w-2xl font-heading text-2xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{slide.title}</h1>
        {slide.subtitle ? <p className="mt-3 line-clamp-2 max-w-xl text-xs font-semibold leading-relaxed text-white sm:text-sm lg:line-clamp-none lg:text-base">{slide.subtitle}</p> : null}
        {hasPrice ? (
          <div className="mt-4 flex flex-wrap items-end gap-2 sm:gap-3">
            {promotionalPrice ? <span className="font-heading text-3xl font-extrabold leading-none sm:text-4xl lg:text-5xl">${promotionalPrice.toLocaleString("es-AR")}</span> : null}
            {normalPrice ? <span className="pb-1 text-sm font-bold text-white/80 line-through sm:text-base">${normalPrice.toLocaleString("es-AR")}</span> : null}
            {discount ? <span className="mb-1 rounded-full bg-yellow-300 px-2.5 py-1 text-xs font-extrabold text-rose-700 sm:px-3 sm:text-sm">{discount}% OFF</span> : null}
          </div>
        ) : null}
        <div className="mt-5">
          <Button size="sm" className="sm:h-11 sm:px-8" asChild>
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
  if (slides.length === 0) return <div className="min-h-[265px] animate-pulse rounded-2xl bg-secondary sm:min-h-[310px] lg:min-h-[340px]" />;

  const current = slides[active] ?? slides[0];
  const previous = () => setActive((value) => (value - 1 + slides.length) % slides.length);
  const next = () => setActive((value) => (value + 1) % slides.length);

  return (
    <div className="relative">
      <SlideContent slide={current} />
      {slides.length > 1 ? (
        <>
          <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-4 sm:bottom-4">
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
