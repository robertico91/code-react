import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { TextAreaField, TextField } from "@/components/Field";
import { hasErrors, validatePost, type PostDraft, type PostErrors } from "./validatePost";

interface NewPostFormProps {
  /** Recibe el borrador ya recortado. Si la promesa falla, se conserva lo escrito. */
  onSubmit: (draft: PostDraft) => Promise<void>;
  onCancel: () => void;
  /** Envío en curso (lo controla quien envía, para bloquear también el panel). */
  pending: boolean;
}

/**
 * Formulario controlado a mano: son dos campos obligatorios, así que no hace
 * falta react-hook-form ni zod. La validación es una función pura (validatePost).
 * Vive dentro de un SidePanel, que pone el título, el foco inicial y Escape.
 *
 * - Se valida al enviar; después del primer intento, también al escribir, para
 *   que el error desaparezca en cuanto se corrige (y no salga mientras uno
 *   escribe por primera vez).
 * - Al enviar con errores, el foco va al primer campo inválido.
 * - Mientras se envía no se puede editar ni volver a enviar (sin doble envío).
 *   Se usa readOnly y aria-disabled en lugar de disabled: deshabilitar el
 *   elemento que tiene el foco lo manda al <body> y el lector de pantalla se pierde.
 */
export function NewPostForm({ onSubmit, onCancel, pending }: NewPostFormProps) {
  const [draft, setDraft] = useState<PostDraft>({ title: "", body: "" });
  const [errors, setErrors] = useState<PostErrors>({});
  const [attempted, setAttempted] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

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

    await onSubmit({ title: draft.title.trim(), body: draft.body.trim() });
  }

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <TextField
          ref={titleRef}
          id="new-post-title"
          label="Título"
          value={draft.title}
          onChange={(value) => updateField("title", value)}
          error={errors.title}
          readOnly={pending}
          autoFocusOnOpen
        />
        <TextAreaField
          ref={bodyRef}
          id="new-post-body"
          label="Texto"
          rows={8}
          value={draft.body}
          onChange={(value) => updateField("body", value)}
          error={errors.body}
          readOnly={pending}
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
        <Button variant="secondary" onClick={() => !pending && onCancel()} aria-disabled={pending}>
          Cancelar
        </Button>
        <Button type="submit" aria-disabled={pending}>
          {pending ? "Publicando…" : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
