import { Route, Routes, useMatch } from "react-router";
import { AppHeader } from "@/components/AppHeader";
import { NotFound } from "@/components/NotFound";
import { UserDetail } from "@/features/users/UserDetail";
import { UserList } from "@/features/users/UserList";

/**
 * Maestro-detalle. En escritorio la app ocupa la altura de la ventana y la lista
 * de usuarios y el panel de detalle tienen cada uno su scroll. En móvil se apila
 * con un único scroll de página: los scrolls anidados atrapan el dedo en táctil.
 *
 * En móvil además solo se ve una de las dos partes: la lista en "/" y el detalle
 * en "/users/:id" (con enlace para volver). La lista se oculta con CSS y no se
 * desmonta, así conserva el texto de búsqueda al volver.
 */
export default function App() {
  const isUserSelected = useMatch("/users/:userId") !== null;

  return (
    <div className="flex flex-col md:h-dvh">
      <AppHeader />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:min-h-0 md:flex-1 md:grid-cols-[18rem_1fr] md:grid-rows-[minmax(0,1fr)]">
        <aside
          aria-labelledby="users-heading"
          className={`flex-col md:flex md:min-h-0 ${isUserSelected ? "hidden" : "flex"}`}
        >
          <UserList />
        </aside>

        <main className="md:min-h-0 md:overflow-y-auto">
          <Routes>
            <Route path="/" element={<SelectUserPrompt />} />
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/** Solo en escritorio: en móvil la lista ya ocupa la pantalla y basta con ella. */
function SelectUserPrompt() {
  return (
    <p className="hidden rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600 md:block">
      Selecciona un usuario para ver sus publicaciones.
    </p>
  );
}
