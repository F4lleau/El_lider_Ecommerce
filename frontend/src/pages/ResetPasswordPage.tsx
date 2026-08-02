import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";

const validatePassword = (password: string, confirmPassword: string) => {
  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
  if (!/[A-Z]/.test(password)) return "La contraseña debe incluir una mayúscula.";
  if (!/[a-z]/.test(password)) return "La contraseña debe incluir una minúscula.";
  if (!/[^A-Za-z0-9]/.test(password)) return "La contraseña debe incluir un carácter especial.";
  if (password !== confirmPassword) return "Las contraseñas no coinciden.";
  return "";
};

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(Boolean(token));
  const [error, setError] = useState(token ? "" : "Falta el token de recuperación.");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;
    void authService.validateResetToken({ token }).then(() => setError("")).catch((caught) => setError(caught instanceof Error ? caught.message : "El link no es válido o expiró")).finally(() => setChecking(false));
  }, [token]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validatePassword(password, confirmPassword);
    if (validation) { setError(validation); return; }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await authService.resetPassword({ token, password, confirmPassword });
      setSuccess(response.message || "Tu contraseña fue actualizada. Ya podés iniciar sesión.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return <AuthShell eyebrow="Nueva clave" title="Resetear contraseña" description="Creá una contraseña segura para volver a ingresar.">{checking ? <p className="rounded-xl bg-secondary p-3 text-sm font-semibold">Validando link...</p> : <form className="space-y-5" onSubmit={submit}><div className="space-y-2"><Label htmlFor="new-password">Nueva contraseña</Label><Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={Boolean(success) || !token} /></div><div className="space-y-2"><Label htmlFor="confirm-password">Confirmar nueva contraseña</Label><Input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required disabled={Boolean(success) || !token} /></div>{error ? <p className="rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive" role="alert">{error}</p> : null}{success ? <p className="rounded-xl bg-primary/10 p-3 text-sm font-semibold text-primary" role="status">{success}</p> : null}{!success ? <Button className="w-full" size="lg" disabled={loading || !token}>{loading ? "Actualizando..." : <><KeyRound className="h-4 w-4" /> Actualizar contraseña</>}</Button> : <Button className="w-full" size="lg" asChild><Link to="/login">Ir al login</Link></Button>}</form>}</AuthShell>;
}
