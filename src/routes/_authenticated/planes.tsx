import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAgencia } from "@/hooks/use-agencia";
import {
  PLANES,
  ahorroAnual,
  ordenPlan,
  precioMostrado,
  type CicloFacturacion,
  type PlanId,
} from "@/lib/planes";
import { OFERTA_FUNDADORES, descuentoFundadores } from "@/lib/oferta-fundadores";
import { BannerFundadores } from "@/components/banner-fundadores";

export const Route = createFileRoute("/_authenticated/planes")({
  head: () => ({
    meta: [
      { title: "Planes y precios de tu agencia | Voyara" },
      {
        name: "description",
        content:
          "Compara los planes Starter, Pro y Team de Voyara, cambia entre pago mensual y anual y mejora el plan de tu agencia.",
      },
      { property: "og:title", content: "Planes y precios | Voyara" },
      {
        property: "og:description",
        content: "Starter, Pro y Team: elige el plan que mejor encaja con tu agencia de viajes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaginaPlanes,
});

function PaginaPlanes() {
  const { agencia, actualizar, cargando, usadosEsteMes } = useAgencia();
  const [anual, setAnual] = useState(false);
  const [procesando, setProcesando] = useState<PlanId | null>(null);
  const ciclo: CicloFacturacion = anual ? "yearly" : "monthly";
  const planActual = agencia?.plan_type ?? "starter";
  const ofertaAplicable = (id: PlanId) =>
    OFERTA_FUNDADORES.activa && id === OFERTA_FUNDADORES.plan && planActual !== OFERTA_FUNDADORES.plan;

  const mejorar = async (id: PlanId) => {
    setProcesando(id);
    // Cuando la pasarela esté conectada, este cupón se aplicará en el checkout.
    const cupon = ofertaAplicable(id) ? OFERTA_FUNDADORES.cupon : null;
    if (cupon) console.info("Cupón aplicado en el checkout:", cupon);
    await actualizar({ plan_type: id, billing_cycle: ciclo });
    setProcesando(null);
  };

  return (
    <main className="mx-auto w-[min(1120px,92vw)] pb-24 pt-32">
      <BannerFundadores />

      <div className="mt-8 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Configuración</p>
        <h1 className="mt-3 text-4xl">Planes y precios</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Elige el plan que acompaña el ritmo de tu agencia. Puedes cambiarlo cuando quieras.
        </p>

        <div className="mt-8 inline-flex items-center gap-4 rounded-full glass-panel px-5 py-3">
          <span className={anual ? "text-sm text-muted-foreground" : "text-sm text-foreground"}>
            Pago mensual
          </span>
          <Switch checked={anual} onCheckedChange={setAnual} aria-label="Cambiar a pago anual" />
          <span className={anual ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>
            Pago anual{" "}
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
              Ahorra un 20%
            </span>
          </span>
        </div>

        {!cargando && (
          <p className="mt-4 text-xs text-muted-foreground">
            Este mes has creado {usadosEsteMes} itinerarios con tu plan actual.
          </p>
        )}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PLANES.map((plan, i) => {
          const esActual = plan.id === planActual;
          const esSuperior = ordenPlan(plan.id) > ordenPlan(planActual);

          return (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`relative flex flex-col rounded-2xl border p-7 ${
                plan.destacado
                  ? "border-primary/60 bg-card shadow-[0_0_60px_-25px_hsl(var(--primary))]"
                  : "border-border bg-card"
              }`}
            >
              {plan.destacado && (
                <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  <Sparkles className="size-3.5" /> Más popular
                </span>
              )}

              {ofertaAplicable(plan.id) && (
                <span className="absolute -top-3 right-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                  {OFERTA_FUNDADORES.etiqueta}
                </span>
              )}

              <h2 className="text-xl">{plan.nombre}</h2>
              <p className="mt-1 min-h-10 text-sm text-muted-foreground">{plan.descripcion}</p>

              {ofertaAplicable(plan.id) ? (
                <>
                  <p className="mt-6 flex items-end gap-2 text-4xl tabular-nums">
                    <span className="text-gradient-gold">
                      {anual
                        ? Math.round(OFERTA_FUNDADORES.precioAnual / 12)
                        : OFERTA_FUNDADORES.precioMensual}
                      €
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {precioMostrado(plan, ciclo)}€
                    </span>
                    <span className="text-sm text-muted-foreground">/mes</span>
                  </p>
                  <p className="mt-1 text-xs text-primary">
                    Precio fundador para siempre · −{descuentoFundadores()}% · cupón{" "}
                    {OFERTA_FUNDADORES.cupon}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-6 text-4xl tabular-nums">
                    {precioMostrado(plan, ciclo)}€
                    <span className="text-sm text-muted-foreground"> /mes</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {anual
                      ? `${plan.precioAnual}€ al año · ahorras un ${ahorroAnual(plan)}%`
                      : `o ${plan.precioAnual}€ al año`}
                  </p>
                </>
              )}

              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {plan.ventajas.map((v) => (
                  <li key={v} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>

              {esActual ? (
                <button
                  disabled
                  className="mt-7 w-full cursor-not-allowed rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground"
                >
                  Tu plan actual
                </button>
              ) : esSuperior ? (
                <button
                  onClick={() => mejorar(plan.id)}
                  disabled={procesando !== null}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {procesando === plan.id && <Loader2 className="size-4 animate-spin" />}
                  {ofertaAplicable(plan.id)
                    ? `Conseguir precio fundador (${OFERTA_FUNDADORES.precioMensual}€/mes)`
                    : "Mejorar a este plan"}
                </button>
              ) : (
                <button
                  onClick={() => mejorar(plan.id)}
                  disabled={procesando !== null}
                  className="mt-7 w-full rounded-xl border border-border px-4 py-2.5 text-sm transition-colors hover:bg-secondary disabled:opacity-60"
                >
                  Cambiar a {plan.nombre}
                </button>
              )}
            </motion.article>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        El cambio de plan se aplica al instante en tu cuenta. El cobro con tarjeta se activará
        cuando conectemos la pasarela de pago.
      </p>
    </main>
  );
}
