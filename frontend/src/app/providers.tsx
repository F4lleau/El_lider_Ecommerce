import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../features/auth/store";
import { useCartStore } from "../features/cart/store";

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  const initialize = useAuthStore((state) => state.initialize);
  const initializeCart = useCartStore((state) => state.initialize);

  useEffect(() => {
    void initialize().then(initializeCart).catch(() => undefined);
  }, [initialize, initializeCart]);

  return <>{children}</>;
}
