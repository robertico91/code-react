import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "@/api/posts";

export function postsQueryKey(userId: number) {
  return ["users", userId, "posts"] as const;
}

export function usePosts(userId: number) {
  return useQuery({
    queryKey: postsQueryKey(userId),
    queryFn: ({ signal }) => getUserPosts(userId, signal),
    // Las publicaciones creadas solo existen en esta caché (la API no las guarda).
    // - staleTime: si la query se diera por caducada y se recargara, desaparecerían;
    //   se cargan una vez por usuario y no se vuelven a pedir solas.
    // - gcTime: al cambiar de usuario, la caché del anterior queda sin uso y por
    //   defecto se borra a los 5 minutos; así siguen ahí al volver.
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
