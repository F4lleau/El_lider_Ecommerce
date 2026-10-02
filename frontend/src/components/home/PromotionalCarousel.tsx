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
    <div className="relative grid min-h-[205px] overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 via-orange-400 to-orange-200 text-white shadow-elevated sm:min-h-[260px] lg:min-h-[310px] lg:grid-cols-[0.9fr_1.1fr]">
      <img
        src={slide.imageUrl}
        alt={slide.imageAlt}
        className="absolute bottom-0 right-0 h-full w-[54%] object-contain object-right-bottom lg:static lg:order-last lg:w-full lg:object-contain lg:p-5"
      />
      <div className="absolute inset-y-0 left-0 w-[72%] bg-gradient-to-r from-rose-700 via-rose-600/95 to-rose-600/0 lg:w-[58%]" />
      <div className="relative order-first flex max-w-[64%] flex-col justify-center px-4 py-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:max-w-[58%] sm:px-7 lg:order-none lg:max-w-none lg:px-10 lg:drop-shadow-none">
        {slide.badge ? <span className="mb-2 w-fit rounded-full bg-white px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-rose-600 shadow-sm sm:text-xs">{slide.badge}</span> : null}
        <h1 className="max-w-2xl font-heading text-xl font-extrabold leading-tight sm:text-3xl lg:text-5xl">{slide.title}</h1>
        {slide.subtitle ? <p className="mt-2 line-clamp-2 max-w-xl text-[11px] font-semibold leading-snug text-white sm:text-sm lg:line-clamp-none lg:text-base">{slide.subtitle}</p> : null}
        {hasPrice ? (
          <div className="mt-3 flex flex-wrap items-end gap-2 sm:gap-3">
            {promotionalPrice ? <span className="font-heading text-2xl font-extrabold leading-none sm:text-4xl lg:text-5xl">${promotionalPrice.toLocaleString("es-AR")}</span> : null}
            {normalPrice ? <span className="pb-0.5 text-xs font-bold text-white/80 line-through sm:text-base">${normalPrice.toLocaleString("es-AR")}</span> : null}
            {discount ? <span className="mb-0.5 rounded-full bg-yellow-300 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 sm:px-3 sm:py-1 sm:text-sm">{discount}% OFF</span> : null}
          </div>
        ) : null}
        <div className="mt-3 sm:mt-5">
          <Button size="sm" className="h-8 px-3 text-xs sm:h-11 sm:px-8 sm:text-sm" asChild>
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
  if (slides.length === 0) return <div className="min-h-[205px] animate-pulse rounded-2xl bg-secondary sm:min-h-[260px] lg:min-h-[310px]" />;

  const current = slides[active] ?? slides[0];
  const previous = () => setActive((value) => (value - 1 + slides.length) % slides.length);
  const next = () => setActive((value) => (value + 1) % slides.length);

  return (
    <div className="relative">
      <SlideContent slide={current} />
      {slides.length > 1 ? (
        <>
          <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-4">
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
              <button type="button" aria-label="Promocion anterior" className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 sm:h-10 sm:w-10" onClick={previous}><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" aria-label="Promocion siguiente" className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 sm:h-10 sm:w-10" onClick={next}><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
