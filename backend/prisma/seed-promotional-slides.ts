import { PromoLinkType } from "@prisma/client";
import { prisma } from "../src/lib/prisma.js";

const slides = [
  {
    title: "2x1 en relleno y cobertura frutilla",
    subtitle: "Relleno y cobertura sabor frutilla Ledevit 500 g. Ideal para tortas, postres y decoracion.",
    imageUrl: "/img_productos/rell-y-cob-frutilla-ledevit-500grs.jpg",
    imageAlt: "Relleno y cobertura sabor frutilla Ledevit de 500 gramos",
    ctaLabel: "Aprovechar 2x1",
    linkType: PromoLinkType.OFFERS,
    linkValue: null,
    badge: "Promo 2x1",
    normalPrice: "6200",
    promotionalPrice: "3100",
    priority: 100,
    isFeatured: true,
    isActive: true,
  },
  {
    title: "Bizcochuelo de vainilla Valente",
    subtitle: "Promocion por tiempo limitado para stockear tu negocio o preparar pedidos especiales.",
    imageUrl: "/img_productos/Bizcochuelo-Valente-Bizcochuelo-Valente-550-Gr-1-27528.webp",
    imageAlt: "Bizcochuelo de vainilla Valente 550 gramos",
    ctaLabel: "Ver descuento",
    linkType: PromoLinkType.OFFERS,
    linkValue: null,
    badge: "Tiempo limitado",
    normalPrice: "4200",
    promotionalPrice: "3490",
    priority: 90,
    isFeatured: true,
    isActive: true,
  },
];

for (const slide of slides) {
  const existing = await prisma.promotionalSlide.findFirst({ where: { title: slide.title } });
  if (existing) {
    await prisma.promotionalSlide.update({ where: { id: existing.id }, data: slide });
  } else {
    await prisma.promotionalSlide.create({ data: slide });
  }
}

console.log(`Seeded ${slides.length} promotional slides`);
await prisma.$disconnect();
