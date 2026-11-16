interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Nombre accesible de la navegación, p. ej. "Paginación de publicaciones". */
  label: string;
}

const BUTTON_BASE =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none";

/**
 * Anterior / números / Siguiente. La página actual lleva aria-current="page" y su
 * estilo cuelga de ese atributo. Con pocas páginas (aquí 2-3) se muestran todos
 * los números; con muchas habría que resumir con "…".
 */
export function Pagination({ page, totalPages, onPageChange, label }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label={label} className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
        className={`${BUTTON_BASE} text-slate-600 hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40`}
      >
        <ArrowIcon direction="left" />
      </button>

      {pages.map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onPageChange(number)}
          aria-label={`Página ${number}`}
          aria-current={number === page ? "page" : undefined}
          className={`${BUTTON_BASE} text-slate-700 tabular-nums hover:bg-slate-100 aria-[current=page]:bg-brand aria-[current=page]:text-white aria-[current=page]:hover:bg-brand-dark`}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Página siguiente"
        className={`${BUTTON_BASE} text-slate-600 hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40`}
      >
        <ArrowIcon direction="right" />
      </button>
    </nav>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}
