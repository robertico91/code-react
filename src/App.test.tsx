import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderApp } from "@/test/renderApp";

describe("App", () => {
  it("carga la lista de usuarios desde la API", async () => {
    renderApp();

    expect(screen.getByRole("status")).toHaveTextContent("Cargando usuarios…");
    expect(await screen.findByRole("link", { name: /Leanne Graham/ })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });
});
