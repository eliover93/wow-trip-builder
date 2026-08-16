import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Plus, RotateCcw, Trash2, Eye } from "lucide-react";
import { useViaje } from "@/hooks/use-viaje";
import { formatoMoneda, totalPresupuesto, type Actividad, type Dia } from "@/lib/trip";

export const Route = createFileRoute("/backoffice")({
  head: () => ({
    meta: [
      { title: "Backoffice · Crea el viaje en minutos | Voyara" },
      {
        name: "description",
        content:
          "Panel para agencias: rellena datos del viaje, itinerario día a día y presupuesto, y publícalo al instante.",
      },
      { property: "og:title", content: "Backoffice de Voyara para agencias de viaje" },
      {
        property: "og:description",
        content: "Rellena el viaje con un formulario claro y publica una propuesta con efecto wow.",
      },
    ],
  }),
  component: Backoffice,
});

function Backoffice() {
  const { viaje, actualizar, reiniciar, cargado } = useViaje();
  const total = totalPresupuesto(viaje);

  const editarDia = (id: string, cambios: Partial<Dia>) =>
    actualizar({ dias: viaje.dias.map((d) => (d.id === id ? { ...d, ...cambios } : d)) });

  const editarActividad = (idDia: string, indice: number, cambios: Partial<Actividad>) =>
    actualizar({
      dias: viaje.dias.map((d) =>
        d.id === idDia
          ? {
              ...d,
              actividades: d.actividades.map((a, i) => (i === indice ? { ...a, ...cambios } : a)),
            }
          : d,
      ),
    });

  const añadirActividad = (idDia: string) =>
    actualizar({
      dias: viaje.dias.map((d) =>
        d.id === idDia
          ? {
              ...d,
              actividades: [
                ...d.actividades,
                {
                  hora: "12:00",
                  titulo: "Nueva actividad",
                  descripcion: "Describe la experiencia",
                  tipo: "experiencia",
                },
              ],
            }
          : d,
      ),
    });

  const borrarActividad = (idDia: string, indice: number) =>
    actualizar({
      dias: viaje.dias.map((d) =>
        d.id === idDia ? { ...d, actividades: d.actividades.filter((_, i) => i !== indice) } : d,
      ),
    });

  const añadirDia = () =>
    actualizar({
      dias: [
        ...viaje.dias,
        {
          id: `d${Date.now()}`,
          fecha: `Día ${viaje.dias.length + 1}`,
          ciudad: "Ciudad",
          titulo: "Nuevo día",
          resumen: "Resumen de la jornada",
          imagen: viaje.heroImagen,
          actividades: [],
        },
      ],
    });

  const editarLinea = (indice: number, cambios: Partial<(typeof viaje.presupuesto)[number]>) =>
    actualizar({
      presupuesto: viaje.presupuesto.map((l, i) => (i === indice ? { ...l, ...cambios } : l)),
    });

  if (!cargado) return <div className="min-h-screen" />;

  return (
    <main className="mx-auto w-[min(1180px,92vw)] pb-28 pt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Backoffice</p>
          <h1 className="mt-3 text-4xl">Editor de viaje</h1>
          <p className="mt-2 text-muted-foreground">
            Rellena los campos y todo se refleja al instante en la propuesta del cliente.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={reiniciar}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm transition-colors hover:bg-secondary"
          >
            <RotateCcw className="size-4" /> Restaurar demo
          </button>
          <Link
            to="/demo"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <Eye className="size-4" /> Ver propuesta
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Tarjeta titulo="Datos generales">
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo
                etiqueta="Agencia"
                valor={viaje.agencia}
                onChange={(v) => actualizar({ agencia: v })}
              />
              <Campo
                etiqueta="Cliente"
                valor={viaje.cliente}
                onChange={(v) => actualizar({ cliente: v })}
              />
              <Campo
                etiqueta="Título del viaje"
                valor={viaje.titulo}
                onChange={(v) => actualizar({ titulo: v })}
              />
              <Campo
                etiqueta="Destino"
                valor={viaje.destino}
                onChange={(v) => actualizar({ destino: v })}
              />
              <Campo
                etiqueta="Fechas"
                valor={viaje.fechas}
                onChange={(v) => actualizar({ fechas: v })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Campo
                  etiqueta="Viajeros"
                  tipo="number"
                  valor={String(viaje.viajeros)}
                  onChange={(v) => actualizar({ viajeros: Number(v) || 1 })}
                />
                <Campo
                  etiqueta="Noches"
                  tipo="number"
                  valor={String(viaje.noches)}
                  onChange={(v) => actualizar({ noches: Number(v) || 1 })}
                />
              </div>
              <div className="sm:col-span-2">
                <Campo
                  etiqueta="Subtítulo"
                  valor={viaje.subtitulo}
                  onChange={(v) => actualizar({ subtitulo: v })}
                />
              </div>
            </div>
          </Tarjeta>

          <Tarjeta
            titulo="Itinerario"
            accion={
              <button
                onClick={añadirDia}
                className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs transition-colors hover:bg-surface-2"
              >
                <Plus className="size-3.5" /> Añadir día
              </button>
            }
          >
            <div className="space-y-5">
              {viaje.dias.map((dia) => (
                <motion.div
                  key={dia.id}
                  layout
                  className="rounded-xl border border-border bg-background/40 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Campo
                      etiqueta="Etiqueta de día"
                      valor={dia.fecha}
                      onChange={(v) => editarDia(dia.id, { fecha: v })}
                    />
                    <Campo
                      etiqueta="Ciudad"
                      valor={dia.ciudad}
                      onChange={(v) => editarDia(dia.id, { ciudad: v })}
                    />
                    <Campo
                      etiqueta="Título"
                      valor={dia.titulo}
                      onChange={(v) => editarDia(dia.id, { titulo: v })}
                    />
                  </div>
                  <div className="mt-3">
                    <Campo
                      etiqueta="Resumen"
                      valor={dia.resumen}
                      onChange={(v) => editarDia(dia.id, { resumen: v })}
                    />
                  </div>

                  <p className="mt-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Cosas que hacer
                  </p>
                  <div className="mt-2 space-y-2">
                    {dia.actividades.map((a, i) => (
                      <div key={`${dia.id}-${i}`} className="flex items-start gap-2">
                        <input
                          value={a.hora}
                          onChange={(e) => editarActividad(dia.id, i, { hora: e.target.value })}
                          className="w-20 rounded-lg border border-input bg-background px-2 py-2 text-sm tabular-nums outline-none focus:border-primary"
                        />
                        <select
                          value={a.tipo}
                          onChange={(e) =>
                            editarActividad(dia.id, i, {
                              tipo: e.target.value as Actividad["tipo"],
                            })
                          }
                          className="rounded-lg border border-input bg-background px-2 py-2 text-sm outline-none focus:border-primary"
                        >
                          <option value="vuelo">Vuelo</option>
                          <option value="hotel">Hotel</option>
                          <option value="experiencia">Experiencia</option>
                          <option value="comida">Comida</option>
                          <option value="traslado">Traslado</option>
                        </select>
                        <div className="flex-1 space-y-2">
                          <input
                            value={a.titulo}
                            onChange={(e) => editarActividad(dia.id, i, { titulo: e.target.value })}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                          />
                          <input
                            value={a.descripcion}
                            onChange={(e) =>
                              editarActividad(dia.id, i, { descripcion: e.target.value })
                            }
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground outline-none focus:border-primary"
                          />
                        </div>
                        <button
                          onClick={() => borrarActividad(dia.id, i)}
                          aria-label="Eliminar actividad"
                          className="mt-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => añadirActividad(dia.id)}
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-primary transition-colors hover:bg-secondary"
                    >
                      <Plus className="size-3.5" /> Añadir actividad
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Tarjeta>

          <Tarjeta titulo="Presupuesto">
            <div className="space-y-2">
              {viaje.presupuesto.map((linea, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={linea.concepto}
                    onChange={(e) => editarLinea(i, { concepto: e.target.value })}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    value={linea.importe}
                    onChange={(e) => editarLinea(i, { importe: Number(e.target.value) || 0 })}
                    className="w-28 rounded-lg border border-input bg-background px-3 py-2 text-sm tabular-nums outline-none focus:border-primary"
                  />
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={linea.incluido}
                      onChange={(e) => editarLinea(i, { incluido: e.target.checked })}
                      className="size-4 accent-[var(--primary)]"
                    />
                    Incluido
                  </label>
                </div>
              ))}
              <button
                onClick={() =>
                  actualizar({
                    presupuesto: [
                      ...viaje.presupuesto,
                      { concepto: "Nuevo concepto", importe: 0, incluido: true },
                    ],
                  })
                }
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-primary transition-colors hover:bg-secondary"
              >
                <Plus className="size-3.5" /> Añadir línea
              </button>
            </div>
          </Tarjeta>
        </div>

        <aside className="sticky top-28 h-fit rounded-2xl glass-panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Resumen</p>
          <p className="mt-3 text-3xl text-gradient-gold">{formatoMoneda(total, viaje.moneda)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatoMoneda(Math.round(total / Math.max(viaje.viajeros, 1)), viaje.moneda)} por
            persona
          </p>
          <dl className="mt-6 space-y-2 text-sm">
            <Fila k="Días del itinerario" v={String(viaje.dias.length)} />
            <Fila
              k="Actividades"
              v={String(viaje.dias.reduce((a, d) => a + d.actividades.length, 0))}
            />
            <Fila k="Viajeros" v={String(viaje.viajeros)} />
            <Fila k="Noches" v={String(viaje.noches)} />
          </dl>
          <p className="mt-6 text-xs text-muted-foreground">
            Los cambios se guardan automáticamente en este navegador.
          </p>
        </aside>
      </div>
    </main>
  );
}

function Fila({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border pb-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="tabular-nums">{v}</dd>
    </div>
  );
}

function Tarjeta({
  titulo,
  accion,
  children,
}: {
  titulo: string;
  accion?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl">{titulo}</h2>
        {accion}
      </div>
      {children}
    </section>
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
