import { UserList } from "@/features/users/UserList";

export default function App() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios y publicaciones</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
        <aside aria-labelledby="users-heading">
          <h2 id="users-heading" className="mb-3 text-lg font-semibold">
            Usuarios
          </h2>
          <UserList />
        </aside>

        <main>
          <p className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-600">
            Selecciona un usuario para ver sus publicaciones.
          </p>
        </main>
      </div>
    </div>
  );
}
