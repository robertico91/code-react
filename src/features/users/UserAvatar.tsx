import type { User } from "@/api/types";
import { getInitials } from "./getInitials";

/** Pares de fondo suave y texto oscuro, con contraste suficiente para las iniciales. */
const AVATAR_COLORS = [
  "bg-sky-100 text-sky-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-violet-100 text-violet-800",
  "bg-teal-100 text-teal-800",
] as const;

/** Color fijo por usuario (depende del id): no cambia al recargar ni al filtrar. */
function avatarColor(userId: number): string {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length] ?? AVATAR_COLORS[0];
}

/** Decorativo: el nombre siempre aparece al lado, así que no se anuncia dos veces. */
export function UserAvatar({ user }: { user: Pick<User, "id" | "name"> }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColor(user.id)}`}
    >
      {getInitials(user.name)}
    </span>
  );
}
