import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "@/App";

/**
 * Monta la app completa en una ruta, con un QueryClient nuevo por test (sin
 * caché compartida entre tests) y sin reintentos: con el reintento de la app,
 * los tests de error esperarían el segundo intento y serían lentos e inestables.
 * Devuelve también un userEvent ya configurado.
 */
export function renderApp(route = "/") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const user = userEvent.setup();

  const view = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );

  return { user, queryClient, ...view };
}
