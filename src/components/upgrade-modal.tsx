import { Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PLANES, type PlanId } from "@/lib/planes";

type Props = {
  abierto: boolean;
  onOpenChange: (v: boolean) => void;
  planActual: PlanId;
  usados: number;
  onElegir: (plan: PlanId) => void;
};

/** Modal que aparece cuando el plan Starter agota sus itinerarios del mes. */
export function UpgradeModal({ abierto, onOpenChange, planActual, usados, onElegir }: Props) {
  const mejoras = PLANES.filter((p) => p.id !== "starter");

  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="size-5 text-primary" />
            Has alcanzado el límite de tu plan
          </DialogTitle>
          <DialogDescription>
            Tu plan {planActual === "starter" ? "Starter" : planActual} incluye 10 itinerarios al
            mes y ya has creado {usados}. Mejora tu plan para seguir creando propuestas sin límites.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          {mejoras.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {plan.nombre}
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {plan.precioMensual}€
                <span className="text-sm font-normal text-muted-foreground">/mes</span>
              </p>
              <p className="text-xs text-muted-foreground">o {plan.precioAnual}€ al año</p>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.ventajas.map((v) => (
                  <li key={v} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-5 w-full" onClick={() => onElegir(plan.id)}>
                Cambiar a {plan.nombre}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
