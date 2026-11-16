import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ToastContext, type Toast, type ToastApi, type ToastKind } from "./toastContext";

/** Lo que dura una confirmación en pantalla (sin ratón ni foco encima). */
const SUCCESS_MS = 4000;

/**
 * Estado de los toasts y su visor.
 *
 * Accesibilidad: las confirmaciones van a una región aria-live="polite" que
 * está siempre montada (si se montara junto con el texto, no se anunciaría);
 * los errores llevan role="alert", que se anuncia al insertarse.
 *
 * Panel modal abierto: un <dialog> con showModal() vive en la capa superior y
 * deja inerte el resto de la página, así que un toast fuera de él quedaría
 * detrás del fondo, sin poder cerrarse y sin anunciarse. Por eso los errores
 * (que llegan con el panel abierto) se pintan dentro del dialog abierto, si lo hay.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((kind: ToastKind, title: string, description?: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, kind, title, description }]);
    return id;
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, description) => push("success", title, description),
      error: (title, description) => push("error", title, description),
      dismiss,
    }),
    [push, dismiss],
  );

  const successes = toasts.filter((toast) => toast.kind === "success");
  const errors = toasts.filter((toast) => toast.kind === "error");
  // Se lee al pintar: los errores se crean con el panel ya abierto (ver arriba).
  const openDialog =
    typeof document === "undefined" ? null : document.querySelector("dialog[open]");

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div aria-live="polite" className={VIEWPORT_CLASSES}>
        {successes.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>

      {errors.length > 0 &&
        createPortal(
          <div className={openDialog ? IN_PANEL_VIEWPORT_CLASSES : VIEWPORT_CLASSES}>
            {errors.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
          </div>,
          openDialog ?? document.body,
        )}
    </ToastContext.Provider>
  );
}

const VIEWPORT_CLASSES =
  "pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:w-96";

/**
 * Dentro del panel lateral (que está a la derecha), abajo a la derecha el toast
 * taparía "Cancelar" y "Publicar": en escritorio va abajo a la izquierda, fuera
 * del panel; en móvil, donde el panel ocupa la pantalla, arriba.
 */
const IN_PANEL_VIEWPORT_CLASSES =
  "pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col items-start gap-2 sm:top-auto sm:right-auto sm:bottom-4 sm:w-96";

const KIND_CLASSES: Record<ToastKind, string> = {
  success: "border-emerald-200 text-emerald-900",
  error: "border-red-200 text-red-900",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false);

  // Las confirmaciones se cierran solas; con el ratón o el foco encima se pausan
  // (hay que poder leerlas). Los errores no se cierran solos.
  useEffect(() => {
    if (toast.kind !== "success" || paused) return;
    const timer = setTimeout(() => onDismiss(toast.id), SUCCESS_MS);
    return () => clearTimeout(timer);
  }, [toast, paused, onDismiss]);

  return (
    <div
      role={toast.kind === "error" ? "alert" : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-xl border bg-white p-4 shadow-lg transition duration-200 ease-out motion-reduce:transition-none starting:translate-y-2 starting:opacity-0 ${KIND_CLASSES[toast.kind]}`}
    >
      {toast.kind === "success" ? <SuccessIcon /> : <ErrorIcon />}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-sm text-slate-600">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        className="-m-1 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
          className="size-4"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function SuccessIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3.5"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

function ErrorIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        className="size-3.5"
      >
        <path d="M12 7v6M12 17h.01" />
      </svg>
    </span>
  );
}
