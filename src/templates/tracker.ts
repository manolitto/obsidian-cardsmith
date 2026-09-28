import { markdownInline } from "./inline-markdown";

/**
 * A tracker: rows of empty boxes printed on a card to be ticked off with a
 * pen — twenty arrows, seven charges of a wand, three uses per long rest.
 *
 * The value takes three shapes, and a list may mix them:
 *
 *   tracker: 20
 *   tracker: { count: 20, label: "Arrows" }
 *   tracker: [{ count: 7, label: "Charges" }, { count: 3, label: "Per rest" }]
 *
 * `group` (default 5) is how many boxes stand together before a wider gap,
 * so a count can be read at a glance. A number may arrive as text — a table
 * cell or an inline field is always text — and reads the same.
 *
 * The boxes are elements the stylesheet draws, not characters: a card's
 * typeface need not have a ☐, and a CSS border takes the text colour and a
 * size of its own. The markup is one block, `cs-keep-together`, so the
 * overflow splitter moves it whole and never cuts a row in two.
 */

/** The slot the baseline binds `tracker` to, and where a front shows it when no template reads it. */
export const TRACKER_SLOT = "front-tracker";

/** Boxes in a group when the note does not say. */
export const DEFAULT_GROUP = 5;

/**
 * The most boxes one row may ask for. Beyond it a value is far more likely
 * a slip — `200` for `20` — than a design, and it would fill a card with
 * boxes before the text had a chance.
 */
export const MAX_COUNT = 100;

export interface TrackerRow {
  count: number;
  group: number;
  /** As the note wrote it; inline markdown. */
  label?: string;
}

const ROW_KEYS = ["count", "label", "group"] as const;

/**
 * The rows a value asks for. An empty value is none; a row that cannot be
 * read is reported and left out, and the rest still print. `0` is a row of
 * no boxes, which prints nothing and is not an error — a card that has used
 * up its charges.
 */
export function parseTracker(
  value: unknown,
  report: (message: string) => void
): TrackerRow[] {
  if (value === null || value === undefined || value === "") return [];
  const items = Array.isArray(value) ? value : [value];
  const rows: TrackerRow[] = [];
  for (const item of items) {
    const row = parseRow(item, report);
    if (row && row.count > 0) rows.push(row);
  }
  return rows;
}

function parseRow(
  item: unknown,
  report: (message: string) => void
): TrackerRow | undefined {
  if (item === null || item === undefined || item === "") return undefined;
  if (typeof item !== "object") {
    const count = wholeNumber(item, 0, MAX_COUNT);
    if (count === undefined) {
      report(
        `"${String(item)}" is not a number of boxes from 0 to ${MAX_COUNT}; leaving it out`
      );
      return undefined;
    }
    return { count, group: DEFAULT_GROUP };
  }
  if (Array.isArray(item)) {
    report("a list inside a list is not a tracker row; leaving it out");
    return undefined;
  }

  // Keys in any case, as every other key a note writes.
  const fields = new Map<string, unknown>();
  for (const [key, field] of Object.entries(item as Record<string, unknown>)) {
    const name = key.trim().toLowerCase();
    if (!(ROW_KEYS as readonly string[]).includes(name)) {
      report(`"${key}" is not a tracker field (${ROW_KEYS.join(", ")} are); ignoring it`);
      continue;
    }
    fields.set(name, field);
  }

  const count = wholeNumber(fields.get("count"), 0, MAX_COUNT);
  if (count === undefined) {
    const written = fields.has("count")
      ? `count: ${String(fields.get("count"))}`
      : "no count";
    report(
      `a row with ${written} — a number of boxes from 0 to ${MAX_COUNT} — is left out`
    );
    return undefined;
  }

  let group = DEFAULT_GROUP;
  if (fields.has("group")) {
    const parsed = wholeNumber(fields.get("group"), 1, Infinity);
    if (parsed === undefined) {
      report(
        `group: ${String(fields.get("group"))} is not a whole number from 1; using ${DEFAULT_GROUP}`
      );
    } else group = parsed;
  }

  const row: TrackerRow = { count, group };
  const label = fields.get("label");
  if (label !== null && label !== undefined && String(label).trim() !== "") {
    row.label = String(label).trim();
  }
  return row;
}

/** A whole number within the bounds, from a number or its text; otherwise nothing. */
function wholeNumber(value: unknown, min: number, max: number): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  const text = String(value).trim();
  if (!/^\d+$/.test(text)) return undefined;
  const number = Number(text);
  return number >= min && number <= max ? number : undefined;
}

/**
 * The tracker as markup, or `""` when the value asks for no boxes.
 *
 *   <div class="cs-tracker cs-keep-together">
 *     <div class="cs-tracker-row">
 *       <span class="cs-tracker-label">Arrows</span>
 *       <span class="cs-tracker-boxes">
 *         <span class="cs-tracker-group"><span class="cs-tracker-box"></span>…</span>
 *         …
 *       </span>
 *     </div>
 *   </div>
 *
 * The label and the boxes are the two items of a wrapping line: the boxes
 * stand beside the label when they all fit there, and below it, as one
 * block, when they do not. Inside, the groups wrap in their turn, a group
 * that does not fit moving to the next line whole.
 */
export function trackerHtml(value: unknown, report: (message: string) => void): string {
  const rows = parseTracker(value, report);
  if (rows.length === 0) return "";
  return `<div class="cs-tracker cs-keep-together">${rows.map(rowHtml).join("")}</div>`;
}

function rowHtml(row: TrackerRow): string {
  const box = '<span class="cs-tracker-box"></span>';
  let groups = "";
  for (let start = 0; start < row.count; start += row.group) {
    const size = Math.min(row.group, row.count - start);
    groups += `<span class="cs-tracker-group">${box.repeat(size)}</span>`;
  }
  const label =
    row.label === undefined
      ? ""
      : `<span class="cs-tracker-label">${markdownInline(row.label)}</span>`;
  return `<div class="cs-tracker-row">${label}<span class="cs-tracker-boxes">${groups}</span></div>`;
}
