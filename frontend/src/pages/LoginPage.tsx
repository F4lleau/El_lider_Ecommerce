import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); clearError(); try { const user = await login({ email, password }); const requestedPath = (location.state as { from?: string } | null)?.from; navigate(requestedPath ?? (user.role === "ADMIN" ? "/admin/dashboard" : "/mi-cuenta"), { replace: true }); } catch { /* store expone error */ } };

  return <AuthShell eyebrow="Qué bueno verte" title="Iniciá sesión" description="Recuperá tu carrito y seguí donde lo dejaste."><form className="space-y-5" onSubmit={onSubmit}><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" placeholder="tu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="password">Contraseña</Label><Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>{error ? <p className="rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive" role="alert">{error}</p> : null}<Button className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Ingresando..." : <>Ingresar <ArrowRight className="h-4 w-4" /></>}</Button><p className="text-center text-sm text-muted-foreground">¿No tenés cuenta? <Link to="/registro" className="font-bold text-primary hover:underline">Creala ahora</Link></p></form></AuthShell>;
};
export default LoginPage;
