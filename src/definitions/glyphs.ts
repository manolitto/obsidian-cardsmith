import type { Diagnostics } from "./diagnostics";
import { parseLocalizedText, pickLocalized, type LocalizedText } from "./language";

/**
 * `glyphs:` — how a stored abbreviation is printed in full.
 *
 * ```yaml
 * glyphs:
 *   front-stat-1a:          # the slot the table serves
 *     1h: einhändig         # what the note wrote → what the card shows
 *     2h: { de: zweihändig, en: two-handed }   # or once per language
 * ```
 *
 * Keyed by SLOT, not by property: it is the place on the card that decides
 * how a value is spelled out, and a card type putting something else in the
 * same cell brings its own table or none. A value the table does not name
 * passes through unchanged, so a table need only list the abbreviations.
 * A glyph that is a word rather than a symbol is written once per language,
 * like a caption; a symbol is written once.
 *
 * Both the system and a card type may declare one; the loader merges them
 * per slot, the card type's table replacing the system's for that slot and
 * leaving every other slot's table alone.
 */
export type GlyphTable = Record<string, LocalizedText>;
export type GlyphTables = Record<string, GlyphTable>;

/** Read a `glyphs:` block: slot name → lowercased value → replacement. */
export function parseGlyphTables(
  raw: unknown,
  context: string,
  diagnostics: Diagnostics
): GlyphTables {
  if (raw === null || raw === undefined) return {};
  if (!isMapping(raw)) {
    diagnostics.warn(
      `${context} must be a mapping of <slot>: { value: glyph }; ignoring it`
    );
    return {};
  }
  const out: GlyphTables = {};
  for (const [rawSlot, rawTable] of Object.entries(raw)) {
    const slot = rawSlot.trim().toLowerCase();
    if (!slot) continue;
    if (!isMapping(rawTable)) {
      diagnostics.warn(
        `${context}.${slot} must be a mapping of value: glyph; ignoring it`
      );
      continue;
    }
    const table: GlyphTable = {};
    for (const [value, glyph] of Object.entries(rawTable)) {
      const text = parseLocalizedText(glyph, `${context}.${slot}.${value}`, diagnostics);
      if (text === undefined) continue;
      table[String(value).trim().toLowerCase()] = text;
    }
    out[slot] = table;
  }
  return out;
}

/** The layer's table wins per slot; slots it does not mention keep the base's. */
export function mergeGlyphTables(
  base: GlyphTables | undefined,
  layer: GlyphTables | undefined
): GlyphTables {
  return { ...(base ?? {}), ...(layer ?? {}) };
}

/**
 * The glyph for a value at a slot, or the value itself when the slot has no
 * table or the table does not name it. Matched on the trimmed, lowercased
 * text, so `1H` and `1h` print alike; a glyph written per language is read
 * for the card's, with the first language written as the fallback.
 */
export function applyGlyph(
  tables: GlyphTables,
  slot: string,
  value: string,
  language: string
): string {
  const table = tables[slot];
  if (!table) return value;
  const glyph = pickLocalized(table[value.trim().toLowerCase()], language);
  return glyph === undefined ? value : glyph;
}

function isMapping(raw: unknown): raw is Record<string, unknown> {
  return typeof raw === "object" && raw !== null && !Array.isArray(raw);
}
