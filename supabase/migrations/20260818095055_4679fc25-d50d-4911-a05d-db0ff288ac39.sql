CREATE TYPE public.plan_type AS ENUM ('starter','pro','team');
CREATE TYPE public.billing_cycle AS ENUM ('monthly','yearly');

CREATE TABLE public.planes (
  id public.plan_type PRIMARY KEY,
  nombre text NOT NULL,
  precio_mensual numeric(10,2) NOT NULL,
  precio_anual numeric(10,2) NOT NULL,
  limite_itinerarios integer,
  marca_blanca boolean NOT NULL DEFAULT false,
  dominio_personalizado boolean NOT NULL DEFAULT false,
  usuarios_incluidos integer NOT NULL DEFAULT 1,
  analiticas_lectura boolean NOT NULL DEFAULT false,
  orden integer NOT NULL DEFAULT 0
);

GRANT SELECT ON public.planes TO anon;
GRANT SELECT ON public.planes TO authenticated;
GRANT ALL ON public.planes TO service_role;

ALTER TABLE public.planes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Planes visibles para todos" ON public.planes FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.planes (id, nombre, precio_mensual, precio_anual, limite_itinerarios, marca_blanca, dominio_personalizado, usuarios_incluidos, analiticas_lectura, orden) VALUES
  ('starter','Starter',29,279,10,false,false,1,false,1),
  ('pro','Pro',59,569,NULL,true,true,1,false,2),
  ('team','Team',99,949,NULL,true,true,5,true,3);

ALTER TABLE public.agencias
  ADD COLUMN plan_type public.plan_type NOT NULL DEFAULT 'starter',
  ADD COLUMN billing_cycle public.billing_cycle NOT NULL DEFAULT 'monthly',
  ADD COLUMN itineraries_created_this_month integer NOT NULL DEFAULT 0,
  ADD COLUMN contador_mes date NOT NULL DEFAULT date_trunc('month', now())::date;

CREATE OR REPLACE FUNCTION public.contar_itinerario()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  mes_actual date := date_trunc('month', now())::date;
  fila public.agencias%ROWTYPE;
  limite integer;
  usados integer;
BEGIN
  SELECT * INTO fila FROM public.agencias WHERE id = NEW.agencia_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  usados := CASE WHEN fila.contador_mes < mes_actual THEN 0 ELSE fila.itineraries_created_this_month END;

  SELECT p.limite_itinerarios INTO limite FROM public.planes p WHERE p.id = fila.plan_type;

  IF limite IS NOT NULL AND usados >= limite THEN
    RAISE EXCEPTION 'LIMITE_ITINERARIOS: has alcanzado el limite de % itinerarios de tu plan', limite
      USING ERRCODE = 'check_violation';
  END IF;

  UPDATE public.agencias
    SET itineraries_created_this_month = usados + 1,
        contador_mes = mes_actual
  WHERE id = fila.id;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.contar_itinerario() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER viajes_contar_itinerario
BEFORE INSERT ON public.viajes
FOR EACH ROW EXECUTE FUNCTION public.contar_itinerario();