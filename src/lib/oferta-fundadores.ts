import { planPorId } from "@/lib/planes";

/** Oferta de lanzamiento: plan Pro a precio reducido para las primeras agencias. */
export const OFERTA_FUNDADORES = {
  activa: true,
  plan: "pro" as const,
  precioMensual: 19,
  precioAnual: 190,
  plazas: 10,
  /** Código que se aplicará en la pasarela de pago cuando esté conectada. */
  cupon: "FOUNDER19",
  etiqueta: "Oferta Fundadores",
};

export const OFERTA_STORAGE_KEY = "voyara:oferta-fundadores-cerrada";

export const ofertaActiva = () => OFERTA_FUNDADORES.activa;

/** Descuento en % frente al precio de lista del plan Pro. */
export const descuentoFundadores = () => {
  const pro = planPorId(OFERTA_FUNDADORES.plan);
  return Math.round((1 - OFERTA_FUNDADORES.precioMensual / pro.precioMensual) * 100);
};
