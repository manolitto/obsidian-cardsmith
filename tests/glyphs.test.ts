import { describe, expect, it } from "vitest";
import { collectDiagnostics } from "../src/definitions/diagnostics";
import {
  applyGlyph,
  mergeGlyphTables,
  parseGlyphTables,
} from "../src/definitions/glyphs";
import { yaml } from "./helpers/definitions";

const parse = (source: string, diagnostics = collectDiagnostics()) =>
  parseGlyphTables(yaml(source), "x.glyphs", diagnostics);

describe("glyphs:", () => {
  it("maps a stored abbreviation to what the card prints, per slot", () => {
    const tables = parse("front-stat-1a: { 1h: einhändig, 2H: zweihändig }");
    expect(applyGlyph(tables, "front-stat-1a", "1H", "de")).toBe("einhändig");
    expect(applyGlyph(tables, "front-stat-1a", " 2h ", "de")).toBe("zweihändig");
  });

  it("prints a glyph written per language in the card's, the first language behind it", () => {
    const tables = parse("front-stat-1a: { 1h: { de: einhändig, en: one-handed } }");
    expect(applyGlyph(tables, "front-stat-1a", "1H", "en")).toBe("one-handed");
    expect(applyGlyph(tables, "front-stat-1a", "1H", "de")).toBe("einhändig");
    expect(applyGlyph(tables, "front-stat-1a", "1H", "sv")).toBe("einhändig");
  });

  it("passes a value the table does not name through, and a slot with no table", () => {
    const tables = parse("front-stat-1a: { 1h: einhändig }");
    expect(applyGlyph(tables, "front-stat-1a", "3H", "de")).toBe("3H");
    expect(applyGlyph(tables, "front-stat-2a", "1H", "de")).toBe("1H");
  });

  it("merges per slot — the card type's table replaces the system's for that slot only", () => {
    const merged = mergeGlyphTables(
      parse("a: { x: system-x }\nb: { y: system-y }"),
      parse("a: { z: type-z }")
    );
    expect(merged).toEqual({ a: { z: "type-z" }, b: { y: "system-y" } });
  });

  it("reports a block or a table of the wrong shape", () => {
    const diagnostics = collectDiagnostics();
    expect(parse("[a, b]", diagnostics)).toEqual({});
    expect(parse("front-stat-1a: einhändig", diagnostics)).toEqual({});
    expect(diagnostics.messages).toHaveLength(2);
  });
});
