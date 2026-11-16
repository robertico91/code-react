import type { ReactNode } from "react";
import { Link } from "react-router";
import { Skeleton, SkeletonBlock } from "@/components/Skeleton";
import { EmptyMessage, ErrorMessage } from "@/components/StatusMessage";
import { PostsSection } from "@/features/posts/PostsSection";
import { UserProfile } from "./UserProfile";
import { useUserId } from "./useUserId";
import { useUsers } from "./useUsers";

/**
 * Detalle del usuario elegido: su ficha y sus publicaciones. La ficha reutiliza
 * la lista ya cargada (misma query y caché que la columna de usuarios), así que
 * elegir un usuario solo pide sus publicaciones.
 */
export function UserDetail() {
  const userId = useUserId();
  const { data: users, isPending, isError, error, refetch } = useUsers();

  let content: ReactNode;
  if (isPending) {
    content = <UserProfileSkeleton />;
  } else if (isError) {
    content = (
      <ErrorMessage
        title="No se pudo cargar el usuario."
        error={error}
        onRetry={() => void refetch()}
      />
    );
  } else {
    const user = userId === null ? undefined : users.find((u) => u.id === userId);
    content = user ? (
      <>
        <UserProfile user={user} />
        {/* key: al cambiar de usuario se monta de cero (lista, página y formulario) y
            no arrastra estado del anterior. */}
        <PostsSection key={user.id} userId={user.id} userName={user.name} />
      </>
    ) : (
      <EmptyMessage>Usuario no encontrado.</EmptyMessage>
    );
  }

  return (
    <div className="md:flex md:min-h-0 md:flex-1 md:flex-col">
      {/* En móvil la lista y el detalle no se ven a la vez: hace falta volver. */}
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark focus-visible:rounded focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none md:hidden"
      >
        <span aria-hidden="true">‹</span> Usuarios
      </Link>
      {content}
    </div>
  );
}

function UserProfileSkeleton() {
  return (
    <Skeleton label="Cargando usuario…" className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="size-14 shrink-0 rounded-full" />
        <div>
          <div className="flex h-7 items-center">
            <SkeletonBlock className="h-5 w-48 rounded" />
          </div>
          <div className="flex h-5 items-center">
            <SkeletonBlock className="h-3 w-24 rounded" />
          </div>
        </div>
      </div>
    </Skeleton>
  );
}
