export type PlanId = "starter" | "pro" | "team";
export type CicloFacturacion = "monthly" | "yearly";

export type Plan = {
  id: PlanId;
  nombre: string;
  descripcion: string;
  precioMensual: number;
  precioAnual: number;
  limiteItinerarios: number | null;
  destacado?: boolean;
  ventajas: string[];
};

/** Catálogo de planes (espejo de la tabla `planes` en la base de datos). */
export const PLANES: Plan[] = [
  {
    id: "starter",
    nombre: "Starter",
    descripcion: "Para agencias que empiezan a digitalizar sus propuestas.",
    precioMensual: 29,
    precioAnual: 279,
    limiteItinerarios: 10,
    ventajas: [
      "10 itinerarios activos al mes",
      "Editor visual y presupuestos",
      "Propuestas con marca de Voyara",
      "1 usuario",
      "Soporte por email",
    ],
  },
  {
    id: "pro",
    nombre: "Pro",
    descripcion: "El plan completo para vender viajes sin límites.",
    precioMensual: 59,
    precioAnual: 569,
    limiteItinerarios: null,
    destacado: true,
    ventajas: [
      "Itinerarios ilimitados",
      "Marca blanca con el logo de tu agencia",
      "Dominio personalizado",
      "Editor visual y presupuestos",
      "Soporte prioritario",
    ],
  },
  {
    id: "team",
    nombre: "Team",
    descripcion: "Para equipos que trabajan varias propuestas a la vez.",
    precioMensual: 99,
    precioAnual: 949,
    limiteItinerarios: null,
    ventajas: [
      "Todo lo incluido en Pro",
      "Hasta 5 usuarios por agencia",
      "Analíticas de lectura de las propuestas",
      "Roles y trabajo en equipo",
      "Soporte prioritario",
    ],
  },
];

export const planPorId = (id: PlanId) => PLANES.find((p) => p.id === id) ?? PLANES[0]!;

export const ordenPlan = (id: PlanId) => PLANES.findIndex((p) => p.id === id);

/** Porcentaje de ahorro del pago anual frente a 12 mensualidades. */
export const ahorroAnual = (plan: Plan) =>
  Math.round((1 - plan.precioAnual / (plan.precioMensual * 12)) * 100);

export const precioMostrado = (plan: Plan, ciclo: CicloFacturacion) =>
  ciclo === "monthly" ? plan.precioMensual : Math.round(plan.precioAnual / 12);
