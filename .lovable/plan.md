# Guardado real de viajes y propuesta pública por enlace

## Problema actual (verificado)

- El backoffice edita el viaje en memoria y lo guarda con un autoguardado silencioso (`src/hooks/use-viajes.ts`): si el `UPDATE` falla, no se avisa ni se reintenta, y no hay botón explícito ni confirmación.
- No existe ninguna tabla `proposals` / `itineraries`: los viajes viven en la tabla `viajes` (`titulo` + `datos` en JSON). Se mantiene esa tabla.
- `/demo` no lee la base de datos: usa `useViaje`, que guarda en el navegador (localStorage).
- No existe la ruta de propuesta del cliente por id.
- Las notificaciones (Toast) no están montadas en la app.

## Qué se va a construir

### 1. Guardado explícito y fiable en el backoffice
- Botón visible **“Guardar cambios”** en la cabecera del editor, con estado de carga y deshabilitado cuando no hay cambios pendientes.
- Indicador de estado: “Cambios sin guardar” / “Guardando…” / “Guardado hace un momento”.
- Toast verde de éxito y toast rojo con el motivo si el guardado falla (antes fallaba en silencio).
- Se mantiene el autoguardado como red de seguridad, pero ahora también informa de errores.
- Todos los campos del formulario (título, subtítulo, cliente, destino, fechas, viajeros, noches, presupuesto y el itinerario día a día con sus actividades) quedan incluidos en el mismo guardado.
- Aviso al salir de la página si quedan cambios sin guardar.

### 2. Vista del cliente por enlace: `/propuesta/$id`
- Nueva ruta pública que carga el viaje desde la base de datos según el id, sin login.
- Misma presentación visual que la demo actual (portada, itinerario animado, presupuesto, pie con marca según el plan de la agencia).
- Datos de la agencia (logo, teléfono, web, plan) leídos junto al viaje para aplicar la marca blanca.
- Metadatos propios (título/descripción/preview) generados con el título y destino del viaje.
- Estados de carga, error y “propuesta no encontrada”.
- En el backoffice: botón **“Ver / Copiar enlace del cliente”** por cada viaje.

### 3. La demo apunta a un viaje real
- `/demo` pasa a cargar una propuesta real guardada en la base de datos (el viaje de Japón se inserta como fila de demostración) y redirige internamente a la misma vista que `/propuesta/$id`.
- Se retira el estado en localStorage (`use-viaje`) como fuente de datos.

## Detalles técnicos

- Migración:
  - `alter table public.viajes add column publico boolean not null default true;`
  - Política `SELECT to anon, authenticated using (publico)` + `grant select on public.viajes to anon`, para que el enlace funcione sin sesión. Se mantiene la política de gestión del propietario.
  - Lectura pública mínima de `agencias` (nombre, logo, teléfono, web, plan) mediante una vista o política `to anon` restringida a esas columnas, necesaria para el pie de la propuesta.
  - Fila de demostración insertada en la migración (agencia demo + viaje “Japón Esencial”) con id fijo para `/demo`.
- Lectura pública desde una `createServerFn` sin autenticación (cliente publicable, sin sesión), consumida por el loader de `/propuesta/$id` con TanStack Query (`ensureQueryData` + `useSuspenseQuery`), de modo que al recargar siempre se ven los datos actuales.
- Guardado en el backoffice mediante mutación con `useMutation` sobre el cliente autenticado (RLS por agencia), con invalidación de la lista de viajes.
- `<Toaster />` de sonner montado una sola vez en `src/routes/__root.tsx`.

## Nota

Cualquier persona con el enlace podrá ver la propuesta (así lo has pedido). El campo `publico` deja preparado un interruptor para despublicar un viaje si más adelante lo quieres.
