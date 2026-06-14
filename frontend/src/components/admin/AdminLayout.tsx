import { useState } from "react";
import { Boxes, ClipboardList, LayoutDashboard, LogOut, Menu, PackageSearch, Store, Tags, X } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/productos", label: "Productos", icon: Boxes },
  { to: "/admin/categorias", label: "Categorías", icon: Tags },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/solicitudes-stock", label: "Solicitudes", icon: PackageSearch },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const nav = <nav className="space-y-1">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors", isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}><Icon className="h-4 w-4" />{label}</NavLink>)}</nav>;
  return <div className="min-h-screen bg-secondary/40">
    <aside className={cn("fixed inset-y-0 left-0 z-50 w-72 border-r bg-card p-5 transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}><div className="mb-8 flex items-center justify-between"><Link to="/admin/dashboard" className="font-heading text-xl font-extrabold text-primary">El Líder Admin</Link><button className="lg:hidden" onClick={() => setOpen(false)}><X /></button></div>{nav}<div className="absolute bottom-5 left-5 right-5 space-y-2"><Button variant="outline" className="w-full justify-start" asChild><Link to="/"><Store />Volver a tienda</Link></Button><Button variant="ghost" className="w-full justify-start" onClick={logout}><LogOut />Cerrar sesión</Button></div></aside>
    {open ? <button aria-label="Cerrar menú" className="fixed inset-0 z-40 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)} /> : null}
    <div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6"><button className="lg:hidden" onClick={() => setOpen(true)}><Menu /></button><div className="ml-auto text-right"><p className="text-sm font-bold">{user?.firstName} {user?.lastName}</p><p className="text-xs text-muted-foreground">{user?.email}</p></div></header><main className="min-w-0 p-4 sm:p-6 lg:p-8"><Outlet /></main></div>
  </div>;
}
