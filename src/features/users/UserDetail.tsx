import type { ReactNode } from "react";
import { Link } from "react-router";
import { EmptyMessage, ErrorMessage } from "@/components/StatusMessage";
import { Skeleton, SkeletonBlock } from "@/components/Skeleton";
import { useUserId } from "./useUserId";
import { useUsers } from "./useUsers";

/**
 * Detalle del usuario elegido. Reutiliza la lista ya cargada (misma query y
 * caché que la columna de usuarios): elegir un usuario no hace otra petición.
 */
export function UserDetail() {
  const userId = useUserId();
  const { data: users, isPending, isError, error, refetch } = useUsers();

  let content: ReactNode;
  if (isPending) {
    content = (
      <Skeleton label="Cargando usuario…">
        <SkeletonBlock className="h-7 w-48 rounded" />
      </Skeleton>
    );
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
        <h2 className="text-xl font-semibold tracking-tight">{user.name}</h2>
        <p className="mt-4 text-sm text-slate-600">Sus publicaciones aparecerán aquí.</p>
      </>
    ) : (
      <EmptyMessage>Usuario no encontrado.</EmptyMessage>
    );
  }

  return (
    <section aria-label="Detalle del usuario">
      {/* En móvil la lista y el detalle no se ven a la vez: hace falta volver. */}
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark focus-visible:rounded focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none md:hidden"
      >
        <span aria-hidden="true">‹</span> Usuarios
      </Link>
      {content}
    </section>
  );
}
