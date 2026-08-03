import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { AuthShell } from "../components/auth/AuthShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { authService } from "../services/auth.service";

const genericMessage = "Si el email existe, te enviaremos instrucciones para recuperar tu contraseña.";

const getResetPath = (resetUrl: string) => {
  const url = new URL(resetUrl);
  return `${url.pathname}${url.search}`;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const resetPath = resetUrl ? getResetPath(resetUrl) : null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setResetUrl(null);

    try {
      const response = await authService.forgotPassword({ email });
      setMessage(response.message || genericMessage);
      setResetUrl(response.resetUrl ?? null);
    } catch (caught) {
      const fallbackError = "No se pudo solicitar la recuperación";
      setError(caught instanceof Error ? caught.message : fallbackError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Recuperación"
      title="Recuperá tu contraseña"
      description="Ingresá tu email y te enviaremos instrucciones para crear una nueva clave."
    >
      <form className="space-y-5" onSubmit={submit}>
        <div className="space-y-2">
          <Label htmlFor="recover-email">Email</Label>
          <Input
            id="recover-email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        {message ? (
          <div className="rounded-xl bg-accent/10 p-3 text-sm font-semibold text-accent" role="status">
            <p>{message}</p>
            {resetPath ? (
              <p className="mt-2 break-all text-xs">
                Modo desarrollo:{" "}
                <Link className="underline" to={resetPath}>
                  Abrir link de reset
                </Link>
              </p>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <p className="rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button className="w-full" size="lg" disabled={loading}>
          {loading ? (
            "Enviando..."
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Enviar instrucciones
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-bold text-accent hover:underline">
            Volver al login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
