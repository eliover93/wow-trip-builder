import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  CalendarDays,
  Users,
  MoonStar,
  MapPin,
  Plane,
  Hotel,
  Sparkles,
  UtensilsCrossed,
  Car,
  Check,
  Minus,
} from "lucide-react";
import { useViaje } from "@/hooks/use-viaje";
import { useAgencia } from "@/hooks/use-agencia";
import { PiePropuesta } from "@/components/pie-propuesta";
import { formatoMoneda, totalPresupuesto, type Actividad, type Dia } from "@/lib/trip";

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

const iconos = {
  vuelo: Plane,
  hotel: Hotel,
  experiencia: Sparkles,
  comida: UtensilsCrossed,
  traslado: Car,
};

function DemoViaje() {
  const { viaje } = useViaje();
  const { agencia } = useAgencia();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacidad = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const total = totalPresupuesto(viaje);

  return (
    <main>
      <section ref={heroRef} className="relative h-[92vh] overflow-hidden">
        <motion.img
          src={viaje.heroImagen}
          alt={`Vista de ${viaje.destino}`}
          width={1920}
          height={1088}
          style={{ y }}
          className="absolute inset-0 size-full scale-110 object-cover"
        />
        <div className="absolute inset-0 hero-veil" />
        <motion.div
          style={{ opacity: opacidad }}
          className="relative z-10 mx-auto flex h-full w-[min(1120px,92vw)] flex-col justify-end pb-20"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="on-image-accent text-xs uppercase tracking-[0.35em]"
          >
            {viaje.agencia} · para {viaje.cliente}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="on-image mt-4 max-w-3xl text-5xl leading-[1.05] md:text-7xl"
          >
            {viaje.titulo}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="on-image-muted mt-5 max-w-xl text-lg"
          >
            {viaje.subtitulo}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Dato icono={CalendarDays} texto={viaje.fechas} />
            <Dato icono={MoonStar} texto={`${viaje.noches} noches`} />
            <Dato icono={Users} texto={`${viaje.viajeros} viajeros`} />
            <Dato icono={MapPin} texto={viaje.destino} />
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto w-[min(1120px,92vw)] py-24">
        <Encabezado
          eyebrow="Itinerario"
          titulo="Qué hacéis cada día"
          texto="Cada jornada con sus horarios, reservas confirmadas y las experiencias que hemos elegido para vosotros."
        />
        <div className="mt-14 space-y-24">
          {viaje.dias.map((dia, i) => (
            <BloqueDia key={dia.id} dia={dia} indice={i} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/40 py-24">
        <div className="mx-auto w-[min(1120px,92vw)]">
          <Encabezado
            eyebrow="Presupuesto"
            titulo="Todo claro, sin sorpresas"
            texto="Desglose completo del viaje. Lo que está incluido y lo que no."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="glass-panel rounded-2xl p-2">
              {viaje.presupuesto.map((linea, i) => (
                <motion.div
                  key={linea.concepto}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 transition-colors hover:bg-secondary/60"
                >
                  <span className="flex items-center gap-3 text-sm">
                    {linea.incluido ? (
                      <Check className="size-4 shrink-0 text-accent" />
                    ) : (
                      <Minus className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={linea.incluido ? "" : "text-muted-foreground"}>
                      {linea.concepto}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">
                    {linea.incluido ? formatoMoneda(linea.importe, viaje.moneda) : "No incluido"}
                  </span>
                </motion.div>
              ))}
            </div>
            <motion.aside
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-fit rounded-2xl border border-primary/30 bg-surface p-8 glow"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Total del viaje
              </p>
              <p className="mt-3 text-5xl text-gradient-gold">
                {formatoMoneda(total, viaje.moneda)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatoMoneda(Math.round(total / viaje.viajeros), viaje.moneda)} por persona ·{" "}
                {viaje.viajeros} viajeros
              </p>
              <div className="mt-8 space-y-3">
                <button className="w-full rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.02]">
                  Confirmar reserva
                </button>
                <button className="w-full rounded-xl border border-border px-5 py-3 text-sm transition-colors hover:bg-secondary">
                  Descargar propuesta en PDF
                </button>
              </div>
            </motion.aside>
          </div>
          <p className="mt-12 text-center text-sm text-muted-foreground">
            ¿Eres agencia?{" "}
            <Link to="/backoffice" className="text-primary underline-offset-4 hover:underline">
              Edita este viaje en el backoffice
            </Link>{" "}
            y vuelve a esta página para ver el resultado.
          </p>
        </div>
      </section>

      <PiePropuesta
        plan={agencia?.plan_type ?? "starter"}
        nombre={agencia?.nombre || viaje.agencia}
        logoUrl={agencia?.logo_url}
        telefono={agencia?.telefono}
        web={agencia?.web}
      />
    </main>
  );
}

function Dato({ icono: Icono, texto }: { icono: typeof MapPin; texto: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full glass-panel px-4 py-2 text-sm">
      <Icono className="size-4 text-primary" />
      {texto}
    </span>
  );
}

function Encabezado({
  eyebrow,
  titulo,
  texto,
}: {
  eyebrow: string;
  titulo: string;
  texto: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 text-4xl md:text-5xl">{titulo}</h2>
      <p className="mt-4 text-muted-foreground">{texto}</p>
    </motion.div>
  );
}

function BloqueDia({ dia, indice }: { dia: Dia; indice: number }) {
  const par = indice % 2 === 1;
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className={`grid items-center gap-10 lg:grid-cols-2 ${par ? "lg:[&>figure]:order-2" : ""}`}
    >
      <figure className="group relative overflow-hidden rounded-3xl">
        <img
          src={dia.imagen}
          alt={dia.titulo}
          loading="lazy"
          width={1280}
          height={960}
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <figcaption className="absolute bottom-4 left-4 rounded-full glass-panel px-4 py-1.5 text-sm">
          {dia.ciudad}
        </figcaption>
      </figure>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent">{dia.fecha}</p>
        <h3 className="mt-3 text-3xl md:text-4xl">{dia.titulo}</h3>
        <p className="mt-3 text-muted-foreground">{dia.resumen}</p>
        <ol className="mt-7 space-y-1">
          {dia.actividades.map((a, i) => (
            <FilaActividad key={a.titulo} actividad={a} retardo={i * 0.08} />
          ))}
        </ol>
      </div>
    </motion.article>
  );
}

function FilaActividad({ actividad, retardo }: { actividad: Actividad; retardo: number }) {
  const Icono = iconos[actividad.tipo];
  return (
    <motion.li
      initial={{ opacity: 0, x: 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: retardo }}
      className="flex gap-4 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-border hover:bg-surface"
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icono className="size-4" />
      </span>
      <div>
        <p className="text-sm font-medium">
          <span className="mr-2 tabular-nums text-accent">{actividad.hora}</span>
          {actividad.titulo}
        </p>
        <p className="text-sm text-muted-foreground">{actividad.descripcion}</p>
      </div>
    </motion.li>
  );
}
