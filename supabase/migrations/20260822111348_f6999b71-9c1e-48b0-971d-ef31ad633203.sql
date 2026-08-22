DROP VIEW IF EXISTS public.agencias_publicas;

GRANT SELECT (id, nombre, logo_url, telefono, web, plan_type) ON public.agencias TO anon;
GRANT SELECT (id, nombre, logo_url, telefono, web, plan_type) ON public.agencias TO authenticated;

DROP POLICY IF EXISTS "Agencia visible si tiene viajes publicos" ON public.agencias;
CREATE POLICY "Agencia visible si tiene viajes publicos"
ON public.agencias FOR SELECT
TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.viajes v WHERE v.agencia_id = agencias.id AND v.publico = true));