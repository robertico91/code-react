export const API_BASE_URL = "https://jsonplaceholder.typicode.com";

/**
 * Error de la API con el código HTTP. `status` es 0 cuando ni siquiera hubo
 * respuesta (sin conexión, DNS, CORS…).
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST";
  /** Se serializa a JSON. */
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * `fetch` con JSON y errores tipados. `fetch` no falla con un 4xx/5xx, así que
 * se comprueba `res.ok` a mano. Las cancelaciones (AbortError) se relanzan tal
 * cual para que TanStack Query las trate como cancelaciones y no como errores.
 *
 * No hay validación en tiempo de ejecución de la respuesta: se confía en el
 * contrato de la API (ver "Qué haría con más tiempo" en el README).
 */
export async function fetchJson<T>(
  path: string,
  { method = "GET", body, signal }: RequestOptions = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal: signal ?? null,
      ...(body !== undefined && {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError("No se pudo conectar con el servidor. Revisa tu conexión.", 0);
  }

  if (!res.ok) {
    throw new ApiError(`La petición falló (${res.status}).`, res.status);
  }

  const data: T = await res.json();
  return data;
}
