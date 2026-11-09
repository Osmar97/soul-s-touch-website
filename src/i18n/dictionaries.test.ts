import { describe, expect, it } from "vitest";
import { en } from "./en";
import { pt } from "./pt";
import { es } from "./es";
import { formatNok } from "@/config/booking";

function keys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keys(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("translations", () => {
  it("Portuguese has every English text", () => {
    expect(keys(pt).sort()).toEqual(keys(en).sort());
  });
  it("Spanish has every English text", () => {
    expect(keys(es).sort()).toEqual(keys(en).sort());
  });
});

describe("prices", () => {
  it("shows NOK with an approximate euro value", () => {
    expect(formatNok(550)).toBe("550 NOK · ≈ €47");
  });
});
