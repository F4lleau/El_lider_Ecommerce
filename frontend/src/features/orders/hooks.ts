import { useEffect, useState } from "react";
import { ordersApi } from "./api";
import type { Order } from "@/types/order";

export function useMyOrders() {
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    void ordersApi.listMine().then(setData).catch((caught) => setError(caught instanceof Error ? caught.message : "No se pudieron cargar los pedidos")).finally(() => setIsLoading(false));
  }, []);
  return { data, isLoading, error };
}
