import type { PlanId } from "@/lib/planes";

export type Permisos = {
  /** Oculta el branding de Voyara y permite logo/contacto propios en la propuesta. */
  marcaBlanca: boolean;
  dominioPersonalizado: boolean;
  /** Nº máximo de usuarios de la agencia (1 salvo en Team). */
  usuariosIncluidos: number;
  /** Puede invitar colaboradores/agentes al equipo. */
  invitarColaboradores: boolean;
  analiticasLectura: boolean;
};

const TABLA: Record<PlanId, Permisos> = {
  starter: {
    marcaBlanca: false,
    dominioPersonalizado: false,
    usuariosIncluidos: 1,
    invitarColaboradores: false,
    analiticasLectura: false,
  },
  pro: {
    marcaBlanca: true,
    dominioPersonalizado: true,
    usuariosIncluidos: 1,
    invitarColaboradores: false,
    analiticasLectura: false,
  },
  team: {
    marcaBlanca: true,
    dominioPersonalizado: true,
    usuariosIncluidos: 5,
    invitarColaboradores: true,
    analiticasLectura: true,
  },
};

export const permisosPlan = (plan: PlanId | null | undefined): Permisos =>
  TABLA[plan ?? "starter"] ?? TABLA.starter;

export const NOMBRE_APP = "Voyara";
