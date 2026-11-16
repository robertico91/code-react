import { useParams } from "react-router";

/**
 * Id del usuario de la URL (`/users/:userId`). Devuelve `null` si no es un
 * entero positivo ("/users/abc", "/users/0"), para tratarlo como "no encontrado"
 * sin llegar a pedir nada a la API.
 */
export function useUserId(): number | null {
  const { userId } = useParams();
  const id = Number(userId);
  return Number.isInteger(id) && id > 0 ? id : null;
}
