import { describe, expect, it } from "vitest";
import { users } from "@/test/fixtures";
import { filterUsers, normalizeText } from "./filterUsers";

const names = (list: { name: string }[]) => list.map((user) => user.name);

describe("normalizeText", () => {
  it("pasa a minúsculas, quita tildes y recorta espacios", () => {
    expect(normalizeText("  ÁLVARO Peña ")).toBe("alvaro pena");
  });
});

describe("filterUsers", () => {
  it("busca por nombre sin distinguir mayúsculas ni tildes", () => {
    expect(names(filterUsers(users, "CLEMENTINA"))).toEqual(["Clementína Bauch"]);
    expect(names(filterUsers(users, "clementína"))).toEqual(["Clementína Bauch"]);
  });

  it("busca dentro del nombre, no solo al principio", () => {
    expect(names(filterUsers(users, "graham"))).toEqual(["Leanne Graham"]);
  });

  it("solo busca en el nombre (no en el email ni en el usuario)", () => {
    expect(filterUsers(users, "Bret")).toEqual([]);
  });

  it("con una búsqueda vacía o de espacios devuelve todos", () => {
    expect(filterUsers(users, "")).toHaveLength(users.length);
    expect(filterUsers(users, "   ")).toHaveLength(users.length);
  });
});
