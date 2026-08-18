import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CicloFacturacion, PlanId } from "@/lib/planes";

export type Agencia = {
  id: string;
  nombre: string;
  logo_url: string | null;
  telefono: string | null;
  web: string | null;
  plan_type: PlanId;
  billing_cycle: CicloFacturacion;
  itineraries_created_this_month: number;
  contador_mes: string;
};

const CAMPOS =
  "id, nombre, logo_url, telefono, web, plan_type, billing_cycle, itineraries_created_this_month, contador_mes";

const mesActual = () => {
  const hoy = new Date();
  return `${hoy.getUTCFullYear()}-${String(hoy.getUTCMonth() + 1).padStart(2, "0")}-01`;
};

/** Ficha de la agencia conectada (una fila por cuenta, protegida por RLS). */
export function useAgencia() {
  const [agencia, setAgencia] = useState<Agencia | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return null;
    const { data } = await supabase.from("agencias").select(CAMPOS).eq("id", user.id).maybeSingle();
    return (
      (data as Agencia | null) ?? {
        id: user.id,
        nombre: "Mi agencia",
        logo_url: null,
        telefono: null,
        web: null,
        plan_type: "starter" as PlanId,
        billing_cycle: "monthly" as CicloFacturacion,
        itineraries_created_this_month: 0,
        contador_mes: mesActual(),
      }
    );
  }, []);

  useEffect(() => {
    let activo = true;
    (async () => {
      const fila = await cargar();
      if (!activo) return;
      setAgencia(fila);
      setCargando(false);
    })();
    return () => {
      activo = false;
    };
  }, [cargar]);

  const refrescar = useCallback(async () => {
    const fila = await cargar();
    if (fila) setAgencia(fila);
  }, [cargar]);

  const actualizar = useCallback(
    async (cambios: Partial<Omit<Agencia, "id">>) => {
      if (!agencia) return;
      const siguiente = { ...agencia, ...cambios };
      setAgencia(siguiente);
      await supabase.from("agencias").upsert({
        id: siguiente.id,
        nombre: siguiente.nombre,
        logo_url: siguiente.logo_url,
        telefono: siguiente.telefono,
        web: siguiente.web,
        plan_type: siguiente.plan_type,
        billing_cycle: siguiente.billing_cycle,
      });
    },
    [agencia],
  );

  /** Itinerarios consumidos en el mes en curso (0 si el contador es de un mes anterior). */
  const usadosEsteMes =
    agencia && agencia.contador_mes >= mesActual() ? agencia.itineraries_created_this_month : 0;

  return { agencia, actualizar, refrescar, cargando, usadosEsteMes };
}
