import { createContext } from "react";

export type ToastKind = "success" | "error";

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string | undefined;
}

export interface ToastApi {
  /** Se cierra sola a los pocos segundos (se pausa con el ratón o el foco encima). */
  success: (title: string, description?: string) => number;
  /** Se queda hasta que se cierra: un error no debe desaparecer antes de leerlo. */
  error: (title: string, description?: string) => number;
  dismiss: (id: number) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);
