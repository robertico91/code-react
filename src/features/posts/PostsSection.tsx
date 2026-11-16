import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/Button";
import { SidePanel } from "@/components/SidePanel";
import { NewPostForm } from "./NewPostForm";
import { PostList } from "./PostList";
import { useCreatePost } from "./useCreatePost";
import type { PostDraft } from "./validatePost";

interface PostsSectionProps {
  userId: number;
  userName: string;
}

/** Cuánto se ve el aviso "Publicación creada" antes de desaparecer. */
const NOTICE_MS = 4000;

/**
 * Título "Publicaciones", botón "Nueva publicación" y la lista. El formulario se
 * abre en un panel lateral derecho (donde se suelen esperar los formularios en
 * panel): en escritorio deja a la vista la lista de usuarios mientras se escribe,
 * y no le quita sitio a la lista de publicaciones cuando no se usa.
 */
export function PostsSection({ userId, userName }: PostsSectionProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [, setSearchParams] = useSearchParams();
  const createPost = useCreatePost(userId);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), NOTICE_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  function openForm() {
    createPost.reset(); // sin el error de un intento anterior
    setFormOpen(true);
  }

  async function submit(draft: PostDraft) {
    try {
      await createPost.mutateAsync(draft);
    } catch {
      // El error queda en createPost.error y el formulario lo muestra; el panel
      // sigue abierto con lo escrito.
      return;
    }
    setFormOpen(false);
    setNotice("Publicación creada.");
    // La nueva va la primera: se vuelve a la página 1 para que se vea.
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete("page");
      return next;
    });
  }

  return (
    // Escritorio: ficha, título y paginación fijos; solo la lista hace scroll.
    <section
      aria-labelledby="posts-heading"
      className="mt-8 md:flex md:min-h-0 md:flex-1 md:flex-col"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 id="posts-heading" className="text-lg font-semibold">
          Publicaciones
        </h3>
        <Button onClick={openForm} aria-haspopup="dialog" className="gap-1.5">
          <PlusIcon />
          Nueva publicación
        </Button>
      </div>

      {/* Región viva siempre montada (si se montara con el texto, no se anunciaría). */}
      <div role="status" className="md:shrink-0">
        {notice && (
          <p className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <CheckIcon />
            {notice}
          </p>
        )}
      </div>

      <PostList userId={userId} />

      <SidePanel
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Nueva publicación"
        description={`Para ${userName}`}
        locked={createPost.isPending}
      >
        <NewPostForm
          onSubmit={submit}
          onCancel={() => setFormOpen(false)}
          pending={createPost.isPending}
          submitError={createPost.error}
        />
      </SidePanel>
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
