import type { ReactNode, Ref } from "react";

const CONTROL_CLASSES =
  "w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/15 focus-visible:outline-none aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-500/15 read-only:bg-slate-50 read-only:text-slate-500";

interface BaseFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Mensaje de error; si hay, el control se marca con aria-invalid y lo enlaza. */
  error?: string | undefined;
  /** Mientras se envía: no editable, pero sigue enfocable (disabled perdería el foco). */
  readOnly?: boolean;
}

/**
 * Etiqueta visible + control + error. El error se asocia con aria-describedby,
 * así el lector de pantalla lo lee al llegar al campo (el formulario mueve el
 * foco al primer campo con error al enviar).
 */
function FieldShell({
  id,
  label,
  error,
  children,
}: Pick<BaseFieldProps, "id" | "label" | "error"> & { children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-800">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  readOnly = false,
  ref,
}: BaseFieldProps & { ref?: Ref<HTMLInputElement> }) {
  return (
    <FieldShell id={id} label={label} error={error}>
      <input
        ref={ref}
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-10 ${CONTROL_CLASSES}`}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  readOnly = false,
  ref,
}: BaseFieldProps & { ref?: Ref<HTMLTextAreaElement> }) {
  return (
    <FieldShell id={id} label={label} error={error}>
      <textarea
        ref={ref}
        id={id}
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`resize-y py-2 ${CONTROL_CLASSES}`}
      />
    </FieldShell>
  );
}
