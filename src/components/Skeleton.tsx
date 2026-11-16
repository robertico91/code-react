import type { ReactNode } from "react";

interface SkeletonProps {
  /** Lo que se anuncia a lectores de pantalla, p. ej. "Cargando usuarios…". */
  label: string;
  /** Clases de layout de la silueta (debe ocupar el mismo hueco que el contenido real). */
  className?: string;
  /** La silueta del contenido; es decorativa. */
  children: ReactNode;
}

/**
 * Skeleton accesible: la silueta va oculta a lectores de pantalla y la carga se
 * anuncia con un role="status" visualmente oculto. Al ser sr-only (posición
 * absoluta) no ocupa sitio ni cuenta para el gap del contenedor.
 */
export function Skeleton({ label, className = "", children }: SkeletonProps) {
  return (
    <>
      <p role="status" className="sr-only">
        {label}
      </p>
      <div aria-hidden="true" className={className}>
        {children}
      </div>
    </>
  );
}

/** Barra gris con pulso; el pulso solo si el usuario no pidió reducir el movimiento. */
export function SkeletonBar({ className }: { className: string }) {
  return <span className={`block rounded bg-slate-200 motion-safe:animate-pulse ${className}`} />;
}
