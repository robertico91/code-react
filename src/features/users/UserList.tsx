import { useDeferredValue, useRef, useState } from "react";
import { NavLink } from "react-router";
import { Button } from "@/components/Button";
import { Skeleton, SkeletonBlock } from "@/components/Skeleton";
import { EmptyMessage, ErrorMessage } from "@/components/StatusMessage";
import { filterUsers } from "./filterUsers";
import { UserAvatar } from "./UserAvatar";
import { UserSearch } from "./UserSearch";
import { useUsers } from "./useUsers";

export function UserList() {
  const [search, setSearch] = useState("");
  // Son 10 usuarios y el filtro es local: no hace falta debounce, solo que
  // escribir tenga prioridad sobre volver a pintar la lista.
  const deferredSearch = useDeferredValue(search);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // El botón desaparece al vaciar la búsqueda: si no movemos el foco, quien usa
  // teclado o lector de pantalla se queda "en ningún sitio". En el buscador,
  // además, puede escribir otra búsqueda directamente.
  function showAllUsers() {
    setSearch("");
    searchInputRef.current?.focus();
  }

  return (
    // El buscador está siempre: la carga y el error solo afectan a los resultados,
    // así la columna no salta y se puede escribir mientras llegan los datos.
    // En escritorio solo hace scroll la lista; el buscador y el contador quedan fijos.
    <div className="flex flex-col gap-3 md:min-h-0 md:flex-1">
      <UserSearch ref={searchInputRef} value={search} onChange={setSearch} />
      <UserResults search={deferredSearch} onShowAll={showAllUsers} />
    </div>
  );
}

interface UserResultsProps {
  search: string;
  onShowAll: () => void;
}

function UserResults({ search, onShowAll }: UserResultsProps) {
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
        <div>
          <EmptyMessage>{`Ningún usuario coincide con «${search.trim()}».`}</EmptyMessage>
          <Button variant="secondary" onClick={onShowAll}>
            Ver todos los usuarios
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white md:min-h-0 md:overflow-y-auto md:overscroll-contain">
          {visibleUsers.map((user) => (
            <li key={user.id}>
              {/* NavLink pone aria-current="page" en el usuario activo; el estilo de
                  seleccionado cuelga de ese atributo, así visual y accesibilidad van juntos. */}
              <NavLink
                to={`/users/${user.id}`}
                className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none focus-visible:ring-inset aria-[current=page]:bg-brand/5 aria-[current=page]:shadow-[inset_3px_0_0_var(--color-brand)]"
              >
                <UserAvatar user={user} />
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate font-medium group-aria-[current=page]:text-brand-dark"
                    title={user.name}
                  >
                    {user.name}
                  </p>
                  <p className="truncate text-sm text-slate-500" title={user.email}>
                    {user.email}
                  </p>
                </div>
                <ChevronIcon className="size-4 shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-aria-[current=page]:text-brand group-aria-[current=page]:opacity-100" />
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function ChevronIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/** Anchos variados para que la silueta no parezca una tabla. */
const SKELETON_NAME_WIDTHS = ["w-36", "w-28", "w-40", "w-32", "w-44", "w-28"];

/**
 * Misma estructura que la lista real (contador + filas de avatar, nombre y email
 * con el mismo alto), para que al llegar los datos no se mueva nada.
 */
function UserListSkeleton() {
  return (
    <Skeleton label="Cargando usuarios…" className="flex flex-col gap-3 md:min-h-0">
      <div className="flex h-4 items-center">
        <SkeletonBlock className="h-3 w-16 rounded" />
      </div>
      <div className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {SKELETON_NAME_WIDTHS.map((width, index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-3">
            <SkeletonBlock className="size-10 shrink-0 rounded-full" />
            <div>
              <div className="flex h-6 items-center">
                <SkeletonBlock className={`h-4 rounded ${width}`} />
              </div>
              <div className="flex h-5 items-center">
                <SkeletonBlock className="h-3 w-32 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Skeleton>
  );
}
