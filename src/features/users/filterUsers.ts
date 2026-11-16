import type { User } from "@/api/types";

/** Minúsculas y sin tildes: "José" y "jose" se consideran iguales. */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/** Filtra por nombre. Una búsqueda vacía devuelve todos los usuarios. */
export function filterUsers(users: readonly User[], query: string): User[] {
  const needle = normalizeText(query);
  if (!needle) return [...users];
  return users.filter((user) => normalizeText(user.name).includes(needle));
}
