import { useEffect } from "react";

const APP_NAME = "Usuarios y publicaciones";

/**
 * Título de la pestaña según la pantalla ("Leanne Graham · Usuarios y
 * publicaciones"). En una SPA el título no cambia solo al navegar, y es lo
 * primero que anuncia un lector de pantalla y lo que se ve en el historial.
 */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  }, [title]);
}
