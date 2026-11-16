import { fetchJson } from "./client";
import type { User } from "./types";

export function getUsers(signal?: AbortSignal): Promise<User[]> {
  return fetchJson<User[]>("/users", { signal });
}

/** Lanza un `ApiError` con status 404 si el usuario no existe. */
export function getUser(userId: number, signal?: AbortSignal): Promise<User> {
  return fetchJson<User>(`/users/${userId}`, { signal });
}
