import { useEffect, useRef } from "react";
import { Route, Routes, useLocation, useMatch } from "react-router";
import { AppHeader } from "@/components/AppHeader";
import { EmptyState, PostsIcon } from "@/components/EmptyState";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { NotFound } from "@/components/NotFound";
import { usePageTitle } from "@/components/usePageTitle";
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
  useRecoverFocusOnNavigation(isUserSelected);

  return (
    <ToastProvider>
      <div className={`flex flex-col md:h-dvh ${isHome ? "h-dvh" : ""}`}>
        {/* Con el teclado, la lista de usuarios son 10 paradas antes del detalle:
            este enlace (visible solo al recibir el foco) salta directamente. */}
        {isUserSelected && <SkipToContent />}
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
          <main
            id="main-content"
            tabIndex={-1}
            className={`focus:outline-none md:flex md:min-h-0 md:flex-col ${isHome ? "hidden" : ""}`}
          >
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
  usePageTitle();

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

/**
 * En móvil, al elegir un usuario la lista se oculta y el enlace pulsado (que
 * tenía el foco) deja de verse; al volver, desaparece "Volver a usuarios". En
 * ambos casos el foco caería al <body> y quien usa teclado o lector de pantalla
 * tendría que empezar desde arriba. Si tras navegar el foco se ha perdido, se
 * lleva al título de la pantalla nueva. Si sigue en un elemento visible (en
 * escritorio, el enlace de la lista), no se toca. Tampoco en la carga inicial.
 */
function useRecoverFocusOnNavigation(isUserSelected: boolean) {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const active = document.activeElement;
    const focusLost =
      !(active instanceof HTMLElement) ||
      active === document.body ||
      active.getClientRects().length === 0;
    if (!focusLost) return;

    const targetId = isUserSelected ? "user-detail-heading" : "users-heading";
    document.getElementById(targetId)?.focus({ preventScroll: true });
  }, [pathname, isUserSelected]);
}

function SkipToContent() {
  return (
    <a
      href="#main-content"
      onClick={(event) => {
        // Se mueve el foco a mano para no ensuciar la URL con "#main-content".
        event.preventDefault();
        document.getElementById("main-content")?.focus();
      }}
      className="sr-only rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:ring-2 focus:ring-white"
    >
      Saltar a las publicaciones
    </a>
  );
}
