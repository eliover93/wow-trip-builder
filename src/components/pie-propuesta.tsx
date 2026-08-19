import { Globe, Phone } from "lucide-react";
import { NOMBRE_APP, permisosPlan } from "@/lib/permisos";
import type { PlanId } from "@/lib/planes";

type Props = {
  plan: PlanId | null | undefined;
  nombre: string;
  logoUrl?: string | null;
  telefono?: string | null;
  web?: string | null;
};

/**
 * Pie de la propuesta pública.
 * Starter: branding discreto de la app. Pro/Team: marca blanca con datos de la agencia.
 */
export function PiePropuesta({ plan, nombre, logoUrl, telefono, web }: Props) {
  const { marcaBlanca } = permisosPlan(plan);

  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex w-[min(1120px,92vw)] flex-col items-center gap-4 text-center">
        {marcaBlanca && logoUrl ? (
          <img src={logoUrl} alt={nombre} loading="lazy" className="h-10 w-auto object-contain" />
        ) : (
          <p className="text-lg">{nombre}</p>
        )}

        {marcaBlanca && (telefono || web) && (
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
            {telefono && (
              <a href={`tel:${telefono}`} className="flex items-center gap-2 hover:text-foreground">
                <Phone className="size-4 text-primary" />
                {telefono}
              </a>
            )}
            {web && (
              <a
                href={web.startsWith("http") ? web : `https://${web}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Globe className="size-4 text-primary" />
                {web.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        )}

        {!marcaBlanca && (
          <a
            href="/"
            className="text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
          >
            Creado con {NOMBRE_APP}
          </a>
        )}
      </div>
    </footer>
  );
}
