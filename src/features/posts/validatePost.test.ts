import { describe, expect, it } from "vitest";
import { hasErrors, validatePost } from "./validatePost";

describe("validatePost", () => {
  it("exige título y texto", () => {
    expect(validatePost({ title: "", body: "" })).toEqual({
      title: "El título es obligatorio.",
      body: "El texto es obligatorio.",
    });
  });

  it("un campo con solo espacios cuenta como vacío", () => {
    expect(validatePost({ title: "   ", body: "\n\t" })).toEqual({
      title: "El título es obligatorio.",
      body: "El texto es obligatorio.",
    });
  });

  it("sin errores cuando los dos campos tienen contenido", () => {
    const errors = validatePost({ title: "Hola", body: "Mundo" });
    expect(errors).toEqual({});
    expect(hasErrors(errors)).toBe(false);
  });
});
