import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { viajeDemo, type Viaje } from "@/lib/trip";

export type ViajeResumen = { id: string; titulo: string; updated_at: string; publico: boolean };

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
  const [sucio, setSucio] = useState(false);
  const saltarSucio = useRef(true);

  const cargarLista = useCallback(async () => {
    const { data } = await supabase
      .from("viajes")
      .select("id, titulo, updated_at, publico")
      .order("updated_at", { ascending: false });
    return (data ?? []) as ViajeResumen[];
  }, []);

  const abrir = useCallback(async (id: string) => {
    const { data } = await supabase.from("viajes").select("datos").eq("id", id).maybeSingle();
    saltarSucio.current = true;
    setSeleccion(id);
    setViaje({ ...viajeDemo, ...((data?.datos as Partial<Viaje>) ?? {}) });
    setSucio(false);
  }, []);

  const crear = useCallback(
    async (base: Viaje = viajeDemo): Promise<{ ok: boolean; limite?: boolean }> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return { ok: false };
      const { data, error } = await supabase
        .from("viajes")
        .insert({ agencia_id: user.id, titulo: base.titulo, datos: base as never })
        .select("id, titulo, updated_at, publico")
        .single();
      if (error) {
        return { ok: false, limite: error.message.includes("LIMITE_ITINERARIOS") };
      }
      if (!data) return { ok: false };
      setLista((actual) => [data as ViajeResumen, ...actual]);
      saltarSucio.current = true;
      setSeleccion(data.id);
      setViaje(base);
      setSucio(false);
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

  useEffect(() => {
    if (!viaje || !seleccion) return;
    if (saltarSucio.current) {
      saltarSucio.current = false;
      return;
    }
    setSucio(true);
  }, [viaje, seleccion]);

  /** Guardado explícito en la base de datos. Devuelve true si se guardó. */
  const guardar = useCallback(async (): Promise<boolean> => {
    if (!viaje || !seleccion) return false;
    setGuardando(true);
    const { error } = await supabase
      .from("viajes")
      .update({ titulo: viaje.titulo, datos: viaje as never })
      .eq("id", seleccion);
    setGuardando(false);
    if (error) return false;
    setLista((actual) =>
      actual.map((v) => (v.id === seleccion ? { ...v, titulo: viaje.titulo } : v)),
    );
    setSucio(false);
    return true;
  }, [viaje, seleccion]);

  /** Activa o desactiva el enlace público del viaje seleccionado. */
  const cambiarPublico = useCallback(
    async (id: string, publico: boolean): Promise<boolean> => {
      const { error } = await supabase.from("viajes").update({ publico }).eq("id", id);
      if (error) return false;
      setLista((actual) => actual.map((v) => (v.id === id ? { ...v, publico } : v)));
      return true;
    },
    [],
  );

  const actual = lista.find((v) => v.id === seleccion) ?? null;

  return {
    lista,
    seleccion,
    viaje,
    actual,
    cargando,
    guardando,
    sucio,
    abrir,
    crear,
    borrar,
    actualizar,
    guardar,
    cambiarPublico,
  };
}
