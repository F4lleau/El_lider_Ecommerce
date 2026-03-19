import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-lg mb-3">El Líder</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu proveedor de confianza en artículos descartables, panadería, repostería, cotillón y todo para envasar.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                Av. Belgrano 103
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                (011) 1234-5678
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                info@ellider.com
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                Lun-Sáb 8:00 - 18:00
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-3">Categorías</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Panadería y Repostería</li>
              <li>Cotillón</li>
              <li>Plásticos y Envases</li>
              <li>Descartables</li>
              <li>Electrodomésticos</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Art. Descartables El Líder. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
