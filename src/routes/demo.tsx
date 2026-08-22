import { createFileRoute } from "@tanstack/react-router";
import { useViaje } from "@/hooks/use-viaje";
import { useAgencia } from "@/hooks/use-agencia";
import { VistaPropuesta } from "@/components/vista-propuesta";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Japón Esencial · Tu viaje con Atlas Viajes" },
      {
        name: "description",
        content:
          "Itinerario día a día, experiencias reservadas y presupuesto detallado de un viaje a Japón presentado con Voyara.",
      },
      { property: "og:title", content: "Japón Esencial · Tu viaje a medida" },
      {
        property: "og:description",
        content: "Descubre tu itinerario día a día con mapas, fotos y presupuesto transparente.",
      },
    ],
  }),
  component: DemoViaje,
});

function DemoViaje() {
  const { viaje } = useViaje();
  const { agencia } = useAgencia();
  return <VistaPropuesta viaje={viaje} agencia={agencia} mostrarEnlaceBackoffice />;
}
