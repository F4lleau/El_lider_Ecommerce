import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const Registro = () => {
  return (
    <div className="container py-12 flex justify-center animate-fade-in">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-mint flex items-center justify-center mb-2">
            <UserPlus className="h-6 w-6 text-mint-foreground" />
          </div>
          <CardTitle className="font-heading text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>Registrate para acceder a ofertas exclusivas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" placeholder="Juan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" placeholder="Pérez" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input id="reg-email" type="email" placeholder="tu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Contraseña</Label>
            <Input id="reg-password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full" size="lg">Crear Cuenta</Button>
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Iniciá sesión</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registro;
