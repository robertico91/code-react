export interface Page<T> {
  items: T[];
  /** Página efectiva (1-based), ya ajustada al rango válido. */
  page: number;
  totalPages: number;
  /** Posición (1-based) del primer y último elemento mostrados, para "6–10 de 10". */
  from: number;
  to: number;
}

/**
 * Corta una lista en páginas. Una página fuera de rango o que no es un entero
 * (?page=99, ?page=abc) se ajusta a la más cercana válida en lugar de mostrar
 * una página vacía.
 */
export function paginate<T>(items: readonly T[], requestedPage: number, pageSize: number): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Number.isInteger(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    items: pageItems,
    page,
    totalPages,
    from: pageItems.length > 0 ? start + 1 : 0,
    to: start + pageItems.length,
  };
}
