import { MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const AboutAddressPage = () => {
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-6">Nuestra dirección</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            Art. Descartables El Líder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p><strong className="text-foreground">Dirección:</strong> Av. Belgrano 103</p>
          <p><strong className="text-foreground">Ciudad:</strong> Buenos Aires, Argentina</p>
          <p className="flex items-center gap-2"><Clock className="h-4 w-4" />Lun a Sáb: 8:00 - 18:00</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutAddressPage;
