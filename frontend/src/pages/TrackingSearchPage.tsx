import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TrackingSearchPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  return <div className="section-shell"><div className="empty-state mx-auto max-w-xl"><h1 className="section-title">Seguimiento</h1><p className="mt-3 text-muted-foreground">Ingresá el código de seguimiento recibido al crear tu orden.</p><form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={(event) => { event.preventDefault(); navigate(`/pedido/${encodeURIComponent(code.trim())}`); }}><Input required value={code} onChange={(event) => setCode(event.target.value)} placeholder="Código de seguimiento" /><Button>Buscar</Button></form></div></div>;
}
