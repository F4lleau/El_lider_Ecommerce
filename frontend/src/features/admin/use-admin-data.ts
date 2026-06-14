import { useCallback, useEffect, useRef, useState } from "react";

export function useAdminData<T>(loader: () => Promise<T>) {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { setData(await loaderRef.current()); } catch (caught) { setError(caught instanceof Error ? caught.message : "No se pudieron cargar los datos"); } finally { setIsLoading(false); }
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  return { data, isLoading, error, reload, setData };
}
