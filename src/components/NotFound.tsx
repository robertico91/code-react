import { Link } from "react-router";
import { usePageTitle } from "./usePageTitle";

export function NotFound() {
  usePageTitle("Página no encontrada");

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Página no encontrada</h2>
      <p className="mt-1 text-sm text-slate-600">La dirección no corresponde a ninguna página.</p>
      <Link
        to="/"
        className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand-dark focus-visible:rounded focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
      >
        Volver a la lista de usuarios
      </Link>
    </div>
  );
}
