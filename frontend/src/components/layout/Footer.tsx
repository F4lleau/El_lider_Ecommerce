import { Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => (
  <footer className="relative mt-10 overflow-hidden border-t border-white/10 bg-hero-gradient text-white">
    <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(0_0%_100%/0.03)_1px,transparent_1px),linear-gradient(180deg,hsl(0_0%_100%/0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
    <div className="container relative grid gap-6 py-6 md:grid-cols-3">
      <section>
        <h3 className="mb-3 font-heading text-sm font-extrabold uppercase tracking-wide">Dirección</h3>
        <div className="grid gap-2 text-sm text-white/70">
          <span className="flex gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-accent" />
            Av. Manuel Belgrano 203, La Leonesa, Chaco
          </span>
          <span className="pl-6">Frente del salón ex fantasía</span>
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-heading text-sm font-extrabold uppercase tracking-wide">Horario de atención</h3>
        <div className="grid gap-2 text-sm text-white/70">
          <span className="flex gap-2">
            <Clock className="h-4 w-4 shrink-0 text-accent" />
            Lunes a sábado
          </span>
          <span className="pl-6">8:00 a 12:30</span>
          <span className="pl-6">16:30 a 20:30</span>
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-heading text-sm font-extrabold uppercase tracking-wide">Contacto</h3>
        <div className="grid gap-2 text-sm text-white/70">
          <a
            className="flex gap-2 transition-colors hover:text-accent"
            href="https://www.instagram.com/el.liderpolirrubros/"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram className="h-4 w-4 shrink-0 text-accent" />
            @el.liderpolirrubros
          </a>
          <a className="flex gap-2 transition-colors hover:text-accent" href="tel:+5493725403009">
            <Phone className="h-4 w-4 shrink-0 text-accent" />
            +54 9 3725 40-3009
          </a>
          <a className="flex gap-2 transition-colors hover:text-accent" href="mailto:polirrubroellider@gmail.com">
            <Mail className="h-4 w-4 shrink-0 text-accent" />
            polirrubroellider@gmail.com
          </a>
        </div>
      </section>
    </div>
    <div className="relative border-t border-white/10 py-3 text-center text-xs text-white/50">
      © {new Date().getFullYear()} El Líder. Todo en productos e insumos.
    </div>
  </footer>
);

export default Footer;
