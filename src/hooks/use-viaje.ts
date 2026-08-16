import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEY, viajeDemo, type Viaje } from "@/lib/trip";

/**
 * Estado del viaje compartido entre el backoffice y el front del cliente.
 * Se guarda en el navegador para que la demo sea editable sin backend.
 */
export function useViaje() {
  const [viaje, setViaje] = useState<Viaje>(viajeDemo);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(STORAGE_KEY);
      if (guardado) setViaje({ ...viajeDemo, ...JSON.parse(guardado) });
    } catch {
      /* datos corruptos: usamos la demo */
    }
    setCargado(true);
  }, []);

  const actualizar = useCallback((cambios: Partial<Viaje>) => {
    setViaje((actual) => {
      const siguiente = { ...actual, ...cambios };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(siguiente));
      } catch {
        /* almacenamiento no disponible */
      }
      return siguiente;
    });
  }, []);

  const reiniciar = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setViaje(viajeDemo);
  }, []);

  return { viaje, actualizar, reiniciar, cargado };
}
