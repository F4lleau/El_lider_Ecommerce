import { Clock, MapPin, PackageCheck } from "lucide-react";
import { BrandLogo } from "../brand/BrandLogo";

const rubros = ["Artículos descartables", "Repostería", "Pastelería", "Panificación", "Limpieza", "Golosinas"];

const Footer = () => (
  <footer className="relative mt-12 overflow-hidden border-t border-white/10 bg-hero-gradient text-white">
    <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(0_0%_100%/0.035)_1px,transparent_1px),linear-gradient(180deg,hsl(0_0%_100%/0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
    <div className="container relative grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1fr]">
      <div className="space-y-4">
        <BrandLogo className="[&_*]:text-white" />
        <p className="max-w-sm text-sm leading-relaxed text-white/68">
          Polirrubro El Líder. Todo en insumos para eventos, emprendimientos y compras diarias.
        </p>
      </div>
      <div>
        <h3 className="mb-4 font-heading font-bold">Rubros</h3>
        <ul className="grid gap-2 text-sm text-white/68">
          {rubros.map((rubro) => (
            <li key={rubro} className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 shrink-0 text-accent" />
              {rubro}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-4 font-heading font-bold">Visitanos</h3>
        <div className="grid gap-3 text-sm text-white/68">
          <span className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-accent" />Av. Manuel Belgrano, La Leonesa, Chaco</span>
          <span className="pl-6">Frente del salón ex fantasía</span>
          <span className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-accent" />Lunes a sábado</span>
          <span className="pl-6">8:00 a 12:30</span>
          <span className="pl-6">16:30 a 20:30</span>
        </div>
      </div>
      <div>
        <h3 className="mb-4 font-heading font-bold">Compra online</h3>
        <p className="text-sm leading-relaxed text-white/68">
          Recorré el catálogo, elegí tus insumos y coordiná retiro en sucursal o envío según disponibilidad.
        </p>
      </div>
    </div>
    <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/55">© {new Date().getFullYear()} El Líder. Todo en insumos.</div>
  </footer>
);

export default Footer;
