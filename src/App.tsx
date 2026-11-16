import { UserList } from "@/features/users/UserList";

/**
 * Maestro-detalle. En escritorio la app ocupa la altura de la ventana y la lista
 * de usuarios y el panel de detalle tienen cada uno su scroll. En móvil se apila
 * con un único scroll de página: los scrolls anidados atrapan el dedo en táctil.
 */
export default function App() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col px-4 md:h-dvh">
      <header className="py-6 md:shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios y publicaciones</h1>
      </header>

      <div className="grid gap-6 pb-8 md:min-h-0 md:flex-1 md:grid-cols-[18rem_1fr] md:grid-rows-[minmax(0,1fr)] md:pb-6">
        <aside aria-labelledby="users-heading" className="flex flex-col md:min-h-0">
          <h2 id="users-heading" className="mb-3 text-lg font-semibold">
            Usuarios
          </h2>
          <UserList />
        </aside>

        <main className="md:min-h-0 md:overflow-y-auto">
          <p className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-600">
            Selecciona un usuario para ver sus publicaciones.
          </p>
        </main>
      </div>
    </div>
  );
}
