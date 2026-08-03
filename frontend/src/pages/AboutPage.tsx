import { Award, Clock, MapPin, PackageCheck, Shield, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Award, title: "Variedad mayorista", desc: "Insumos para múltiples rubros en un solo lugar." },
  { icon: Truck, title: "Pedidos coordinados", desc: "Opciones de retiro y envíos coordinados según la compra." },
  { icon: Shield, title: "Atención cercana", desc: "Acompañamos a comercios, familias y emprendedores." },
];

const rubros = ["artículos descartables", "repostería", "pastelería", "panificación", "artículos de limpieza", "golosinas"];

const Nosotros = () => {
  return (
    <div className="container space-y-12 py-8 animate-fade-in">
      <section>
        <span className="eyebrow">Polirrubro mayorista</span>
        <h1 className="mb-4 font-heading text-3xl font-bold">El Líder, todo en insumos</h1>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">
          Somos <strong>El Líder</strong>, un polirrubro mayorista en La Leonesa, Chaco. Proveemos insumos para artículos descartables, repostería, pastelería, panificación, limpieza, golosinas y otros rubros de uso diario.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="shadow-card">
            <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="shadow-card">
          <CardContent className="space-y-4 pt-6">
            <h2 className="font-heading text-2xl font-bold">Ubicación y horarios</h2>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Av. Manuel Belgrano, La Leonesa, Chaco</p>
                <p className="text-sm text-muted-foreground">Frente del salón ex fantasía</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Lunes a sábado</p>
                <p className="text-sm text-muted-foreground">8:00 a 12:30</p>
                <p className="text-sm text-muted-foreground">16:30 a 20:30</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="space-y-4 pt-6">
            <h2 className="font-heading text-2xl font-bold">Rubros principales</h2>
            <div className="grid gap-2 text-sm text-muted-foreground">
              {rubros.map((rubro) => <span key={rubro} className="flex gap-2"><PackageCheck className="h-4 w-4 shrink-0 text-primary" />{rubro}</span>)}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Nosotros;
