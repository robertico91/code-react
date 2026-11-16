import { Link } from "react-router";

/**
 * Cabecera fija arriba en todos los tamaños. En escritorio la página no hace
 * scroll (cada lista tiene el suyo), así que ya lo estaba; en móvil, con un
 * único scroll de página, sticky la mantiene visible. Fondo blanco
 * semitransparente con desenfoque para que el contenido se intuya al pasar.
 *
 * Logo y título son un único enlace al inicio (un solo elemento enfocable, no
 * dos enlaces seguidos al mismo sitio). El logo es decorativo: el nombre del
 * enlace es el texto del título.
 */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
        <h1>
          <Link
            to="/"
            className="group -mx-1.5 flex items-center gap-3 rounded-lg px-1.5 py-1 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            <img
              src="/icon.svg"
              alt=""
              width={32}
              height={32}
              className="size-8 transition-transform group-hover:scale-105 motion-reduce:transition-none"
            />
            <span className="text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-brand-dark">
              Usuarios y publicaciones
            </span>
          </Link>
        </h1>
      </div>
    </header>
  );
}
