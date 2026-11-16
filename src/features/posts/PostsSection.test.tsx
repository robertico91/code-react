import { screen, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL } from "@/api/client";
import { renderApp } from "@/test/renderApp";
import { server } from "@/test/server";

/** La lista de publicaciones (se llama como su título, "Publicaciones"). */
function postsList() {
  return screen.getByRole("list", { name: "Publicaciones" });
}

function postTitles() {
  return within(postsList())
    .getAllByRole("heading", { level: 4 })
    .map((heading) => heading.textContent);
}

/** Abre el panel "Nueva publicación" del usuario 1 y devuelve sus campos. */
async function openNewPostPanel() {
  const view = renderApp("/users/1");
  await screen.findByRole("list", { name: "Publicaciones" });

  await view.user.click(screen.getByRole("button", { name: "Nueva publicación" }));
  const panel = screen.getByRole("dialog", { name: "Nueva publicación" });

  return {
    ...view,
    panel,
    title: within(panel).getByRole("textbox", { name: "Título" }),
    body: within(panel).getByRole("textbox", { name: "Texto" }),
    submit: within(panel).getByRole("button", { name: "Publicar" }),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Publicaciones del usuario", () => {
  it("se paginan de 5 en 5", async () => {
    const { user } = renderApp("/users/1");

    expect(await screen.findByText("1–5 de 7 publicaciones")).toBeInTheDocument();
    expect(postTitles()).toHaveLength(5);

    await user.click(screen.getByRole("button", { name: "Página siguiente" }));

    expect(screen.getByText("6–7 de 7 publicaciones")).toBeInTheDocument();
    expect(postTitles()).toEqual(["publicación 6 de leanne", "publicación 7 de leanne"]);
    expect(screen.getByRole("button", { name: "Página 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("si el usuario no tiene publicaciones, lo dice", async () => {
    renderApp("/users/2");

    expect(await screen.findByText("Sin publicaciones")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /Paginación/ })).not.toBeInTheDocument();
  });

  it("un usuario que no existe muestra 'Usuario no encontrado'", async () => {
    renderApp("/users/999");

    expect(await screen.findByText("Usuario no encontrado.")).toBeInTheDocument();
  });
});

describe("Nueva publicación", () => {
  it("abre el panel con el foco en el título", async () => {
    const { panel, title } = await openNewPostPanel();

    expect(panel).toHaveAttribute("open");
    expect(panel).toHaveAccessibleDescription("Para Leanne Graham");
    expect(title).toHaveFocus();
  });

  it("valida que título y texto son obligatorios y no envía nada", async () => {
    let posts = 0;
    server.use(
      http.post(`${API_BASE_URL}/posts`, () => {
        posts += 1;
        return HttpResponse.json({ id: 101 }, { status: 201 });
      }),
    );
    const { user, title, body, submit } = await openNewPostPanel();

    await user.type(title, "   "); // solo espacios: no vale
    await user.click(submit);

    expect(title).toHaveAttribute("aria-invalid", "true");
    expect(title).toHaveAccessibleDescription("El título es obligatorio.");
    expect(body).toHaveAccessibleDescription("El texto es obligatorio.");
    expect(title).toHaveFocus();
    expect(posts).toBe(0);

    // Tras el primer intento, el error desaparece en cuanto se corrige.
    await user.type(title, "Hola");
    expect(title).not.toHaveAttribute("aria-invalid");
    expect(body).toHaveAttribute("aria-invalid", "true");
  });

  it("crea la publicación, la pone la primera y confirma con un toast", async () => {
    const { user, panel, title, body, submit } = await openNewPostPanel();

    await user.type(title, "Mi primera publicación");
    await user.type(body, "Hola desde los tests.");
    await user.click(submit);

    expect(await screen.findByText("Publicación creada")).toBeInTheDocument();
    expect(panel).not.toHaveAttribute("open");
    expect(postTitles()[0]).toBe("Mi primera publicación");
    expect(screen.getByText("1–5 de 8 publicaciones")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nueva publicación" })).toHaveFocus();
  });

  it("dos publicaciones creadas no comparten id aunque la API devuelva siempre 101", async () => {
    const consoleError = vi.spyOn(console, "error");
    const { user } = renderApp("/users/1");
    await screen.findByRole("list", { name: "Publicaciones" });

    for (const text of ["Primera", "Segunda"]) {
      await user.click(screen.getByRole("button", { name: "Nueva publicación" }));
      const panel = screen.getByRole("dialog", { name: "Nueva publicación" });
      await user.type(within(panel).getByRole("textbox", { name: "Título" }), text);
      await user.type(within(panel).getByRole("textbox", { name: "Texto" }), `Texto ${text}`);
      await user.click(within(panel).getByRole("button", { name: "Publicar" }));
      await screen.findByRole("heading", { level: 4, name: text });
    }

    expect(postTitles().slice(0, 2)).toEqual(["Segunda", "Primera"]);
    // El aviso de React por keys duplicadas sale por console.error; se busca en
    // el primer argumento de cualquier llamada, sin depender de cuántos lleve.
    const duplicateKeyWarnings = consoleError.mock.calls.filter(([message]) =>
      String(message).includes("same key"),
    );
    expect(duplicateKeyWarnings).toEqual([]);
  });

  it("si el envío falla, muestra el error y conserva lo escrito", async () => {
    server.use(http.post(`${API_BASE_URL}/posts`, () => new HttpResponse(null, { status: 500 })));
    const { user, panel, title, body, submit } = await openNewPostPanel();

    await user.type(title, "No se perderá");
    await user.type(body, "Este texto sigue aquí.");
    await user.click(submit);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("No se pudo publicar");
    expect(alert).toHaveTextContent("La petición falló (500).");
    expect(panel).toHaveAttribute("open");
    expect(title).toHaveValue("No se perderá");
    expect(body).toHaveValue("Este texto sigue aquí.");
    expect(postTitles()).not.toContain("No se perderá");
  });

  it("Escape cierra el panel y devuelve el foco al botón", async () => {
    const { user, panel } = await openNewPostPanel();

    await user.keyboard("{Escape}");

    expect(panel).not.toHaveAttribute("open");
    expect(screen.getByRole("button", { name: "Nueva publicación" })).toHaveFocus();
  });
});
