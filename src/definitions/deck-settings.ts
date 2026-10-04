import { parsePaperSize, type PaperSize } from "../model/paper-size";
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
  type SettingTable,
} from "./setting-chain";

/**
 * What a deck — the thing that collects cards and puts them on pages — can be
 * told. Resolved once per deck, from the baseline and the deck block.
 *
 * Nothing in between has a say, and not because it is forbidden: a deck holds
 * cards of several card types, so a `page-margin:` on one of them could not
 * even be disagreed with. A deck block also carries card settings — overrides
 * for every card it holds — and those go to the card chain as the deck layer;
 * the deck parser splits the two by key.
 */
export interface DeckSettings {
  /** Paper the deck is imposed on. */
  paperSize?: PaperSize;
  /** Blank space in millimetres around the card grid on each page. */
  pageMargin?: number;
  /** Which paper edge is the binding, so fronts and backs align after a flip. */
  duplexFlip?: DuplexFlip;
  /** Whether a note's physical cards print side by side, uncut, to be folded, and which face goes where. */
  fold?: Fold;
  /** Millimetres between the columns of a folding deck — a hinge between a fold's panels, to cut out before laminating. 0 folds along a crease. */
  foldGap?: number;
  /** Millimetres of a `cover`'s outer hinge — between the cover and the last page — when it wraps three panels or more; absent, `foldGap`. Needs a `foldGap`. */
  foldGapOuter?: number;
  /** Alignment marks at each card's corners. Fields merge, so one can change alone. */
  cutMarks?: CutMarks;
  /** Whether to print the system's background textures. Defaults from the settings, which also govern the card shown in its note. */
  paperBackground?: PaperBackground;
  /** Include notes from subfolders when a deck names a folder. */
  folderRecursive?: boolean;
  /** Per-card copy overrides by name, which win over every card's own `copies`. */
  cardCopies?: CardCopies[];
}

export type DuplexFlip = "long-edge" | "short-edge";

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

export type PaperBackground =
  /** Use the system's background images. */
  | "textured"
  /** Drop them from everything printed or shown — the deck's pages and the card in its note alike. */
  | "plain";

/** Every field optional, because the fold merges them: a deck states only what it changes. */
export interface CutMarks {
  enabled?: boolean;
  /** Millimetres. */
  length?: number;
  /** Millimetres between the card corner and the mark. */
  margin?: number;
  /** A CSS colour. */
  color?: string;
  /** Millimetres. */
  weight?: number;
}

export interface CardCopies {
  /** A card, by vault path, path without `.md`, or basename; `[[…]]` stripped. */
  name: string;
  copies: number;
}

const DECK_SETTINGS: SettingTable<DeckSettings> = {
  paperSize: { key: "paper-size", parse: parsePaperSize },
  pageMargin: { key: "page-margin", parse: nonNegativeNumber },
  duplexFlip: { key: "duplex-flip", parse: oneOf(["long-edge", "short-edge"]) },
  fold: { key: "fold", parse: oneOf(["off", "strip", "cover", "booklet"]) },
  foldGap: { key: "fold-gap", parse: nonNegativeNumber },
  foldGapOuter: { key: "fold-gap-outer", parse: nonNegativeNumber },
  cutMarks: {
    key: "cut-marks",
    parse: parseCutMarks,
    merge: (base, layer) => ({ ...base, ...layer }),
  },
  paperBackground: {
    key: "paper-background",
    parse: oneOf(["textured", "plain"]),
  },
  folderRecursive: { key: "folder-recursive", parse: booleanValue },
  cardCopies: { key: "card-copies", parse: parseCardCopies },
};

/** The keys an author may write, in table order. */
export const DECK_SETTING_KEYS = settingKeys(DECK_SETTINGS);

export function isDeckSettingKey(key: string): boolean {
  return DECK_SETTING_KEYS.includes(key);
}

/** The fields a layer sets, under their keys, in table order. */
export function deckSettingEntries(layer: DeckSettings): [string, unknown][] {
  return settingEntries(DECK_SETTINGS, layer);
}

/** Read one layer — the baseline's or a deck block's — typed. */
export function parseDeckSettings(
  raw: Record<string, unknown> | undefined,
  diagnostics: Diagnostics
): DeckSettings {
  return parseSettings(DECK_SETTINGS, raw, "deck", diagnostics);
}

/** Fold baseline, then deck. The deck wins whole, except `cut-marks`, whose fields merge. */
export function mergeDeckSettings(
  layers: readonly (DeckSettings | undefined)[]
): DeckSettings {
  return mergeSettings(DECK_SETTINGS, layers);
}

function parseCutMarks(raw: unknown): CutMarks | undefined {
  if (!isMapping(raw)) return undefined;
  const out: CutMarks = {};
  for (const [key, value] of Object.entries(raw)) {
    switch (key) {
      case "enabled": {
        const v = booleanValue(value);
        if (v === undefined) return undefined;
        out.enabled = v;
        break;
      }
      case "length":
      case "weight": {
        const v = positiveNumber(value);
        if (v === undefined) return undefined;
        out[key] = v;
        break;
      }
      case "margin": {
        const v = nonNegativeNumber(value);
        if (v === undefined) return undefined;
        out.margin = v;
        break;
      }
      case "color": {
        const v = nonEmptyString(value);
        if (v === undefined) return undefined;
        out.color = v;
        break;
      }
      default:
        return undefined;
    }
  }
  return out;
}

function parseCardCopies(raw: unknown): CardCopies[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: CardCopies[] = [];
  for (const item of raw) {
    if (!isMapping(item)) return undefined;
    const name = nonEmptyString(item["name"])?.replace(/^\[\[|\]\]$/g, "");
    const copies = positiveInteger(item["copies"]);
    if (!name || copies === undefined) return undefined;
    out.push({ name, copies });
  }
  return out;
}
