import { EmptyMessage, ErrorMessage, LoadingMessage } from "@/components/StatusMessage";
import { useUsers } from "./useUsers";

export function UserList() {
  const { data: users, isPending, isError, error, refetch } = useUsers();

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

  return (
    <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
      {users.map((user) => (
        <li key={user.id} className="px-4 py-3">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-slate-500">@{user.username}</p>
        </li>
      ))}
    </ul>
  );
}
