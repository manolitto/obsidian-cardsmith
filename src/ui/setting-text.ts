import type {
  Hinge,
  LayoutCandidate,
  LayoutDecision,
} from "../definitions/card-settings";
import type { CardCopies, CutMarks } from "../definitions/deck-settings";

/*
 * A setting's value as the deck block's summary shows it: in the block's
 * own words, a mapping as its fields, a length with its unit. Pure, so a
 * test can hold every setting the plugin knows to a readable line.
 */

/** `short-edge`, `Beil × 3`, `enabled: false`, `gap: 1.5 mm, sides: both`. */
export function settingText(key: string, value: unknown): string {
  switch (key) {
    case "page-margin":
      return `${String(value)} mm`;
    case "display-height":
      return `${String(value)} px`;
    case "cut-marks":
      return Object.entries(value as CutMarks)
        .map(([field, v]) => `${field}: ${String(v)}`)
        .join(", ");
    case "hinge":
      return hingeText(value as Hinge);
    case "card-copies":
      return (value as CardCopies[])
        .map(({ name, copies }) => `${name} × ${copies}`)
        .join(", ");
    case "layouts":
      return (value as LayoutCandidate[]).map(({ name }) => name).join(", ");
    case "layout-decision":
      return (value as LayoutDecision).order
        .map(({ metric, direction }) => `${metric} ${direction}`)
        .join(", ");
    default:
      return String(value);
  }
}

/** The hinge's fields in the order the block documents them, under their own keys, the widths in millimetres. */
function hingeText(hinge: Hinge): string {
  const parts: string[] = [];
  if (hinge.gap !== undefined) parts.push(`gap: ${hinge.gap} mm`);
  if (hinge.outerGap !== undefined) parts.push(`outer-gap: ${hinge.outerGap} mm`);
  if (hinge.color !== undefined) parts.push(`color: ${hinge.color}`);
  if (hinge.sides !== undefined) parts.push(`sides: ${hinge.sides}`);
  return parts.join(", ");
}
