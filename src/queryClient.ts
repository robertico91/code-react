import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Un solo reintento: con los 3 por defecto (y su espera exponencial) el
        // error tarda varios segundos en verse, y el usuario ya tiene "Reintentar".
        retry: 1,
        // Los datos de JSONPlaceholder no cambian; no hace falta recargarlos al
        // volver a la pestaña.
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}
