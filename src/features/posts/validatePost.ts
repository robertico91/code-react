export interface PostDraft {
  title: string;
  body: string;
}

export type PostErrors = Partial<Record<keyof PostDraft, string>>;

/**
 * Título y texto obligatorios. Se recortan los espacios: un campo con solo
 * espacios cuenta como vacío. Devuelve un objeto vacío si todo es válido.
 */
export function validatePost({ title, body }: PostDraft): PostErrors {
  const errors: PostErrors = {};
  if (!title.trim()) errors.title = "El título es obligatorio.";
  if (!body.trim()) errors.body = "El texto es obligatorio.";
  return errors;
}

export function hasErrors(errors: PostErrors): boolean {
  return Object.keys(errors).length > 0;
}
