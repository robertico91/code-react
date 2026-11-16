import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_BASE_URL } from "@/api/client";
import { renderApp } from "@/test/renderApp";
import { server } from "@/test/server";

/** La columna de usuarios (aside con nombre "Usuarios") y sus filas. */
function usersPanel() {
  return screen.getByRole("complementary", { name: "Usuarios" });
}

/** Espera a que la lista de usuarios haya cargado. */
async function waitForUsers() {
  await within(usersPanel()).findByRole("list");
}

/** Texto de cada fila (iniciales + nombre + email), en el orden en que se ven. */
function userRows() {
  const list = within(usersPanel()).queryByRole("list");
  return list
    ? within(list)
        .getAllByRole("link")
        .map((link) => link.textContent)
    : [];
}

/** Comprueba que las filas contienen esos nombres, en ese orden. */
function namesInOrder(...names: string[]) {
  return names.map((name) => expect.stringContaining(name));
}

describe("Lista de usuarios", () => {
  it("muestra los usuarios ordenados por nombre", async () => {
    renderApp();
    await waitForUsers();

    expect(userRows()).toEqual(
      namesInOrder("Clementína Bauch", "Ervin Howell", "Leanne Graham", "Mrs. Dennis Schulist"),
    );
    expect(within(usersPanel()).getByText("4")).toBeInTheDocument();
  });

  it("filtra por nombre sin distinguir mayúsculas ni tildes", async () => {
    const { user } = renderApp();
    await waitForUsers();

    await user.type(
      screen.getByRole("searchbox", { name: "Buscar usuario por nombre" }),
      "CLEMENTINA",
    );

    // La búsqueda usa useDeferredValue: el filtro puede aplicarse un instante después.
    await waitFor(() => expect(userRows()).toEqual(namesInOrder("Clementína Bauch")));
    expect(within(usersPanel()).getByText("1 de 4")).toBeInTheDocument();
  });

  it("sin coincidencias, avisa y 'Ver todos los usuarios' vuelve a la lista con el foco en el buscador", async () => {
    const { user } = renderApp();
    await waitForUsers();
    const search = screen.getByRole("searchbox", { name: "Buscar usuario por nombre" });

    await user.type(search, "zzz");
    expect(await screen.findByText("Ningún usuario coincide con «zzz».")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ver todos los usuarios" }));

    await waitFor(() => expect(userRows()).toHaveLength(4));
    expect(search).toHaveValue("");
    expect(search).toHaveFocus();
  });

  it("si la API falla, muestra el error y 'Reintentar' vuelve a cargar", async () => {
    server.use(
      http.get(`${API_BASE_URL}/users`, () => new HttpResponse(null, { status: 500 }), {
        once: true,
      }),
    );
    const { user } = renderApp();

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("No se pudieron cargar los usuarios.");
    expect(alert).toHaveTextContent("La petición falló (500).");
    // El buscador sigue ahí aunque falle la carga.
    expect(
      screen.getByRole("searchbox", { name: "Buscar usuario por nombre" }),
    ).toBeInTheDocument();

    await user.click(within(alert).getByRole("button", { name: "Reintentar" }));

    await waitForUsers();
    expect(userRows()).toHaveLength(4);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("elegir un usuario abre su detalle y lo marca como actual", async () => {
    const { user } = renderApp();
    await waitForUsers();

    const link = within(usersPanel()).getByRole("link", { name: /Leanne Graham/ });
    await user.click(link);

    expect(
      await screen.findByRole("heading", { level: 2, name: "Leanne Graham" }),
    ).toBeInTheDocument();
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
