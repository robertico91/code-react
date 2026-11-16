import { http, HttpResponse } from "msw";
import { API_BASE_URL } from "@/api/client";
import type { NewPost } from "@/api/types";
import { postsByUser, users } from "./fixtures";

/**
 * Comportamiento "feliz" de la API, igual que JSONPlaceholder: 404 para un
 * usuario que no existe y, al crear, 201 con id 101 sin guardar nada. Cada test
 * puede sobrescribir un endpoint con server.use(...) para provocar errores.
 */
export const handlers = [
  http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(users)),

  http.get(`${API_BASE_URL}/users/:userId/posts`, ({ params }) =>
    HttpResponse.json(postsByUser[Number(params["userId"])] ?? []),
  ),

  http.post<never, NewPost>(`${API_BASE_URL}/posts`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...body, id: 101 }, { status: 201 });
  }),
];
