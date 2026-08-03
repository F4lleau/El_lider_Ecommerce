import { Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const AboutAddressPage = () => {
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="mb-6 font-heading text-3xl font-bold">Nuestra dirección</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            El Líder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p><strong className="text-foreground">Dirección:</strong> Av. Manuel Belgrano, La Leonesa, Chaco</p>
          <p><strong className="text-foreground">Referencia:</strong> Frente del salón ex fantasía</p>
          <p className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4" /><span>Lunes a sábado<br />8:00 a 12:30<br />16:30 a 20:30</span></p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutAddressPage;
