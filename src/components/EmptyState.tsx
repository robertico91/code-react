import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  /** Clases extra del contenedor, p. ej. para que ocupe todo el panel. */
  className?: string;
  /** h2 si es lo principal del panel; p si va dentro de una sección que ya tiene título. */
  titleAs?: "h2" | "p";
}

/**
 * Estado vacío "grande": icono en un círculo suave, título y una línea de
 * explicación, centrados. Para huecos con espacio (el panel de detalle); en la
 * columna estrecha de usuarios se usa el EmptyMessage compacto.
 */
export function EmptyState({
  icon,
  title,
  description,
  className = "",
  titleAs: Title = "h2",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center ${className}`}
    >
      <div
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand"
      >
        {icon}
      </div>
      <Title className="mt-4 text-base font-semibold text-slate-900">{title}</Title>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>
    </div>
  );
}

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-6",
} as const;

/** Documento con líneas de texto: "publicaciones". */
export function PostsIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}
