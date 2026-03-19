import { MapPin, Phone, Mail, Clock, Award, Truck, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Award, title: "Calidad Garantizada", desc: "Trabajamos con las mejores marcas del mercado." },
  { icon: Truck, title: "Envíos Rápidos", desc: "Entregamos tu pedido en tiempo récord." },
  { icon: Shield, title: "Compra Segura", desc: "Tu información siempre protegida." },
];

const Nosotros = () => {
  return (
    <div className="container py-8 animate-fade-in space-y-12">
      <section>
        <h1 className="font-heading text-3xl font-bold mb-4">Quiénes Somos</h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Somos <strong>Art. Descartables El Líder</strong>, ubicados en Av. Belgrano 103. Desde hace años proveemos a panaderías, confiterías, salones de fiestas y comercios con la más amplia variedad de productos descartables, artículos de repostería, cotillón, plásticos y envases.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <Card key={f.title} className="shadow-card">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold mb-4">Contacto y Dirección</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Dirección</p>
                  <p className="text-sm text-muted-foreground">Av. Belgrano 103</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Teléfono</p>
                  <p className="text-sm text-muted-foreground">(011) 1234-5678</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">info@ellider.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Horarios</p>
                  <p className="text-sm text-muted-foreground">Lun a Sáb: 8:00 - 18:00</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="rounded-lg overflow-hidden border h-64 md:h-auto bg-muted flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.9!2d-58.38!3d-34.61!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzM2LjAiUyA1OMKwMjInNDguMCJX!5e0!3m2!1ses!2sar!4v1"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              title="Ubicación"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;
