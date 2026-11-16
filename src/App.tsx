import { Route, Routes, useMatch } from "react-router";
import { AppHeader } from "@/components/AppHeader";
import { EmptyState, PostsIcon } from "@/components/EmptyState";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { NotFound } from "@/components/NotFound";
import { UserDetail } from "@/features/users/UserDetail";
import { UserList } from "@/features/users/UserList";

/**
 * Maestro-detalle. En escritorio la app ocupa la altura de la ventana y la lista
 * de usuarios y la de publicaciones tienen cada una su scroll.
 *
 * En móvil solo se ve una de las dos partes: la lista en "/" y el detalle en
 * "/users/:id" (con enlace para volver). La lista se oculta con CSS y no se
 * desmonta, así conserva el texto de búsqueda al volver.
 * - Lista ("/"): la app ocupa la altura de la pantalla y solo se desplaza el
 *   listado; título, contador y buscador quedan fijos. La página no se desplaza,
 *   así que no hay scrolls anidados que atrapen el dedo.
 * - Detalle y resto: un único scroll de página, con cabecera y barra de vuelta fijas.
 */
export default function App() {
  const isUserSelected = useMatch("/users/:userId") !== null;
  const isHome = useMatch("/") !== null;

  return (
    <ToastProvider>
      <div className={`flex flex-col md:h-dvh ${isHome ? "h-dvh" : ""}`}>
        <AppHeader />

        <div
          className={`mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:min-h-0 md:flex-1 md:grid-cols-[18rem_1fr] md:grid-rows-[minmax(0,1fr)] ${isHome ? "min-h-0 flex-1 grid-rows-[minmax(0,1fr)]" : ""}`}
        >
          <aside
            aria-labelledby="users-heading"
            className={`min-h-0 flex-col md:flex ${isUserSelected ? "hidden" : "flex"}`}
          >
            <UserList />
          </aside>

          {/* En escritorio el panel no hace scroll entero: solo la lista de publicaciones
            (ver UserDetail). Por eso es una columna flex que reparte el alto. En móvil,
            en "/" solo hay un aviso pensado para escritorio: el main no ocupa sitio. */}
          <main className={`md:flex md:min-h-0 md:flex-col ${isHome ? "hidden" : ""}`}>
            <Routes>
              <Route path="/" element={<SelectUserPrompt />} />
              <Route path="/users/:userId" element={<UserDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

/** Solo en escritorio: en móvil la lista ya ocupa la pantalla y basta con ella. */
function SelectUserPrompt() {
  return (
    // La visibilidad va en un contenedor propio: EmptyState ya es "flex" y mezclar
    // "hidden" y "flex" en el mismo elemento depende del orden del CSS generado.
    <div className="hidden md:block md:h-full">
      <EmptyState
        icon={<PostsIcon />}
        title="Elige un usuario"
        description="Verás su ficha y sus publicaciones. Puedes buscarlo por nombre en la lista."
        className="h-full"
      />
    </div>
  );
}
