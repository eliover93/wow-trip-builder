ALTER TABLE public.viajes ADD COLUMN IF NOT EXISTS publico boolean NOT NULL DEFAULT false;

GRANT SELECT ON public.viajes TO anon;

DROP POLICY IF EXISTS "Viajes publicos visibles por enlace" ON public.viajes;
CREATE POLICY "Viajes publicos visibles por enlace"
ON public.viajes FOR SELECT
TO anon, authenticated
USING (publico = true);

CREATE OR REPLACE VIEW public.agencias_publicas AS
SELECT id, nombre, logo_url, telefono, web, plan_type
FROM public.agencias;

GRANT SELECT ON public.agencias_publicas TO anon, authenticated;