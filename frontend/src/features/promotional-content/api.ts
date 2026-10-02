import { apiClient } from "@/services/api-client";
import type { PromotionalPopup, PromotionalSlide } from "@/types/promotional-content";

export const promotionalContentApi = {
  slides: () => apiClient.get<PromotionalSlide[]>("/promotional/slides"),
  popup: () => apiClient.get<PromotionalPopup | null>("/promotional/popup"),
};

export const promoDestinationTo = (item: { linkType?: string | null; linkValue?: string | null }) => {
  switch (item.linkType) {
    case "CATEGORY":
      return item.linkValue ? `/productos/categorias?categoria=${encodeURIComponent(item.linkValue)}` : "/productos/categorias";
    case "PRODUCT":
      return item.linkValue ? `/productos/${encodeURIComponent(item.linkValue)}` : "/productos";
    case "SEARCH":
      return item.linkValue ? `/productos?q=${encodeURIComponent(item.linkValue)}` : "/productos";
    case "OFFERS":
      return "/productos/ofertas";
    case "BEST_SELLERS":
      return "/productos/mas-vendidos";
    case "INTERNAL_URL":
      return item.linkValue || "/";
    default:
      return "/";
  }
};
