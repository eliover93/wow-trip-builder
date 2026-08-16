import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso agencias · Voyara" },
      {
        name: "description",
        content:
          "Entra en tu cuenta de agencia o crea una nueva para gestionar tus viajes y propuestas en Voyara.",
      },
      { property: "og:title", content: "Acceso para agencias de viaje | Voyara" },
      {
        property: "og:description",
        content: "Cada agencia tiene su cuenta privada con sus propios viajes y clientes.",
      },
    ],
  }),
  component: PaginaAuth,
});

const esquemaEntrar = z.object({
  email: z.string().trim().email("Introduce un email válido").max(255),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(72),
});

const esquemaRegistro = esquemaEntrar.extend({
  nombreAgencia: z.string().trim().min(2, "Indica el nombre de la agencia").max(100),
  telefono: z.string().trim().max(40).optional().or(z.literal("")),
  web: z.string().trim().max(200).optional().or(z.literal("")),
});

function PaginaAuth() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"entrar" | "registro">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreAgencia, setNombreAgencia] = useState("");
  const [telefono, setTelefono] = useState("");
  const [web, setWeb] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/backoffice", replace: true });
    });
  }, [navigate]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAviso(null);

    if (modo === "entrar") {
      const validado = esquemaEntrar.safeParse({ email, password });
      if (!validado.success) return setError(validado.error.issues[0]?.message ?? "Datos no válidos");
      setEnviando(true);
      const { error: errorEntrar } = await supabase.auth.signInWithPassword(validado.data);
      setEnviando(false);
      if (errorEntrar) {
        setError(
          errorEntrar.message === "Invalid login credentials"
            ? "Email o contraseña incorrectos"
            : errorEntrar.message === "Email not confirmed"
              ? "Confirma tu email antes de entrar"
              : errorEntrar.message,
        );
        return;
      }
      navigate({ to: "/backoffice", replace: true });
      return;
    }

    const validado = esquemaRegistro.safeParse({ email, password, nombreAgencia, telefono, web });
    if (!validado.success) return setError(validado.error.issues[0]?.message ?? "Datos no válidos");
    setEnviando(true);
    const { error: errorRegistro } = await supabase.auth.signUp({
      email: validado.data.email,
      password: validado.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/backoffice`,
        data: {
          nombre_agencia: validado.data.nombreAgencia,
          telefono: validado.data.telefono ?? "",
          web: validado.data.web ?? "",
        },
      },
    });
    setEnviando(false);
    if (errorRegistro) {
      setError(
        errorRegistro.message === "User already registered"
          ? "Ya existe una cuenta con ese email"
          : errorRegistro.message,
      );
      return;
    }
    setAviso("Te hemos enviado un email de confirmación. Ábrelo para activar la cuenta.");
  };

  return (
    <main className="mx-auto flex min-h-screen w-[min(520px,92vw)] flex-col justify-center pb-20 pt-32">
      <p className="text-xs uppercase tracking-[0.35em] text-primary">Acceso agencias</p>
      <h1 className="mt-3 text-4xl">
        {modo === "entrar" ? "Entra en tu cuenta" : "Crea tu cuenta de agencia"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Cada agencia gestiona sus propios viajes en un espacio privado.
      </p>

      <form onSubmit={enviar} className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6">
        {modo === "registro" && (
          <>
            <Campo etiqueta="Nombre de la agencia" valor={nombreAgencia} onChange={setNombreAgencia} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Teléfono de contacto" valor={telefono} onChange={setTelefono} />
              <Campo etiqueta="Web" valor={web} onChange={setWeb} />
            </div>
          </>
        )}
        <Campo etiqueta="Email" tipo="email" valor={email} onChange={setEmail} />
        <Campo etiqueta="Contraseña" tipo="password" valor={password} onChange={setPassword} />

        {error && <p className="text-sm text-destructive">{error}</p>}
        {aviso && (
          <p className="flex items-start gap-2 rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" /> {aviso}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {enviando && <Loader2 className="size-4 animate-spin" />}
          {modo === "entrar" ? "Entrar" : "Crear cuenta"}
        </button>

        <button
          type="button"
          onClick={() => {
            setModo(modo === "entrar" ? "registro" : "entrar");
            setError(null);
            setAviso(null);
          }}
          className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {modo === "entrar"
            ? "¿Aún no tienes cuenta? Regístrate"
            : "Ya tengo cuenta · Iniciar sesión"}
        </button>
      </form>
    </main>
  );
}

function Campo({
  etiqueta,
  valor,
  onChange,
  tipo = "text",
}: {
  etiqueta: string;
  valor: string;
  onChange: (v: string) => void;
  tipo?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {etiqueta}
      </span>
      <input
        type={tipo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}
