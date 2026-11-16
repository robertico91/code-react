import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/api/posts";
import type { Post } from "@/api/types";
import { postsQueryKey } from "./usePosts";
import type { PostDraft } from "./validatePost";

/**
 * JSONPlaceholder responde siempre `id: 101` al crear, así que dos publicaciones
 * creadas compartirían id (y `key` en React, que avisa y puede mezclar filas).
 * Cada una recibe un id local negativo y decreciente (-1, -2…): sigue siendo un
 * número como los de la API, nunca coincide con ellos (son positivos) y se ve a
 * simple vista que es local.
 */
let lastLocalId = 0;
function nextLocalId(): number {
  lastLocalId -= 1;
  return lastLocalId;
}

/**
 * Crea una publicación para el usuario y la añade arriba de su lista en caché.
 * JSONPlaceholder responde 201 pero no guarda nada: si se volviera a pedir la
 * lista al servidor, la nueva desaparecería. Por eso se escribe directamente en
 * la caché (y usePosts no recarga sola, ver staleTime).
 */
export function useCreatePost(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: PostDraft) => createPost({ userId, ...draft }),
    onSuccess: (created) => {
      const post: Post = { ...created, id: nextLocalId() };
      queryClient.setQueryData<Post[]>(postsQueryKey(userId), (previous = []) => [
        post,
        ...previous,
      ]);
    },
  });
}
