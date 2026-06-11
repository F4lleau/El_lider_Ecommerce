import { Button } from "../components/ui/button";
import { useAuthStore } from "../features/auth/store";

export default function AccountPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="container py-8 space-y-4">
      <h1 className="font-heading text-3xl font-bold">Mi cuenta</h1>
      <p>{user?.firstName} {user?.lastName}</p>
      <p className="text-muted-foreground">{user?.email}</p>
      <Button variant="outline" onClick={logout}>Cerrar sesión</Button>
    </div>
  );
}
