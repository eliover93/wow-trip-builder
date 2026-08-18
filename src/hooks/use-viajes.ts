import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { viajeDemo, type Viaje } from "@/lib/trip";

export type ViajeResumen = { id: string; titulo: string; updated_at: string };

/**
 * Viajes de la agencia conectada. Cada fila pertenece a una cuenta y las
 * políticas de acceso impiden ver los viajes de otras agencias.
 */
export function useViajes() {
  const [lista, setLista] = useState<ViajeResumen[]>([]);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const saltarGuardado = useRef(true);

  const cargarLista = useCallback(async () => {
    const { data } = await supabase
      .from("viajes")
      .select("id, titulo, updated_at")
      .order("updated_at", { ascending: false });
    return data ?? [];
  }, []);

  const abrir = useCallback(async (id: string) => {
    const { data } = await supabase.from("viajes").select("datos").eq("id", id).maybeSingle();
    saltarGuardado.current = true;
    setSeleccion(id);
    setViaje({ ...viajeDemo, ...((data?.datos as Partial<Viaje>) ?? {}) });
  }, []);

  const crear = useCallback(
    async (base: Viaje = viajeDemo): Promise<{ ok: boolean; limite?: boolean }> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return { ok: false };
      const { data, error } = await supabase
        .from("viajes")
        .insert({ agencia_id: user.id, titulo: base.titulo, datos: base as never })
        .select("id, titulo, updated_at")
        .single();
      if (error) {
        return { ok: false, limite: error.message.includes("LIMITE_ITINERARIOS") };
      }
      if (!data) return { ok: false };
      setLista((actual) => [data, ...actual]);
      saltarGuardado.current = true;
      setSeleccion(data.id);
      setViaje(base);
      return { ok: true };
    },
    [],
  );


  const borrar = useCallback(
    async (id: string) => {
      await supabase.from("viajes").delete().eq("id", id);
      const restantes = lista.filter((v) => v.id !== id);
      setLista(restantes);
      if (seleccion === id) {
        const siguiente = restantes[0];
        if (siguiente) await abrir(siguiente.id);
        else {
          setSeleccion(null);
          setViaje(null);
        }
      }
    },
    [lista, seleccion, abrir],
  );

  useEffect(() => {
    let activo = true;
    (async () => {
      const filas = await cargarLista();
      if (!activo) return;
      setLista(filas);
      if (filas.length > 0 && filas[0]) await abrir(filas[0].id);
      if (activo) setCargando(false);
    })();
    return () => {
      activo = false;
    };
  }, [cargarLista, abrir]);

  const actualizar = useCallback((cambios: Partial<Viaje>) => {
    setViaje((actual) => (actual ? { ...actual, ...cambios } : actual));
  }, []);

  // Guardado automático con pequeño retardo.
  useEffect(() => {
    if (!viaje || !seleccion) return;
    if (saltarGuardado.current) {
      saltarGuardado.current = false;
      return;
    }
    setGuardando(true);
    const t = setTimeout(async () => {
      await supabase
        .from("viajes")
        .update({ titulo: viaje.titulo, datos: viaje as never })
        .eq("id", seleccion);
      setLista((actual) =>
        actual.map((v) => (v.id === seleccion ? { ...v, titulo: viaje.titulo } : v)),
      );
      setGuardando(false);
    }, 700);
    return () => clearTimeout(t);
  }, [viaje, seleccion]);

  return { lista, seleccion, viaje, cargando, guardando, abrir, crear, borrar, actualizar };
}
