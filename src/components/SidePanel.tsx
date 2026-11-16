import { useEffect, useId, useRef, type ReactNode } from "react";

interface SidePanelProps {
  open: boolean;
  /** Se llama al pedir cerrar: botón ×, Escape o clic en el fondo. */
  onClose: () => void;
  title: string;
  description?: string;
  /** Mientras es true, el panel no se puede cerrar (p. ej. durante un envío). */
  locked?: boolean;
  children: ReactNode;
}

/**
 * Panel lateral izquierdo modal, hecho con <dialog> + showModal(). El navegador
 * ya da lo difícil: el foco no sale del panel, el fondo queda inerte (ni clic ni
 * Tab ni lector de pantalla), Escape cierra y, al cerrar, el foco vuelve al
 * elemento que lo abrió.
 *
 * Al abrir, el foco va al elemento marcado con data-autofocus (si no hay, el
 * navegador elige el primero enfocable). El contenido solo se monta mientras
 * está abierto, así cada apertura empieza de cero.
 */
export function SidePanel({
  open,
  onClose,
  title,
  description,
  locked = false,
  children,
}: SidePanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function requestClose() {
    if (!locked) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Escape dispara "cancel": lo gestionamos nosotros para respetar `locked`
      // y mantener el estado de React como única fuente de verdad.
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      // Un clic en el fondo llega al propio <dialog> (el contenido ocupa todo el
      // panel, así que un clic dentro nunca tiene como destino el dialog).
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      className="fixed inset-y-0 right-auto left-0 m-0 h-dvh max-h-none w-full max-w-md bg-white p-0 shadow-2xl transition-transform duration-200 ease-out backdrop:bg-slate-900/40 backdrop:backdrop-blur-[2px] motion-reduce:transition-none starting:open:-translate-x-full"
    >
      {open && (
        <div className="flex h-full flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-semibold text-slate-900">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-0.5 truncate text-sm text-slate-500">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={requestClose}
              aria-label="Cerrar"
              aria-disabled={locked}
              className="-m-1 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none aria-disabled:opacity-40"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden="true"
                className="size-5"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}
