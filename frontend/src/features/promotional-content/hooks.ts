import { useQuery } from "@tanstack/react-query";
import { promotionalContentApi } from "./api";

export const usePromotionalSlides = () =>
  useQuery({
    queryKey: ["promotional-slides"],
    queryFn: promotionalContentApi.slides,
    staleTime: 5 * 60 * 1000,
  });

export const usePromotionalPopup = () =>
  useQuery({
    queryKey: ["promotional-popup"],
    queryFn: promotionalContentApi.popup,
    staleTime: 5 * 60 * 1000,
  });
