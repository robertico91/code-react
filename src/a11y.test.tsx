import { screen } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import { renderApp } from "@/test/renderApp";

/**
 * Auditoría automática con axe-core en las pantallas principales. jsdom no
 * calcula estilos ni layout, así que el contraste de color no se puede medir
 * aquí: se desactiva esa regla y el contraste se revisó con axe en el navegador.
 */
async function axeViolations() {
  const results = await axe.run(document.body, {
    rules: { "color-contrast": { enabled: false } },
    resultTypes: ["violations"],
  });
  return results.violations.map((violation) => ({
    id: violation.id,
    nodes: violation.nodes.map((node) => node.target.join(" ")),
  }));
}

describe("Accesibilidad (axe)", () => {
  it("lista de usuarios", async () => {
    renderApp("/");
    await screen.findByRole("list");

    expect(await axeViolations()).toEqual([]);
  });

  it("detalle de un usuario con sus publicaciones", async () => {
    renderApp("/users/1");
    await screen.findByRole("list", { name: "Publicaciones" });

    expect(await axeViolations()).toEqual([]);
  });

  it("panel de nueva publicación con errores de validación", async () => {
    const { user } = renderApp("/users/1");
    await screen.findByRole("list", { name: "Publicaciones" });
    await user.click(screen.getByRole("button", { name: "Nueva publicación" }));
    await user.click(screen.getByRole("button", { name: "Publicar" }));
    await screen.findByText("El título es obligatorio.");

    expect(await axeViolations()).toEqual([]);
  });
});
