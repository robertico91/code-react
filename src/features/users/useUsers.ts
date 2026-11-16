import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/users";
import { sortUsersByName } from "./sortUsers";

export const usersQueryKey = ["users"] as const;

export function useUsers() {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: ({ signal }) => getUsers(signal),
    // Se ordena una vez al llegar los datos: `select` memoriza el resultado y el
    // filtro de búsqueda conserva el orden sin reordenar en cada tecla.
    select: sortUsersByName,
  });
}
