/** Usuario de JSONPlaceholder (solo los campos que usa la app). */
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

/** Datos que envía el formulario para crear una publicación. */
export type NewPost = Pick<Post, "userId" | "title" | "body">;
