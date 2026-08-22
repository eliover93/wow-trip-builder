import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Viaje } from "@/lib/trip";
import type { PlanId } from "@/lib/planes";

export type PropuestaPublica = {
  id: string;
  titulo: string;
  datos: Partial<Viaje>;
  agencia: {
    nombre: string;
    logo_url: string | null;
    telefono: string | null;
    web: string | null;
    plan_type: PlanId;
  } | null;
};

/** Lee un viaje compartido por enlace (solo si está marcado como público). */
export const obtenerPropuestaPublica = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => ({ id: String(data.id) }))
  .handler(async ({ data }): Promise<PropuestaPublica | null> => {
    const url = process.env["SUPABASE_URL"]!;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { data: viaje } = await supabase
      .from("viajes")
      .select("id, titulo, datos, agencia_id")
      .eq("id", data.id)
      .eq("publico", true)
      .maybeSingle();

    if (!viaje) return null;

    const { data: agencia } = await supabase
      .from("agencias")
      .select("nombre, logo_url, telefono, web, plan_type")
      .eq("id", (viaje as { agencia_id: string }).agencia_id)
      .maybeSingle();

    const fila = viaje as { id: string; titulo: string; datos: unknown };
    return {
      id: fila.id,
      titulo: fila.titulo,
      datos: (fila.datos ?? {}) as Partial<Viaje>,
      agencia: (agencia as PropuestaPublica["agencia"]) ?? null,
    };
  });
