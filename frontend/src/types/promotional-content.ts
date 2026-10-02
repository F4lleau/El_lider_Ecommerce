export type PromoLinkType = "CATEGORY" | "PRODUCT" | "SEARCH" | "OFFERS" | "BEST_SELLERS" | "INTERNAL_URL";
export type PopupFrequency = "ONCE" | "ONCE_PER_SESSION" | "ONCE_PER_DAY" | "ALWAYS";

export type PromotionalSlide = {
  id: number;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  linkType: PromoLinkType;
  linkValue?: string | null;
  badge?: string | null;
  normalPrice?: number | string | null;
  promotionalPrice?: number | string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  priority: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PromotionalPopup = {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  ctaLabel?: string | null;
  linkType?: PromoLinkType | null;
  linkValue?: string | null;
  frequency: PopupFrequency;
  startsAt?: string | null;
  endsAt?: string | null;
  productIds?: number[] | null;
  categoryIds?: number[] | null;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PromotionalSlideWrite = Omit<PromotionalSlide, "id" | "createdAt" | "updatedAt">;
export type PromotionalPopupWrite = Omit<PromotionalPopup, "id" | "createdAt" | "updatedAt">;
