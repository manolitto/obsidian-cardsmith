/**
 * The one spelling of a property key, whatever wrote it.
 *
 * A value reaches a card from several places — the frontmatter, the
 * block's `data:`, a statblock, an inline field, a table's column map —
 * and the system declares its properties and aliases in a sixth. Every
 * key from every one of them reads as lowercase with each run of
 * whitespace and underscores as one hyphen, so `Hit Points:`,
 * `hit_points:` and `hit-points:` are the same key and an alias declared
 * as `hit points` matches all three. A heading (`## Hit Points`) reaches
 * the same spelling by its own, stricter route, which also strips markdown.
 *
 * Slot names are not keys and stay as written: a template reads a place by
 * the exact name the binding declares.
 */
export function propertyKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}
