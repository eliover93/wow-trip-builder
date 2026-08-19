import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { OFERTA_FUNDADORES, OFERTA_STORAGE_KEY, ofertaActiva } from "@/lib/oferta-fundadores";

/** Banner promocional temporal para las primeras agencias (plan Pro con precio fundador). */
export function BannerFundadores() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ofertaActiva()) return;
    try {
      if (window.localStorage.getItem(OFERTA_STORAGE_KEY) === "1") return;
    } catch {
      /* almacenamiento no disponible */
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  const cerrar = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(OFERTA_STORAGE_KEY, "1");
    } catch {
      /* almacenamiento no disponible */
    }
  };

  return (
    <div className="relative flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-2xl border border-primary/40 bg-primary/10 px-5 py-4">
      <p className="max-w-3xl pr-8 text-sm">
        🚀 <strong>Oferta Especial Fundadores:</strong> Consigue el Plan Pro por solo{" "}
        {OFERTA_FUNDADORES.precioMensual}€/mes para siempre (Solo para las primeras{" "}
        {OFERTA_FUNDADORES.plazas} agencias)
      </p>
      <Link
        to="/planes"
        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
      >
        Conseguir precio fundador
      </Link>
      <button
        onClick={cerrar}
        aria-label="Cerrar oferta"
        className="absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
