import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  LayoutDashboard,
  Palette,
  Wallet,
  Share2,
  Globe2,
  ArrowRight,
} from "lucide-react";
import heroMediterraneo from "@/assets/hero-mediterraneo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Voyara · Propuestas de viaje con efecto wow para agencias" },
      {
        name: "description",
        content:
          "Software para agencias de viaje: crea paquetes dinámicos con itinerario día a día, presupuesto y animaciones que cierran ventas.",
      },
      { property: "og:title", content: "Voyara · Propuestas de viaje con efecto wow" },
      {
        property: "og:description",
        content:
          "Backoffice sencillo para la agencia y una propuesta espectacular para el cliente final.",
      },
    ],
  }),
  component: Landing,
});

const caracteristicas = [
  {
    icono: LayoutDashboard,
    titulo: "Backoffice sin curva de aprendizaje",
    texto:
      "Formularios claros: datos del viaje, itinerario día a día, actividades y presupuesto. Sin manuales.",
  },
  {
    icono: Sparkles,
    titulo: "Presentación con efecto wow",
    texto:
      "Parallax, transiciones al scroll y fotografía a pantalla completa. El cliente se enamora antes de leer el precio.",
  },
  {
    icono: Wallet,
    titulo: "Presupuestos transparentes",
    texto: "Desglose por conceptos, incluido/no incluido, total y precio por persona automático.",
  },
  {
    icono: Palette,
    titulo: "Marca blanca por agencia",
    texto: "Colores, logo y tipografía de cada agencia. El mismo motor, mil identidades.",
  },
  {
    icono: Share2,
    titulo: "Comparte con un enlace",
    texto: "Cada propuesta vive en su URL: se abre en el móvil del cliente sin instalar nada.",
  },
  {
    icono: Globe2,
    titulo: "Reutilizable y escalable",
    texto: "Duplica un viaje, cambia cuatro campos y tienes una propuesta nueva en minutos.",
  },
];

const pasos = [
  { n: "01", t: "Rellena el viaje", d: "La agencia carga destino, días, actividades y precios." },
  { n: "02", t: "Voyara lo monta", d: "Se genera la propuesta animada, responsive y con mapa." },
  { n: "03", t: "El cliente dice sí", d: "Comparte el enlace y recibe la confirmación." },
];

function Landing() {
  return (
    <main>
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src={heroMediterraneo}
          alt="Playa mediterránea con mar turquesa presentada con Voyara"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 hero-veil" />
        <div className="absolute inset-x-0 bottom-0 h-40 hero-fade" />
        <div className="relative z-10 mx-auto flex min-h-[92vh] w-[min(1120px,92vw)] flex-col justify-center pt-24">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="on-image text-xs font-semibold uppercase tracking-[0.35em]"
          >
            Software para agencias de viaje
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="on-image mt-5 max-w-4xl text-5xl leading-[1.04] md:text-7xl"
          >
            Convierte tus itinerarios en <span className="on-image-accent">experiencias</span>{" "}
            que se venden solas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="on-image-muted mt-6 max-w-xl text-lg"
          >
            Voyara genera paquetes de viaje dinámicos y visuales a partir de un formulario simple.
            Tu equipo rellena, tu cliente alucina.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              to="/demo"
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Ver demo de cliente <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/backoffice"
              className="rounded-xl border border-background/60 bg-background/90 px-6 py-3.5 font-medium text-foreground backdrop-blur transition-colors hover:bg-background"
            >
              Probar el backoffice
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-[min(1120px,92vw)] py-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["3 min", "para montar una propuesta completa"],
            ["+38 %", "de conversión frente al PDF de siempre"],
            ["100 %", "adaptable a la marca de cada agencia"],
          ].map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-surface p-7"
            >
              <p className="text-4xl text-gradient-gold">{k}</p>
              <p className="mt-2 text-sm text-muted-foreground">{v}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/40 py-24">
        <div className="mx-auto w-[min(1120px,92vw)]">
          <h2 className="max-w-2xl text-4xl md:text-5xl">
            Un producto, dos caras: la agencia trabaja rápido y el cliente se emociona
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {caracteristicas.map((c, i) => (
              <motion.article
                key={c.titulo}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
                className="group rounded-2xl border border-border bg-background p-7 transition-colors hover:border-primary/50"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-110">
                  <c.icono className="size-5" />
                </span>
                <h3 className="mt-5 text-xl">{c.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.texto}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1120px,92vw)] py-24">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Cómo funciona</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pasos.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="rounded-2xl border border-border p-7"
            >
              <span className="font-display text-5xl text-muted-foreground/70">{p.n}</span>
              <h3 className="mt-4 text-2xl">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="contacto" className="mx-auto w-[min(1120px,92vw)] scroll-mt-28 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-primary/30 bg-surface p-10 text-center glow md:p-16"
        >
          <h2 className="mx-auto max-w-2xl text-4xl md:text-5xl">
            Enseña la demo a tu próximo cliente esta misma semana
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Licencia por agencia, marca blanca incluida y propuestas ilimitadas. Cuéntanos cómo
            trabajáis y lo adaptamos.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="tu@agencia.com"
              className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.03]">
              Solicitar demo
            </button>
          </form>
        </motion.div>
      </section>
    </main>
  );
}
