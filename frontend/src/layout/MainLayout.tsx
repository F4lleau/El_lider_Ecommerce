import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useCartStore } from "../features/cart/store";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const cartCount = useCartStore((state) => state.cart.summary.itemsCount);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-60"}`}
      >
        <Header
          onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
          cartCount={cartCount}
        />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
