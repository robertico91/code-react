export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <img src="/icon.svg" alt="" width={32} height={32} className="size-8" />
        <h1 className="text-lg font-semibold tracking-tight">Usuarios y publicaciones</h1>
      </div>
    </header>
  );
}
