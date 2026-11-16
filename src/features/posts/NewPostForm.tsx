import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/Button";
import { TextAreaField, TextField } from "@/components/Field";
import { hasErrors, validatePost, type PostDraft, type PostErrors } from "./validatePost";

interface NewPostFormProps {
  /** Recibe el borrador ya recortado. Si la promesa falla, se conserva lo escrito. */
  onSubmit: (draft: PostDraft) => Promise<void>;
  onCancel: () => void;
}

/**
 * Formulario controlado a mano: son dos campos obligatorios, así que no hace
 * falta react-hook-form ni zod. La validación es una función pura (validatePost).
 *
 * - Se valida al enviar; después del primer intento, también al escribir, para
 *   que el error desaparezca en cuanto se corrige (y no salga mientras uno
 *   escribe por primera vez).
 * - Al enviar con errores, el foco va al primer campo inválido.
 * - Mientras se envía no se puede editar ni volver a enviar (sin doble envío).
 *   Se usa readOnly y aria-disabled en lugar de disabled: deshabilitar el
 *   elemento que tiene el foco lo manda al <body> y el lector de pantalla se pierde.
 */
export function NewPostForm({ onSubmit, onCancel }: NewPostFormProps) {
  const [draft, setDraft] = useState<PostDraft>({ title: "", body: "" });
  const [errors, setErrors] = useState<PostErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Al abrir el formulario se empieza a escribir directamente en el título.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function updateField(field: keyof PostDraft, value: string) {
    const next = { ...draft, [field]: value };
    setDraft(next);
    if (attempted) setErrors(validatePost(next));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setAttempted(true);
    const nextErrors = validatePost(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      (nextErrors.title ? titleRef : bodyRef).current?.focus();
      return;
    }

    setPending(true);
    try {
      await onSubmit({ title: draft.title.trim(), body: draft.body.trim() });
    } finally {
      setPending(false);
    }
  }

  function cancel() {
    if (!pending) onCancel();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Escape") cancel();
  }

  return (
    <form
      noValidate
      aria-labelledby="new-post-heading"
      onSubmit={(event) => void handleSubmit(event)}
      onKeyDown={handleKeyDown}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h4 id="new-post-heading" className="font-semibold text-slate-900">
        Nueva publicación
      </h4>

      <TextField
        ref={titleRef}
        id="new-post-title"
        label="Título"
        value={draft.title}
        onChange={(value) => updateField("title", value)}
        error={errors.title}
        readOnly={pending}
      />
      <TextAreaField
        ref={bodyRef}
        id="new-post-body"
        label="Texto"
        value={draft.body}
        onChange={(value) => updateField("body", value)}
        error={errors.body}
        readOnly={pending}
      />

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={cancel} aria-disabled={pending}>
          Cancelar
        </Button>
        <Button type="submit" aria-disabled={pending}>
          {pending ? "Publicando…" : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
