import { ApiError } from "@/api/client";
import { Button } from "./Button";

export function LoadingMessage({ children }: { children: string }) {
  return (
    <div role="status" className="flex items-center gap-3 py-6 text-sm text-slate-600">
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand"
      />
      {children}
    </div>
  );
}

interface ErrorMessageProps {
  title: string;
  error: unknown;
  onRetry?: () => void;
}

export function ErrorMessage({ title, error, onRetry }: ErrorMessageProps) {
  const detail = error instanceof ApiError ? error.message : "Ha ocurrido un error inesperado.";

  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
      <p className="font-medium text-red-800">{title}</p>
      <p className="mt-1 text-red-700">{detail}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-3" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

export function EmptyMessage({ children }: { children: string }) {
  return <p className="py-6 text-sm text-slate-600">{children}</p>;
}
