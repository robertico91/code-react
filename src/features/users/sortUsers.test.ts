import { describe, expect, it } from "vitest";
import type { User } from "@/api/types";
import { users } from "@/test/fixtures";
import { sortUsersByName } from "./sortUsers";

function userNamed(name: string, id: number): User {
  return {
    id,
    name,
    username: name,
    email: `${id}@example.com`,
    website: "example.com",
    address: { city: "Madrid" },
    company: { name: "Acme" },
  };
}

describe("sortUsersByName", () => {
  it("ordena de la A a la Z", () => {
    expect(sortUsersByName(users).map((user) => user.name)).toEqual([
      "Clementína Bauch",
      "Ervin Howell",
      "Leanne Graham",
      "Mrs. Dennis Schulist",
    ]);
  });

  it("no tiene en cuenta mayúsculas ni tildes al comparar", () => {
    const list = ["beta", "Álvaro", "alba"].map((name, index) => userNamed(name, index));
    expect(sortUsersByName(list).map((user) => user.name)).toEqual(["alba", "Álvaro", "beta"]);
  });

  it("no modifica el array recibido", () => {
    const original = [...users];
    sortUsersByName(users);
    expect(users).toEqual(original);
  });
});
