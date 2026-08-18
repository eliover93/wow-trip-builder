export type PlanId = "starter" | "pro" | "team";
export type CicloFacturacion = "monthly" | "yearly";

export type Plan = {
  id: PlanId;
  nombre: string;
  precioMensual: number;
  precioAnual: number;
  limiteItinerarios: number | null;
  ventajas: string[];
};

/** Catálogo de planes (espejo de la tabla `planes` en la base de datos). */
export const PLANES: Plan[] = [
  {
    id: "starter",
    nombre: "Starter",
    precioMensual: 29,
    precioAnual: 279,
    limiteItinerarios: 10,
    ventajas: ["10 itinerarios activos al mes", "Marca de Voyara en las propuestas", "1 usuario"],
  },
  {
    id: "pro",
    nombre: "Pro",
    precioMensual: 59,
    precioAnual: 569,
    limiteItinerarios: null,
    ventajas: ["Itinerarios ilimitados", "Marca blanca con tu logo", "Dominio personalizado"],
  },
  {
    id: "team",
    nombre: "Team",
    precioMensual: 99,
    precioAnual: 949,
    limiteItinerarios: null,
    ventajas: ["Todo lo de Pro", "Hasta 5 usuarios por agencia", "Analíticas de lectura"],
  },
];

export const planPorId = (id: PlanId) => PLANES.find((p) => p.id === id) ?? PLANES[0]!;
