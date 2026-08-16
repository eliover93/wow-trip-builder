import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Agencia = {
  id: string;
  nombre: string;
  logo_url: string | null;
  telefono: string | null;
  web: string | null;
};

/** Ficha de la agencia conectada (una fila por cuenta, protegida por RLS). */
export function useAgencia() {
  const [agencia, setAgencia] = useState<Agencia | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        if (activo) setCargando(false);
        return;
      }
      const { data } = await supabase
        .from("agencias")
        .select("id, nombre, logo_url, telefono, web")
        .eq("id", user.id)
        .maybeSingle();
      if (!activo) return;
      setAgencia(data ?? { id: user.id, nombre: "Mi agencia", logo_url: null, telefono: null, web: null });
      setCargando(false);
    })();
    return () => {
      activo = false;
    };
  }, []);

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
      });
    },
    [agencia],
  );

  return { agencia, actualizar, cargando };
}
