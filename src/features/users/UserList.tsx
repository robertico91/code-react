import { useDeferredValue, useState } from "react";
import { EmptyMessage, ErrorMessage, LoadingMessage } from "@/components/StatusMessage";
import { filterUsers } from "./filterUsers";
import { UserSearch } from "./UserSearch";
import { useUsers } from "./useUsers";

export function UserList() {
  const { data: users, isPending, isError, error, refetch } = useUsers();
  const [search, setSearch] = useState("");
  // Son 10 usuarios y el filtro es local: no hace falta debounce, solo que
  // escribir tenga prioridad sobre volver a pintar la lista.
  const deferredSearch = useDeferredValue(search);

  if (isPending) return <LoadingMessage>Cargando usuarios…</LoadingMessage>;

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

  const visibleUsers = filterUsers(users, deferredSearch);

  return (
    <div className="space-y-3">
      <UserSearch value={search} onChange={setSearch} />

      <p aria-live="polite" className="text-xs text-slate-500">
        {visibleUsers.length === users.length
          ? `${users.length} usuarios`
          : `${visibleUsers.length} de ${users.length} usuarios`}
      </p>

      {visibleUsers.length === 0 ? (
        <EmptyMessage>{`Ningún usuario coincide con «${deferredSearch.trim()}».`}</EmptyMessage>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {visibleUsers.map((user) => (
            <li key={user.id} className="px-4 py-3">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-slate-500">@{user.username}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
