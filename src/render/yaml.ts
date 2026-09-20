import { load } from "js-yaml";

/**
 * YAML as a note writes it — with wikilinks in it.
 *
 * A note's frontmatter and its `cardsmith` block are YAML, and an author
 * writes `image: [[Beil.png]]` there without quoting it, because that is what
 * Obsidian itself accepts. To js-yaml the same line is a nested flow sequence
 * (`[["Beil.png"]]`), and the embed form `![[Beil.png]]` starts with a tag
 * indicator and does not parse at all. So the brackets are swapped for
 * private-use characters before the parse and swapped back after, and a
 * `[[x]]` shape that got through anyway is folded back into its string.
 *
 * One loader for both places, so the block and the frontmatter cannot
 * disagree on what a link looks like. Parse errors propagate; the caller
 * knows the note and reports them with its name. Empty input is `null`.
 */
export function loadNoteYaml(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const guarded = trimmed
    .replace(/!\[\[/g, EMBED_OPEN)
    .replace(/\[\[/g, LINK_OPEN)
    .replace(/\]\]/g, LINK_CLOSE);
  return repairLinkArrays(restoreLinks(load(guarded)));
}

/**
 * A piece of text as a value — a table cell, an inline field's value. Read
 * through the loader above so `15` is a number and `[a, b]` a list, and a
 * wikilink survives — but conservatively, since the text is display text
 * first: a number only when it prints back as written (`01` and `1-3` stay
 * text), a boolean only for the literal words, and a collection only from
 * explicit flow syntax — a `- ` bullet or a `word: rest` in prose would
 * otherwise become a list or a mapping.
 */
export function coerceScalar(cell: string): unknown {
  let value: unknown;
  try {
    value = loadNoteYaml(cell);
  } catch {
    return cell;
  }
  if (value === null || value === undefined) return cell;
  if (typeof value === "number") return String(value) === cell ? value : cell;
  if (typeof value === "boolean")
    return cell === "true" || cell === "false" ? value : cell;
  if (typeof value === "object") {
    if (!(cell.startsWith("[") || cell.startsWith("{"))) return cell;
    return value;
  }
  return value;
}

// Private-use characters no note carries. The embed opener is swapped whole:
// leaving the `!` in place would still make a YAML tag of what follows.
const EMBED_OPEN = "";
const LINK_OPEN = "";
const LINK_CLOSE = "";

function restoreLinks(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replace(new RegExp(EMBED_OPEN, "g"), "![[")
      .replace(new RegExp(LINK_OPEN, "g"), "[[")
      .replace(new RegExp(LINK_CLOSE, "g"), "]]");
  }
  if (Array.isArray(value)) return value.map(restoreLinks);
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) out[key] = restoreLinks(item);
    return out;
  }
  return value;
}

/**
 * A `[[x]]` that reached js-yaml unguarded — the brackets were already
 * encoded, say — parses to a one-element list of a one-element list of a
 * string, and that shape means nothing else in a note. Fold it back into the
 * link it was. A genuine `[a, b]` list is a flat list of strings and is left
 * alone.
 */
export function repairLinkArrays(value: unknown): unknown {
  if (isLinkArrayShape(value)) return `[[${value[0][0]}]]`;
  if (Array.isArray(value)) return value.map(repairLinkArrays);
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) out[key] = repairLinkArrays(item);
    return out;
  }
  return value;
}

/** A mapping, as opposed to a list or a value js-yaml typed — a `Date`, say. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const proto: unknown = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isLinkArrayShape(value: unknown): value is [[string]] {
  return (
    Array.isArray(value) &&
    value.length === 1 &&
    Array.isArray(value[0]) &&
    (value[0] as unknown[]).length === 1 &&
    typeof (value[0] as unknown[])[0] === "string"
  );
}
