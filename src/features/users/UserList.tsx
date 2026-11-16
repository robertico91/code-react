import { useDeferredValue, useState } from "react";
import { Skeleton, SkeletonBar } from "@/components/Skeleton";
import { EmptyMessage, ErrorMessage } from "@/components/StatusMessage";
import { filterUsers } from "./filterUsers";
import { UserSearch } from "./UserSearch";
import { useUsers } from "./useUsers";

export function UserList() {
  const [search, setSearch] = useState("");
  // Son 10 usuarios y el filtro es local: no hace falta debounce, solo que
  // escribir tenga prioridad sobre volver a pintar la lista.
  const deferredSearch = useDeferredValue(search);

  return (
    // El buscador está siempre: la carga y el error solo afectan a los resultados,
    // así la columna no salta y se puede escribir mientras llegan los datos.
    // En escritorio solo hace scroll la lista; el buscador y el contador quedan fijos.
    <div className="flex flex-col gap-3 md:min-h-0 md:flex-1">
      <UserSearch value={search} onChange={setSearch} />
      <UserResults search={deferredSearch} />
    </div>
  );
}

function UserResults({ search }: { search: string }) {
  const { data: users, isPending, isError, error, refetch } = useUsers();

  if (isPending) return <UserListSkeleton />;

  if (isError) {
    return (
      <ErrorMessage
        title="No se pudieron cargar los usuarios."
        error={error}
        onRetry={() => void refetch()}
      />
    );
  }

  if (users.length === 0) return <EmptyMessage>No hay usuarios.</EmptyMessage>;

  const visibleUsers = filterUsers(users, search);

  return (
    <>
      <p aria-live="polite" className="text-xs text-slate-500">
        {visibleUsers.length === users.length
          ? `${users.length} usuarios`
          : `${visibleUsers.length} de ${users.length} usuarios`}
      </p>

      {visibleUsers.length === 0 ? (
        <EmptyMessage>{`Ningún usuario coincide con «${search.trim()}».`}</EmptyMessage>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white md:min-h-0 md:overflow-y-auto md:overscroll-contain">
          {visibleUsers.map((user) => (
            <li key={user.id} className="px-4 py-3">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-slate-500">@{user.username}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Anchos variados para que la silueta no parezca una tabla. */
const SKELETON_NAME_WIDTHS = ["w-36", "w-28", "w-40", "w-32", "w-44", "w-28"];

/**
 * Misma estructura que la lista real (contador + filas de nombre y @usuario con
 * el mismo alto), para que al llegar los datos no se mueva nada.
 */
function UserListSkeleton() {
  return (
    <Skeleton label="Cargando usuarios…" className="flex flex-col gap-3 md:min-h-0">
      <div className="flex h-4 items-center">
        <SkeletonBar className="h-3 w-16" />
      </div>
      <div className="divide-y divide-slate-200 overflow-hidden rounded-md border border-slate-200 bg-white">
        {SKELETON_NAME_WIDTHS.map((width, index) => (
          <div key={index} className="px-4 py-3">
            <div className="flex h-6 items-center">
              <SkeletonBar className={`h-4 ${width}`} />
            </div>
            <div className="flex h-5 items-center">
              <SkeletonBar className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </Skeleton>
  );
}
