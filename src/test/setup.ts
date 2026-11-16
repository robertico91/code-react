import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import "./jsdomPolyfills";
import { server } from "./server";

// Cualquier petición sin handler hace fallar el test (en MSW 3 la opción se llama
// onUnhandledFrame, antes onUnhandledRequest): así no se cuela ninguna
// llamada real a la API ni un endpoint olvidado.
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());
