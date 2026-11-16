import type { Post, User } from "@/api/types";

/**
 * Datos de prueba con la forma de JSONPlaceholder, en pequeño. Los nombres
 * cubren los casos de la app: tildes ("Clementína" no existe en la API real, se
 * añade para probar la búsqueda sin tildes), un tratamiento ("Mrs.") y un orden
 * de llegada distinto del alfabético.
 */
export const users: User[] = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    website: "hildegard.org",
    address: { city: "Gwenborough" },
    company: { name: "Romaguera-Crona" },
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
    website: "anastasia.net",
    address: { city: "Wisokyburgh" },
    company: { name: "Deckow-Crist" },
  },
  {
    id: 3,
    name: "Clementína Bauch",
    username: "Samantha",
    email: "Nathan@yesenia.net",
    website: "ramiro.info",
    address: { city: "McKenziehaven" },
    company: { name: "Romaguera-Jacobson" },
  },
  {
    id: 6,
    name: "Mrs. Dennis Schulist",
    username: "Leopoldo_Corkery",
    email: "Karley_Dach@jasper.info",
    website: "ola.org",
    address: { city: "South Christy" },
    company: { name: "Considine-Lockman" },
  },
];

/** 7 publicaciones para el usuario 1 (2 páginas de 5) y ninguna para el resto. */
export const postsByUser: Record<number, Post[]> = {
  1: Array.from({ length: 7 }, (_, index) => ({
    id: index + 1,
    userId: 1,
    title: `publicación ${index + 1} de leanne`,
    body: `Texto de la publicación ${index + 1}.`,
  })),
};
