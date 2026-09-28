import { dump } from "js-yaml";
import type { App, Editor } from "obsidian";
import type { SampleTable, SystemPath } from "../definitions/game-system";
import {
  propertyDescription,
  propertySample,
  type PropertyDef,
} from "../definitions/property-defs";
import type { LoadedCardType, LoadedSystem } from "../systems/loader";
import { RemoteFileError } from "../systems/source";
import { t } from "./strings";

/*
 * The `cardsmith` block the insert commands write: `card:` naming the
 * system, the card type and the language the block is written in, `data:`
 * with every property the card type
 * puts on the card — its description as a comment above, its sample as
 * the value or nothing. Pure; the goldens under `tests/fixtures/` hold it
 * per card type and mode.
 */

export type InsertMode = "empty" | "sample";

/**
 * The block for one card type. Only a property bound to a slot is written:
 * one that reaches no place on the card has nothing to show for a value.
 * Canonical keys only, never an alias. The block is written in one
 * language — `language` when the system has it, else the system's primary
 * one — and says so under `card:`, so the card prints its captions in the
 * language its descriptions and samples are in. A card type
 * that declares a sample table gets a table note instead: the table, then
 * the block with the columns under `table:` and the shared values under
 * `data:`. A card type that declares a sample text gets it after the
 * sample block, as the note's text.
 */
export function buildCardBlock(
  system: LoadedSystem,
  cardType: LoadedCardType,
  language: string,
  mode: InsertMode
): string {
  const languages = system.declaration.languages;
  const written = languages.includes(language) ? language : languages[0];
  if (written !== undefined) language = written;
  const table = forLanguage(system, cardType.declaration.sampleTable, language);
  const columns = new Set(Object.keys(table?.columns ?? {}));
  const lines: string[] = [];
  if (table) lines.push(...markdownTable(table, mode), "");

  lines.push(
    "```cardsmith",
    "card:",
    `  system: ${system.id}`,
    `  card-type: ${cardType.declaration.id}`
  );
  if (written !== undefined) lines.push(`  language: ${written}`);

  const bound = Object.entries(cardType.properties).filter(
    ([, def]) => (def.slot?.length ?? 0) > 0
  );
  if (table) {
    lines.push("table:");
    for (const [index, [key, header]] of Object.entries(table.columns).entries()) {
      if (index > 0) lines.push("");
      lines.push(...describe(cardType.properties[key], language));
      lines.push(...yamlLines(key, header));
    }
  }

  lines.push("data:");
  const shared = bound.filter(([key]) => !columns.has(key));
  if (shared.length === 0) {
    lines.push(`  # ${t("insert.no-properties")}`);
  }
  for (const [index, [key, def]] of shared.entries()) {
    if (index > 0) lines.push("");
    lines.push(...describe(def, language));
    if (mode === "empty") {
      lines.push(`  ${key}:`);
      continue;
    }
    // A property with a default and no sample is answered already; the
    // default written out is the truer example.
    const sample = propertySample(def, language) ?? def.default;
    if (sample === undefined) lines.push(`  ${key}: # ${t("insert.no-sample")}`);
    else lines.push(...yamlLines(key, sample));
  }

  lines.push("```", "");
  const text = forLanguage(system, cardType.declaration.sampleText, language);
  if (text && mode === "sample") lines.push(text, "");
  return lines.join("\n");
}

/** The property's description as comment lines, in `language`. */
function describe(def: PropertyDef | undefined, language: string): string[] {
  const description = propertyDescription(def, language);
  if (!description) return [];
  return description.split(/\r?\n/).map((line) => `  # ${line}`);
}

/** A per-language sample in `language`, else in the first the system documents, else any. */
function forLanguage<T>(
  system: LoadedSystem,
  samples: Record<string, T> | undefined,
  language: string
): T | undefined {
  if (!samples) return undefined;
  return (
    samples[language] ??
    samples[system.declaration.languages[0] ?? ""] ??
    Object.values(samples)[0]
  );
}

/**
 * The Markdown table: the headers in column order, a list column's
 * headers side by side, the rows beneath — or one blank row when the
 * block is to be empty. Cells are padded to the column so the source
 * reads as a table too; a `|` in a cell is escaped, as Markdown wants.
 */
function markdownTable(table: SampleTable, mode: InsertMode): string[] {
  const headers = Object.values(table.columns).flat();
  const rows =
    mode === "empty"
      ? [headers.map(() => "")]
      : table.rows.map((row) => headers.map((header) => row[header] ?? ""));
  const cell = (text: string) => text.replace(/\|/g, "\\|");
  const widths = headers.map((header, i) =>
    Math.max(cell(header).length, 3, ...rows.map((row) => cell(row[i] ?? "").length))
  );
  const line = (cells: string[]) =>
    `| ${cells.map((c, i) => cell(c).padEnd(widths[i] ?? 0)).join(" | ")} |`;
  return [
    line(headers),
    `| ${widths.map((w) => "-".repeat(w)).join(" | ")} |`,
    ...rows.map(line),
  ];
}

/**
 * `key: value` as YAML under `data:`, through js-yaml so a list, a map or
 * a string with line breaks comes out in a form the note loader reads
 * back as written.
 */
function yamlLines(key: string, value: unknown): string[] {
  const text = dump({ [key]: value }, { indent: 2, lineWidth: -1, noRefs: true });
  return text
    .trimEnd()
    .split("\n")
    .map((line) => `  ${line}`);
}

/**
 * Put a block at the cursor, after a blank line, and leave the cursor
 * after it. A fence glued to the line above reads as part of that
 * paragraph in the source, and a table needs the blank line to be a table
 * at all; so the block always stands after one — added only where it is
 * missing.
 */
export function insertAtCursor(editor: Editor, block: string): void {
  const from = editor.getCursor();
  const before = editor.getRange({ line: Math.max(0, from.line - 1), ch: 0 }, from);
  const text = blankLineBefore(before, from.line === 0) + block;
  editor.replaceRange(text, from);
  const lines = text.split("\n");
  const last = lines[lines.length - 1] ?? "";
  editor.setCursor({
    line: from.line + lines.length - 1,
    ch: lines.length === 1 ? from.ch + last.length : last.length,
  });
}

/**
 * What goes before a block so that it follows a blank line, given the
 * note's text from the start of the line above the cursor up to the
 * cursor. After text on the cursor's own line, two line breaks; on an
 * empty line under text, one; after a blank line, or on the note's first
 * line with nothing before the cursor, none. A line of spaces counts as
 * empty.
 */
export function blankLineBefore(before: string, firstLine: boolean): string {
  const lines = before.split("\n");
  const current = lines[lines.length - 1] ?? "";
  if (current.trim() !== "") return "\n\n";
  if (firstLine) return "";
  const above = lines[lines.length - 2] ?? "";
  return above.trim() === "" ? "" : "\n";
}

// ── The pictures a sample links ──────────────────────────────────

const PICTURE_LINK = /!?\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g;

/**
 * The declared sample pictures a written block links: every `[[name]]` in
 * it — a value, a table cell — whose name is the file name of one of the
 * system's `sample-pictures:`. A description comment's example is not a
 * link, so comment lines are skipped.
 */
export function linkedSamplePictures(
  system: LoadedSystem,
  block: string
): { link: string; path: SystemPath }[] {
  const byName = new Map<string, SystemPath>();
  for (const path of system.declaration.samplePictures) {
    byName.set(path.slice(path.lastIndexOf("/") + 1), path);
  }
  const out: { link: string; path: SystemPath }[] = [];
  for (const line of block.split("\n")) {
    if (/^\s*#/.test(line)) continue;
    for (const match of line.matchAll(PICTURE_LINK)) {
      const link = (match[1] as string).trim();
      const path = byName.get(link);
      if (path && !out.some((p) => p.link === link)) out.push({ link, path });
    }
  }
  return out;
}

/**
 * Write the sample pictures a block links into the vault, where Obsidian
 * puts an attachment of the note, unless the link already resolves: a
 * picture of that name anywhere the note can reach is the one it means,
 * and is never replaced.
 *
 * A bundled system downloads its sample pictures, so one may be out of
 * reach — no connection, say. That never undoes the insert: the picture
 * is skipped, named in `unavailable`, and the card shows without it until
 * the reader adds one. Returns the paths written and the links skipped.
 */
export async function writeSamplePictures(
  app: App,
  system: LoadedSystem,
  block: string,
  notePath: string
): Promise<{ written: string[]; unavailable: string[] }> {
  const written: string[] = [];
  const unavailable: string[] = [];
  for (const { link, path } of linkedSamplePictures(system, block)) {
    if (app.metadataCache.getFirstLinkpathDest(link, notePath)) continue;
    let bytes: Uint8Array;
    try {
      bytes = await system.source.readBinary(path);
    } catch (error) {
      if (!(error instanceof RemoteFileError)) throw error;
      console.warn(`[Cardsmith] ${error.message}`);
      unavailable.push(link);
      continue;
    }
    const target = await app.fileManager.getAvailablePathForAttachment(link, notePath);
    await app.vault.createBinary(target, bytes.slice().buffer);
    written.push(target);
  }
  return { written, unavailable };
}
