import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "../components/auth/AuthShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { PasswordInput } from "../components/ui/password-input";
import { useAuthStore } from "../features/auth/store";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    try {
      await register({ firstName, lastName, email, password });
      navigate("/mi-cuenta", { replace: true });
    } catch {
      // El store expone el error visible.
    }
  };

  return (
    <AuthShell title="Creá tu cuenta" description="Tu carrito invitado se sincroniza automáticamente al registrarte.">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              autoComplete="given-name"
              placeholder="Juan"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              autoComplete="family-name"
              placeholder="Pérez"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-email">Email</Label>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-password">Contraseña</Label>
          <PasswordInput
            id="reg-password"
            autoComplete="new-password"
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error ? (
          <p className="rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            "Creando cuenta..."
          ) : (
            <>
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="font-bold text-accent hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
