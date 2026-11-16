/**
 * Cabecera fija arriba en todos los tamaños. En escritorio la página no hace
 * scroll (cada lista tiene el suyo), así que ya lo estaba; en móvil, con un
 * único scroll de página, sticky la mantiene visible. Fondo blanco
 * semitransparente con desenfoque para que el contenido se intuya al pasar.
 */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <img src="/icon.svg" alt="" width={32} height={32} className="size-8" />
        <h1 className="text-lg font-semibold tracking-tight">Usuarios y publicaciones</h1>
      </div>
    </header>
  );
}
