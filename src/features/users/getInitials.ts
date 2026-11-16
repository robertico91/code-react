/**
 * Iniciales para el avatar: las dos primeras palabras del nombre, ignorando
 * tratamientos con punto ("Mrs. Dennis Schulist" → "DS").
 * "Nicholas Runolfsdottir V" → "NR" (no "NV": se usan las dos primeras).
 */
export function getInitials(name: string): string {
  const words = name.split(/\s+/).filter((word) => word.length > 0 && !word.endsWith("."));

  const initials = words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return initials || "?";
}
