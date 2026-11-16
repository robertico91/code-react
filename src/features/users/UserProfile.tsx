import type { ReactNode } from "react";
import type { User } from "@/api/types";
import { UserAvatar } from "./UserAvatar";

const LINK_CLASSES =
  "text-brand hover:text-brand-dark hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none";

/**
 * Ficha del usuario elegido: lo que no cabe en la fila de la lista
 * (@username, empresa, ciudad y web). Mismo color de avatar que en la lista,
 * para que se vea que es la misma persona.
 */
export function UserProfile({ user }: { user: User }) {
  return (
    <header className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <UserAvatar user={user} size="lg" />
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold tracking-tight">{user.name}</h2>
          <p className="truncate text-sm text-slate-500">@{user.username}</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <ProfileField label="Email">
          <a href={`mailto:${user.email}`} className={LINK_CLASSES}>
            {user.email}
          </a>
        </ProfileField>
        <ProfileField label="Empresa">{user.company.name}</ProfileField>
        <ProfileField label="Ciudad">{user.address.city}</ProfileField>
        <ProfileField label="Web">
          {/* Los dominios de la API son ficticios: se abren en otra pestaña. */}
          <a
            href={`https://${user.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASSES}
          >
            {user.website}
          </a>
        </ProfileField>
      </dl>
    </header>
  );
}

function ProfileField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-0.5 truncate text-slate-800">{children}</dd>
    </div>
  );
}
