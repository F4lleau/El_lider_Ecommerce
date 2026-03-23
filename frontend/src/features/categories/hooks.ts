import { useEffect, useState } from "react";
import { categoriesApi } from "./api";
import type { Category } from "./types";

export function useCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        setData(await categoriesApi.list());
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudieron cargar las categorías");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return { data, isLoading, error };
}
