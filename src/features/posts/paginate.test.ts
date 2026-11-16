import { describe, expect, it } from "vitest";
import { paginate } from "./paginate";

const items = Array.from({ length: 7 }, (_, index) => index + 1);

describe("paginate", () => {
  it("corta la lista en páginas e indica el rango mostrado", () => {
    expect(paginate(items, 1, 5)).toEqual({
      items: [1, 2, 3, 4, 5],
      page: 1,
      totalPages: 2,
      from: 1,
      to: 5,
    });
    expect(paginate(items, 2, 5)).toMatchObject({ items: [6, 7], from: 6, to: 7 });
  });

  it("ajusta una página fuera de rango a la más cercana válida", () => {
    expect(paginate(items, 99, 5).page).toBe(2);
    expect(paginate(items, 0, 5).page).toBe(1);
    expect(paginate(items, -3, 5).page).toBe(1);
  });

  it("trata una página que no es un entero como la primera", () => {
    expect(paginate(items, Number("abc"), 5).page).toBe(1);
    expect(paginate(items, 1.5, 5).page).toBe(1);
  });

  it("una lista vacía tiene una página sin elementos", () => {
    expect(paginate([], 1, 5)).toEqual({ items: [], page: 1, totalPages: 1, from: 0, to: 0 });
  });
});
