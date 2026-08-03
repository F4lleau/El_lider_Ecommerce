import { Clock, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const AboutContactPage = () => {
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="mb-6 font-heading text-3xl font-bold">Contacto</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Atención comercial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" />Av. Manuel Belgrano, La Leonesa, Chaco</p>
          <p className="pl-6 text-sm text-muted-foreground">Frente del salón ex fantasía</p>
          <p className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-primary" />Lunes a sábado, 8:00 a 12:30 y 16:30 a 20:30</p>
          <p className="flex items-start gap-2"><MessageCircle className="mt-0.5 h-4 w-4 text-primary" />Consultas y atención en horario comercial.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutContactPage;
