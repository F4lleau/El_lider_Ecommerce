import { Link, NavLink, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";

const links = [
  { to: "/mi-cuenta", label: "Resumen", end: true },
  { to: "/mi-cuenta/perfil", label: "Mis datos" },
  { to: "/mi-cuenta/direcciones", label: "Mis direcciones" },
  { to: "/mi-cuenta/pedidos", label: "Mis pedidos" },
  { to: "/mi-cuenta/solicitudes-stock", label: "Solicitudes de stock" },
];

export default function AccountLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="container grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-3xl border bg-card p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Mi cuenta</p>
          <h1 className="font-heading text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
          <p className="break-all text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 flex flex-wrap gap-2 lg:flex-col">
          <Button asChild variant="outline">
            <Link to="/productos">Volver a la tienda</Link>
          </Button>
          <Button variant="ghost" onClick={logout} className="justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesion
          </Button>
        </div>
      </aside>

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
