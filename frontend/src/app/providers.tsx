import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../features/auth/store";
import { useCartStore } from "../features/cart/store";

type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function AppProviders({ children }: Props) {
  const initialize = useAuthStore((state) => state.initialize);
  const initializeCart = useCartStore((state) => state.initialize);

  useEffect(() => {
    void initialize().then(initializeCart).catch(() => undefined);
  }, [initialize, initializeCart]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
