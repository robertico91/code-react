import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/api/posts";
import type { Post } from "@/api/types";
import { postsQueryKey } from "./usePosts";
import type { PostDraft } from "./validatePost";

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
      queryClient.setQueryData<Post[]>(postsQueryKey(userId), (previous = []) => [
        created,
        ...previous,
      ]);
    },
  });
}
