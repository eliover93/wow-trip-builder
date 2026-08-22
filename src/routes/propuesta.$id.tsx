import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { VistaPropuesta } from "@/components/vista-propuesta";
import { obtenerPropuestaPublica } from "@/lib/propuestas.functions";
import { viajeDemo, type Viaje } from "@/lib/trip";

const propuestaQuery = (id: string) =>
  queryOptions({
    queryKey: ["propuesta", id],
    queryFn: () => obtenerPropuestaPublica({ data: { id } }),
    staleTime: 0,
  });

export const Route = createFileRoute("/propuesta/$id")({
  loader: async ({ context, params }) => {
    const propuesta = await context.queryClient.ensureQueryData(propuestaQuery(params.id));
    if (!propuesta) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Tu propuesta de viaje | Voyara" },
      {
        name: "description",
        content:
          "Consulta tu itinerario día a día, las experiencias reservadas y el presupuesto detallado de tu viaje.",
      },
      { property: "og:title", content: "Tu propuesta de viaje" },
      {
        property: "og:description",
        content: "Itinerario, experiencias y presupuesto de tu viaje a medida.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropuestaPublica,
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <p role="alert" className="text-muted-foreground">
        No hemos podido cargar la propuesta. {error.message}
      </p>
    </main>
  ),
  notFoundComponent: () => (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-3xl">Propuesta no disponible</h1>
        <p className="mt-3 text-muted-foreground">
          Este enlace ya no está compartido. Pide uno nuevo a tu agencia.
        </p>
      </div>
    </main>
  ),
});

function PropuestaPublica() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(propuestaQuery(id));
  if (!data) return null;
  const viaje: Viaje = { ...viajeDemo, ...data.datos, titulo: data.datos.titulo ?? data.titulo };
  return <VistaPropuesta viaje={viaje} agencia={data.agencia} />;
}
