import { Mail, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const AboutContactPage = () => {
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="font-heading text-3xl font-bold mb-6">Contacto</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Canales de atención</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />(011) 1234-5678</p>
          <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />info@ellider.com</p>
          <p className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" />Respuesta en horario comercial</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutContactPage;
