import { useEffect, useState } from "react";
import { productsApi } from "./api";
import type { Product } from "./types";

type UseProductsOptions = {
  mode?: "all" | "offers" | "featured" | "new";
};

export function useProducts(options: UseProductsOptions = {}) {
  const { mode = "all" } = options;
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result =
          mode === "offers"
            ? await productsApi.listOffers()
            : mode === "featured"
              ? await productsApi.listFeatured()
              : mode === "new"
                ? await productsApi.listNew()
                : await productsApi.list();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudieron cargar los productos");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [mode]);

  return { data, isLoading, error };
}
