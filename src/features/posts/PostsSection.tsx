import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { ApiError } from "@/api/client";
import { Button } from "@/components/Button";
import { SidePanel } from "@/components/SidePanel";
import { useToast } from "@/components/toast/useToast";
import { NewPostForm } from "./NewPostForm";
import { PostList } from "./PostList";
import { useCreatePost } from "./useCreatePost";
import type { PostDraft } from "./validatePost";

interface PostsSectionProps {
  userId: number;
  userName: string;
}

/**
 * Título "Publicaciones", botón "Nueva publicación" y la lista. El formulario se
 * abre en un panel lateral derecho (donde se suelen esperar los formularios en
 * panel): en escritorio deja a la vista la lista de usuarios mientras se escribe,
 * y no le quita sitio a la lista de publicaciones cuando no se usa.
 */
export function PostsSection({ userId, userName }: PostsSectionProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();
  const createPost = useCreatePost(userId);
  const toast = useToast();
  const errorToastId = useRef<number | null>(null);

  // Un error de envío solo tiene sentido mientras el panel sigue abierto: se
  // retira al reintentar y al cerrar el panel.
  function dismissErrorToast() {
    if (errorToastId.current !== null) toast.dismiss(errorToastId.current);
    errorToastId.current = null;
  }

  function closeForm() {
    dismissErrorToast();
    setFormOpen(false);
  }

  async function submit(draft: PostDraft) {
    dismissErrorToast();
    try {
      await createPost.mutateAsync(draft);
    } catch (error) {
      // El panel sigue abierto con lo escrito; el toast de error se pinta dentro
      // del panel (ver ToastProvider) para que se vea y se anuncie.
      errorToastId.current = toast.error(
        "No se pudo publicar",
        error instanceof ApiError
          ? `${error.message} Lo que has escrito sigue en el formulario.`
          : "Inténtalo de nuevo. Lo que has escrito sigue en el formulario.",
      );
      return;
    }
    setFormOpen(false);
    toast.success("Publicación creada", `Se ha añadido a las publicaciones de ${userName}.`);
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
        <Button onClick={() => setFormOpen(true)} aria-haspopup="dialog" className="gap-1.5">
          <PlusIcon />
          Nueva publicación
        </Button>
      </div>

      <PostList userId={userId} />

      <SidePanel
        open={formOpen}
        onClose={closeForm}
        title="Nueva publicación"
        description={`Para ${userName}`}
        locked={createPost.isPending}
      >
        <NewPostForm onSubmit={submit} onCancel={closeForm} pending={createPost.isPending} />
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
