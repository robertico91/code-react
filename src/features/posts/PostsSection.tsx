import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { NewPostForm } from "./NewPostForm";
import { PostList } from "./PostList";
import type { PostDraft } from "./validatePost";

/**
 * Título "Publicaciones", botón "Nueva publicación" que despliega el formulario
 * y la lista. El formulario está plegado por defecto: así no le quita sitio a la
 * lista mientras no se usa.
 */
export function PostsSection({ userId }: { userId: number }) {
  const [formOpen, setFormOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Al cerrar el formulario, el foco vuelve al botón que lo abrió (si no, se
  // perdería: el formulario que lo tenía desaparece).
  useEffect(() => {
    if (wasOpen.current && !formOpen) openButtonRef.current?.focus();
    wasOpen.current = formOpen;
  }, [formOpen]);

  // El envío a la API se conecta en el siguiente paso; de momento, validar y cerrar.
  async function createPost(_draft: PostDraft) {
    setFormOpen(false);
  }

  return (
    // Escritorio: ficha, título, formulario y paginación fijos; solo la lista hace scroll.
    <section
      aria-labelledby="posts-heading"
      className="mt-8 md:flex md:min-h-0 md:flex-1 md:flex-col"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 id="posts-heading" className="text-lg font-semibold">
          Publicaciones
        </h3>
        {!formOpen && (
          <Button ref={openButtonRef} onClick={() => setFormOpen(true)} className="gap-1.5">
            <PlusIcon />
            Nueva publicación
          </Button>
        )}
      </div>

      {formOpen && (
        <div className="mb-4 md:shrink-0">
          <NewPostForm onSubmit={createPost} onCancel={() => setFormOpen(false)} />
        </div>
      )}

      <PostList userId={userId} />
    </section>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
