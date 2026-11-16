import { fetchJson } from "./client";
import type { NewPost, Post } from "./types";

export function getUserPosts(userId: number, signal?: AbortSignal): Promise<Post[]> {
  return fetchJson<Post[]>(`/users/${userId}/posts`, { signal });
}

/** La API simula la creación: responde 201 pero no guarda nada. */
export function createPost(input: NewPost): Promise<Post> {
  return fetchJson<Post>("/posts", { method: "POST", body: input });
}
