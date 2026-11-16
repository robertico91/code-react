import { useState } from "react";
import { Button } from "@/components/Button";
import { SidePanel } from "@/components/SidePanel";
import { NewPostForm } from "./NewPostForm";
import { PostList } from "./PostList";
import type { PostDraft } from "./validatePost";

interface PostsSectionProps {
  userId: number;
  userName: string;
}

/**
 * Título "Publicaciones", botón "Nueva publicación" y la lista. El formulario se
 * abre en un panel lateral izquierdo: en escritorio tapa la columna de usuarios
 * mientras se escribe, pero deja a la vista la ficha del usuario para el que se
 * publica; y no le quita sitio a la lista cuando no se usa.
 */
export function PostsSection({ userId, userName }: PostsSectionProps) {
  const [formOpen, setFormOpen] = useState(false);
  // El envío a la API (y su estado "pending") se conecta en el siguiente paso;
  // de momento, un envío válido cierra el panel.
  const pending = false;

  async function createPost(_draft: PostDraft) {
    setFormOpen(false);
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
        <Button onClick={() => setFormOpen(true)} aria-haspopup="dialog" className="gap-1.5">
          <PlusIcon />
          Nueva publicación
        </Button>
      </div>

      <PostList userId={userId} />

      <SidePanel
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Nueva publicación"
        description={`Para ${userName}`}
        locked={pending}
      >
        <NewPostForm onSubmit={createPost} onCancel={() => setFormOpen(false)} pending={pending} />
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
