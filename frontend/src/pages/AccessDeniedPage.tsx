import { Link } from "react-router-dom";

export default function AccessDeniedPage() {
  return (
    <div className="container py-8 space-y-3">
      <h1 className="font-heading text-3xl font-bold">Acceso denegado</h1>
      <p className="text-muted-foreground">Tu usuario no tiene permisos para acceder a esta sección.</p>
      <Link className="text-primary hover:underline" to="/">Volver al inicio</Link>
    </div>
  );
}
