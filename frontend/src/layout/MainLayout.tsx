import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/features/cart/store";
import Header from "./Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const cartCount = useCartStore((state) => state.cart.summary.itemsCount);
  return <div className="flex min-h-screen min-w-0 flex-col bg-background"><Header cartCount={cartCount} /><main className="min-w-0 flex-1">{children}</main><Footer /></div>;
}
