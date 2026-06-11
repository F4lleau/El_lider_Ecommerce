import { Clock, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogo } from "../brand/BrandLogo";

const Footer = () => (
  <footer className="mt-16 border-t bg-foreground text-background">
    <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-4"><BrandLogo className="[&_span]:text-background" /><p className="max-w-xs text-sm leading-relaxed text-background/65">Repostería, descartables, cotillón, envases y gastronomía para tu negocio y tus mejores ideas.</p></div>
      <div><h3 className="mb-4 font-heading font-bold">Explorá</h3><div className="grid gap-2 text-sm text-background/65"><Link className="hover:text-background" to="/productos">Todos los productos</Link><Link className="hover:text-background" to="/productos/ofertas">Ofertas</Link><Link className="hover:text-background" to="/productos/mas-vendidos">Más vendidos</Link><Link className="hover:text-background" to="/nosotros">Nosotros</Link></div></div>
      <div><h3 className="mb-4 font-heading font-bold">Visitanos</h3><div className="grid gap-3 text-sm text-background/65"><span className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-accent" />Av. Belgrano 103</span><span className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-accent" />Lun a Sáb, 8:00 a 18:00</span><span className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" />(011) 1234-5678</span></div></div>
      <div><h3 className="mb-4 font-heading font-bold">Hablemos</h3><div className="flex gap-3"><a className="touch-target rounded-xl bg-background/10 hover:bg-background/20" href="https://wa.me/541112345678" aria-label="WhatsApp"><MessageCircle className="h-5 w-5" /></a><a className="touch-target rounded-xl bg-background/10 hover:bg-background/20" href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a></div></div>
    </div>
    <div className="border-t border-background/10 py-5 text-center text-xs text-background/50">© {new Date().getFullYear()} El Líder. Todo para crear.</div>
  </footer>
);
export default Footer;
