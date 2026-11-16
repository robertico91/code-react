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

const SIZE_CLASSES = {
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
} as const;

interface UserAvatarProps {
  user: Pick<User, "id" | "name">;
  /** md en la lista, lg en la cabecera del detalle. */
  size?: keyof typeof SIZE_CLASSES;
}

/** Decorativo: el nombre siempre aparece al lado, así que no se anuncia dos veces. */
export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZE_CLASSES[size]} ${avatarColor(user.id)}`}
    >
      {getInitials(user.name)}
    </span>
  );
}
