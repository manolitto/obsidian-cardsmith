import { parseCardSize, type CardSize } from "../model/card-size";
import type { Diagnostics } from "./diagnostics";
import {
  booleanValue,
  isMapping,
  nonEmptyString,
  nonNegativeNumber,
  oneOf,
  positiveInteger,
  positiveNumber,
  mergeSettings,
  parseSettings,
  settingEntries,
  settingKeys,
  type Parse,
  type SettingTable,
} from "./setting-chain";

/** A language code as the translation tables key it: trimmed and lowercased. */
const languageCode: Parse<string> = (raw) => nonEmptyString(raw)?.toLowerCase();

/**
 * What a card's rendering can be told, resolved once per card.
 *
 * The chain is baseline → system → card type → deck → note, and every layer
 * may set every key. A system sets defaults for its cards, a card type refines
 * them, a deck overrides them for one print run, and a note is the exception.
 * There is no per-key permission, and no deck-only key for what a deck can say
 * with the card's own: a deck that wants no overflow on this print says
 * `overflow-mode: none`, one that wants every card twice says `copies: 2`.
 *
 * What is resolved once per deck instead is `deck-settings.ts`.
 */
export interface CardSettings {
  /** Physical geometry. */
  cardSize?: CardSize;
  /** What a card does when its content cannot fit at the smallest type size. */
  overflowMode?: OverflowMode;
  /** The named, mutually exclusive ways this card may be laid out. */
  layouts?: LayoutCandidate[];
  /** How the winning layout candidate is chosen. */
  layoutDecision?: LayoutDecision;
  /** Which faces the card has — in the preview, and on the sheet. */
  side?: CardSide;
  /** Height of the in-note preview, in pixels. */
  displayHeight?: number;
  /** How many times this card is printed. */
  copies?: number;
  /** Print one card per value of the roll range — a property of the kind of card. */
  expandByRoll?: boolean;
  /**
   * Whether a note's physical cards print side by side, uncut, to be folded
   * rather than cut apart, and which face goes where. A card setting: a
   * deck that folds says so for every card it holds, and a note — a wide
   * card of columns among cards that are cut — says so for itself.
   */
  fold?: Fold;
  /**
   * Where this card folds: the strip between its panels. Every hinge
   * belongs to one card, so a system may set what its paper wants; a
   * mapping whose fields merge across the layers, so a deck can change one
   * of them alone.
   */
  hinge?: Hinge;
  /**
   * The language the card is printed in — which translation table captions
   * come from, and the `lang` its root carries. A setting rather than a
   * property: it says how the card comes out, not what the card is, and the
   * loader puts the system's primary language under the system's own layer so
   * a system that says nothing prints in the language it was written in.
   */
  language?: string;
}

export type OverflowMode = "none" | "extra-cards" | "back-then-cards";
export type CardSide = "front" | "back" | "both";

/**
 * Whether, and how, a note's cards fold. The faces are numbered in reading
 * order — the first card's front and back, then the second's, and on.
 */
export type Fold =
  /** Every card is cut out on its own. */
  | "off"
  /** Page 1 on the left, its fold on the right: 1, 2, 3 across the front, 4, 5, 6 across the back — unfolded, a strip with a front and a back. */
  | "strip"
  /** Page 1 on the right, its fold on the left: 5, 6, 1 across the front, 2, 3, 4 across the back — folded inwards, page 1 is a cover with the last page behind it. */
  | "cover"
  /** Sheets of two, nested and folded down the middle like a printed booklet: 8 | 1 and 2 | 7, then 6 | 3 and 4 | 5. */
  | "booklet";

/** Every field optional, because the chain merges them field by field. */
export interface Hinge {
  /** Millimetres between two panels of a fold; 0 folds along a crease. */
  gap?: number;
  /** Millimetres of a `cover`'s outer hinge, where three panels or more fold inside it; absent, `gap`, which it needs. */
  outerGap?: number;
  /** A CSS colour. */
  color?: string;
  /** The front of the sheet only, or behind itself on the back as well. */
  sides?: "front" | "both";
  /**
   * Whether the strip is cut out — for a laminated card, whose film seals
   * in the slot — or stays as the fold's spine. Staying, the fold is one
   * piece of paper: no cut marks along the strip, a fold mark at each edge.
   */
  cutOut?: boolean;
}

/**
 * One way of laying a card out. The layout engine produces every candidate,
 * measures what the decision names, and commits the winner, stamped as
 * `.cs-layout-<name>` so CSS can show or hide content per candidate. The
 * engine lives in `src/layout/`; the shape is data and is declared here.
 */
export interface LayoutCandidate {
  name: string;
  /** The parity of front faces this candidate produces when overflow fires. */
  frontFaceCount: "any" | "odd" | "even";
  /** Chosen when no candidate is eligible, so the list can never come up empty. */
  fallback: boolean;
  /** Only in the running if the named measured element clears the length. */
  eligibleIf?: { element: string; minWidth?: string; minHeight?: string };
}

export interface LayoutDecision {
  /** Tried in order; the first metric that separates the candidates decides. */
  order: LayoutMetric[];
  tieBreak: "declaration-order";
}

export interface LayoutMetric {
  metric: "printed-cards" | "element-size" | "whitespace";
  direction: "minimize" | "maximize";
  /** For `element-size`: which measured element, along which dimension — its
   * width, its height, or (absent, the default) the area of its box. */
  element?: string;
  dimension?: "width" | "height" | "area";
  /** For `element-size`: differences below this count as a tie. */
  epsilon?: number;
}

const CARD_SETTINGS: SettingTable<CardSettings> = {
  cardSize: { key: "card-size", parse: parseCardSize },
  overflowMode: {
    key: "overflow-mode",
    parse: oneOf(["none", "extra-cards", "back-then-cards"]),
  },
  layouts: { key: "layouts", parse: parseLayouts },
  layoutDecision: { key: "layout-decision", parse: parseLayoutDecision },
  side: { key: "side", parse: oneOf(["front", "back", "both"]) },
  displayHeight: { key: "display-height", parse: positiveNumber },
  copies: { key: "copies", parse: positiveInteger },
  expandByRoll: { key: "expand-by-roll", parse: booleanValue },
  fold: { key: "fold", parse: oneOf(["off", "strip", "cover", "booklet"]) },
  hinge: {
    key: "hinge",
    parse: parseHinge,
    merge: (base, layer) => ({ ...base, ...layer }),
  },
  language: { key: "language", parse: languageCode },
};

/** The keys an author may write, in table order. */
export const CARD_SETTING_KEYS = settingKeys(CARD_SETTINGS);

export function isCardSettingKey(key: string): boolean {
  return CARD_SETTING_KEYS.includes(key);
}

/** The fields a layer sets, under their keys, in table order. */
export function cardSettingEntries(layer: CardSettings): [string, unknown][] {
  return settingEntries(CARD_SETTINGS, layer);
}

/** Read one layer — a system's, a card type's, a deck block's, a note's — typed. */
export function parseCardSettings(
  raw: Record<string, unknown> | undefined,
  diagnostics: Diagnostics
): CardSettings {
  return parseSettings(CARD_SETTINGS, raw, "card", diagnostics);
}

/** Fold the chain, lowest layer first; the highest layer that has a field wins it. */
export function mergeCardSettings(
  layers: readonly (CardSettings | undefined)[]
): CardSettings {
  return mergeSettings(CARD_SETTINGS, layers);
}

// ── Hinge ───────────────────────────────────────────────────────────

/** `{ gap, outer-gap, color, sides, cut-out }`, any of them; an unknown or invalid field refuses the layer, as `cut-marks` does. */
function parseHinge(raw: unknown): Hinge | undefined {
  if (!isMapping(raw)) return undefined;
  const out: Hinge = {};
  for (const [key, value] of Object.entries(raw)) {
    switch (key) {
      case "gap":
      case "outer-gap": {
        const v = nonNegativeNumber(value);
        if (v === undefined) return undefined;
        out[key === "gap" ? "gap" : "outerGap"] = v;
        break;
      }
      case "color": {
        const v = nonEmptyString(value);
        if (v === undefined) return undefined;
        out.color = v;
        break;
      }
      case "cut-out": {
        const v = booleanValue(value);
        if (v === undefined) return undefined;
        out.cutOut = v;
        break;
      }
      case "sides": {
        const v = oneOf(["front", "both"] as const)(value);
        if (v === undefined) return undefined;
        out.sides = v;
        break;
      }
      default:
        return undefined;
    }
  }
  return out;
}

// ── Layout candidates ───────────────────────────────────────────────

const CANDIDATE_NAME = /^[a-z0-9_-]+$/;

function parseLayouts(raw: unknown): LayoutCandidate[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const out: LayoutCandidate[] = [];
  for (const item of raw) {
    const candidate = parseCandidate(item);
    if (!candidate) return undefined;
    out.push(candidate);
  }
  return out;
}

function parseCandidate(raw: unknown): LayoutCandidate | undefined {
  if (!isMapping(raw)) return undefined;
  const name = nonEmptyString(raw["name"])?.toLowerCase();
  if (!name || !CANDIDATE_NAME.test(name)) return undefined;

  const frontFaceCount =
    raw["front-face-count"] === undefined
      ? "any"
      : oneOf(["any", "odd", "even"] as const)(raw["front-face-count"]);
  if (!frontFaceCount) return undefined;

  const out: LayoutCandidate = {
    name,
    frontFaceCount,
    fallback: raw["fallback"] === true,
  };

  if (raw["eligible-if"] !== undefined) {
    const guard = raw["eligible-if"];
    if (!isMapping(guard)) return undefined;
    const element = nonEmptyString(guard["element"]);
    if (!element) return undefined;
    out.eligibleIf = { element };
    const minWidth = nonEmptyString(guard["min-width"]);
    const minHeight = nonEmptyString(guard["min-height"]);
    if (minWidth) out.eligibleIf.minWidth = minWidth;
    if (minHeight) out.eligibleIf.minHeight = minHeight;
    if (!minWidth && !minHeight) return undefined;
  }
  return out;
}

function parseLayoutDecision(raw: unknown): LayoutDecision | undefined {
  if (!isMapping(raw) || !Array.isArray(raw["order"]) || raw["order"].length === 0) {
    return undefined;
  }
  const order: LayoutMetric[] = [];
  for (const item of raw["order"]) {
    const metric = parseMetric(item);
    if (!metric) return undefined;
    order.push(metric);
  }
  const tieBreak =
    raw["tie-break"] === undefined
      ? "declaration-order"
      : oneOf(["declaration-order"] as const)(raw["tie-break"]);
  if (!tieBreak) return undefined;
  return { order, tieBreak };
}

const parseMetricName: Parse<LayoutMetric["metric"]> = oneOf([
  "printed-cards",
  "element-size",
  "whitespace",
]);

function parseMetric(raw: unknown): LayoutMetric | undefined {
  if (!isMapping(raw)) return undefined;
  const metric = parseMetricName(raw["metric"]);
  const direction = oneOf(["minimize", "maximize"] as const)(raw["direction"]);
  if (!metric || !direction) return undefined;
  const out: LayoutMetric = { metric, direction };
  const element = nonEmptyString(raw["element"]);
  if (element) out.element = element;
  const dimension = oneOf(["width", "height", "area"] as const)(raw["dimension"]);
  if (dimension) out.dimension = dimension;
  const epsilon = positiveNumber(raw["epsilon"]);
  if (epsilon !== undefined) out.epsilon = epsilon;
  if (metric === "element-size" && !element) return undefined;
  return out;
}
