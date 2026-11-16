import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { createQueryClient } from "./queryClient";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No se encontró el elemento #root");

const queryClient = createQueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* El router va aquí y no dentro de App, para que los tests monten App con un MemoryRouter. */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
