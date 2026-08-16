CREATE TABLE public.agencias (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL DEFAULT 'Mi agencia',
  logo_url TEXT,
  telefono TEXT,
  web TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agencias TO authenticated;
GRANT ALL ON public.agencias TO service_role;
ALTER TABLE public.agencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agencia ve su ficha" ON public.agencias FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Agencia crea su ficha" ON public.agencias FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Agencia edita su ficha" ON public.agencias FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.viajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agencia_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL DEFAULT 'Nuevo viaje',
  datos JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX viajes_agencia_id_idx ON public.viajes (agencia_id, updated_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.viajes TO authenticated;
GRANT ALL ON public.viajes TO service_role;
ALTER TABLE public.viajes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agencia gestiona sus viajes" ON public.viajes FOR ALL TO authenticated USING (auth.uid() = agencia_id) WITH CHECK (auth.uid() = agencia_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER agencias_updated_at BEFORE UPDATE ON public.agencias FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER viajes_updated_at BEFORE UPDATE ON public.viajes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.agencias (id, nombre, telefono, web)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'nombre_agencia', ''), 'Mi agencia'),
    NULLIF(NEW.raw_user_meta_data ->> 'telefono', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'web', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();