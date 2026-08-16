import heroJapon from "@/assets/hero-japon.jpg";
import diaTokio from "@/assets/dia-tokio.jpg";
import diaKioto from "@/assets/dia-kioto.jpg";
import diaFuji from "@/assets/dia-fuji.jpg";
import diaOsaka from "@/assets/dia-osaka.jpg";

export type Actividad = {
  hora: string;
  titulo: string;
  descripcion: string;
  tipo: "vuelo" | "hotel" | "experiencia" | "comida" | "traslado";
};

export type Dia = {
  id: string;
  fecha: string;
  ciudad: string;
  titulo: string;
  resumen: string;
  imagen: string;
  actividades: Actividad[];
};

export type LineaPresupuesto = {
  concepto: string;
  importe: number;
  incluido: boolean;
};

export type Viaje = {
  agencia: string;
  cliente: string;
  titulo: string;
  subtitulo: string;
  destino: string;
  fechas: string;
  viajeros: number;
  noches: number;
  heroImagen: string;
  moneda: string;
  presupuesto: LineaPresupuesto[];
  dias: Dia[];
};

export const viajeDemo: Viaje = {
  agencia: "Atlas Viajes",
  cliente: "Familia Serrano",
  titulo: "Japón Esencial",
  subtitulo: "Doce días entre templos, neones y montañas sagradas",
  destino: "Tokio · Hakone · Kioto · Osaka",
  fechas: "12 – 23 de octubre de 2026",
  viajeros: 4,
  noches: 11,
  heroImagen: heroJapon,
  moneda: "€",
  presupuesto: [
    { concepto: "Vuelos Madrid – Tokio / Osaka – Madrid", importe: 3480, incluido: true },
    { concepto: "Hoteles 4* y ryokan con onsen privado", importe: 5240, incluido: true },
    { concepto: "Japan Rail Pass 7 días (4 pax)", importe: 1180, incluido: true },
    { concepto: "Experiencias privadas y guías", importe: 1960, incluido: true },
    { concepto: "Seguro de viaje premium", importe: 340, incluido: true },
    { concepto: "Comidas no indicadas y gastos personales", importe: 0, incluido: false },
  ],
  dias: [
    {
      id: "d1",
      fecha: "Día 1 · 12 oct",
      ciudad: "Tokio",
      titulo: "Aterrizaje en el futuro",
      resumen:
        "Llegada a Haneda, traslado privado al hotel en Shibuya y primera noche entre neones y ramen.",
      imagen: diaTokio,
      actividades: [
        {
          hora: "06:40",
          titulo: "Vuelo directo Madrid – Tokio Haneda",
          descripcion: "Clase turista premium, equipaje 23 kg incluido.",
          tipo: "vuelo",
        },
        {
          hora: "16:20",
          titulo: "Traslado privado al hotel",
          descripcion: "Conductor con cartel de bienvenida y asistencia en español.",
          tipo: "traslado",
        },
        {
          hora: "18:00",
          titulo: "Check-in Cerulean Tower, Shibuya",
          descripcion: "Habitaciones superiores con vistas a la ciudad.",
          tipo: "hotel",
        },
        {
          hora: "20:30",
          titulo: "Paseo nocturno por el cruce de Shibuya",
          descripcion: "Ruta a pie con guía local y cena de ramen en un izakaya escondido.",
          tipo: "experiencia",
        },
      ],
    },
    {
      id: "d2",
      fecha: "Día 4 · 15 oct",
      ciudad: "Hakone",
      titulo: "El Fuji al amanecer",
      resumen:
        "Ryokan tradicional con onsen privado frente al monte Fuji y cena kaiseki de once pasos.",
      imagen: diaFuji,
      actividades: [
        {
          hora: "09:10",
          titulo: "Tren Romancecar a Hakone",
          descripcion: "Asientos panorámicos reservados en primera fila.",
          tipo: "traslado",
        },
        {
          hora: "12:00",
          titulo: "Crucero por el lago Ashi",
          descripcion: "Vistas al torii flotante de Hakone-jinja.",
          tipo: "experiencia",
        },
        {
          hora: "15:00",
          titulo: "Check-in ryokan Gora Kadan",
          descripcion: "Suite con onsen privado en la terraza.",
          tipo: "hotel",
        },
        {
          hora: "19:30",
          titulo: "Cena kaiseki de temporada",
          descripcion: "Once pasos con producto de otoño y sake maridado.",
          tipo: "comida",
        },
      ],
    },
    {
      id: "d3",
      fecha: "Día 7 · 18 oct",
      ciudad: "Kioto",
      titulo: "Bambú y geishas",
      resumen:
        "Arashiyama a primera hora sin multitudes, ceremonia del té y paseo al atardecer por Gion.",
      imagen: diaKioto,
      actividades: [
        {
          hora: "07:00",
          titulo: "Bosque de bambú de Arashiyama",
          descripcion: "Acceso temprano con fotógrafo privado durante 60 minutos.",
          tipo: "experiencia",
        },
        {
          hora: "11:00",
          titulo: "Ceremonia del té en una machiya",
          descripcion: "Casa de té del siglo XIX con maestra certificada.",
          tipo: "experiencia",
        },
        {
          hora: "14:00",
          titulo: "Almuerzo shojin ryori",
          descripcion: "Cocina vegetariana de los monjes budistas.",
          tipo: "comida",
        },
        {
          hora: "18:00",
          titulo: "Gion al anochecer",
          descripcion: "Ruta guiada por los callejones de las maiko.",
          tipo: "experiencia",
        },
      ],
    },
    {
      id: "d4",
      fecha: "Día 10 · 21 oct",
      ciudad: "Osaka",
      titulo: "Kuidaore: comer hasta caer",
      resumen: "Mercado de Kuromon, taller de takoyaki y ruta nocturna de street food en Dotonbori.",
      imagen: diaOsaka,
      actividades: [
        {
          hora: "10:00",
          titulo: "Mercado Kuromon con chef local",
          descripcion: "Degustación de siete paradas históricas.",
          tipo: "comida",
        },
        {
          hora: "13:30",
          titulo: "Taller de takoyaki",
          descripcion: "Cocina en familia con delantal de recuerdo.",
          tipo: "experiencia",
        },
        {
          hora: "20:00",
          titulo: "Dotonbori de noche",
          descripcion: "Ruta de bares con guía y crucero por el canal.",
          tipo: "experiencia",
        },
      ],
    },
  ],
};

export const STORAGE_KEY = "voyara:viaje";

export function totalPresupuesto(viaje: Viaje) {
  return viaje.presupuesto.filter((l) => l.incluido).reduce((a, l) => a + l.importe, 0);
}

export function formatoMoneda(valor: number, moneda = "€") {
  return `${valor.toLocaleString("es-ES")} ${moneda}`;
}
