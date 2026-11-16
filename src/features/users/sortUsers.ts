import type { User } from "@/api/types";

// Comparación propia del español: "Álvaro" va junto a "Alvaro" y no al final,
// y las mayúsculas no alteran el orden.
const nameCollator = new Intl.Collator("es", { sensitivity: "base" });

/** Copia ordenada por nombre, de la A a la Z (no muta el array recibido). */
export function sortUsersByName(users: readonly User[]): User[] {
  return [...users].sort((a, b) => nameCollator.compare(a.name, b.name));
}
