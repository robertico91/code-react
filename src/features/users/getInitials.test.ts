import { describe, expect, it } from "vitest";
import { getInitials } from "./getInitials";

describe("getInitials", () => {
  it("usa las dos primeras palabras del nombre", () => {
    expect(getInitials("Leanne Graham")).toBe("LG");
    expect(getInitials("Nicholas Runolfsdottir V")).toBe("NR");
  });

  it("ignora tratamientos con punto", () => {
    expect(getInitials("Mrs. Dennis Schulist")).toBe("DS");
  });

  it("con una sola palabra devuelve una inicial, y sin nombre un '?'", () => {
    expect(getInitials("cher")).toBe("C");
    expect(getInitials("   ")).toBe("?");
  });
});
