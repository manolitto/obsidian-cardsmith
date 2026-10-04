import type { PhysicalCard } from "../deck/copies";
import type { Deck } from "../deck/pipeline";
import type { CutMarks, DuplexFlip, FoldOrder } from "../definitions/deck-settings";
import type { CardSize } from "../model/card-size";
import { DEFAULT_PAPER_PRESET, PAPER_PRESETS, type PaperSize } from "../model/paper-size";

/*
 * Page composition: a deck's physical cards onto sheets of paper.
 *
 * Everything here is millimetres and pure arithmetic. A page holds one
 * grid of one card size, packed without gaps and centred inside the page
 * margin; the fronts of a sheet go on one page and their backs, mirrored
 * along the axis the duplex flip turns about, on the next. What comes out
 * is positions — where each side of each card sits, and where the cut
 * marks go — for the document to render.
 *
 * A card is printed at its size, always: the paper and the margin decide
 * how many fit, never how big one is. Where the margin would leave no
 * room for a single card it yields, on that axis, to what the paper has —
 * so a card on paper its own size fills the page edge to edge, whatever
 * margin the deck asked for.
 *
 * A deck may fold: the physical cards of one note then print side by side,
 * uncut, `fold-panels` to a strip, and the strip is folded instead of cut
 * apart. The grid is then counted in strips, and a strip may hold several
 * shorter folds or single cards, in deck order. Nothing changes for the
 * back page: each panel's back lies behind it as any card's does.
 */

/** The grid a deck is imposed in: the paper the right way round, and where the cards sit on it. */
export interface Grid {
  /** The paper as printed — width across, height down. */
  paper: { width: number; height: number };
  card: CardSize;
  /** Cards to a strip: the grid is counted in strips of this many, side by side. 1 when the deck does not fold. */
  panels: number;
  /** In cards, a multiple of `panels`. */
  columns: number;
  rows: number;
  /** The grid's top-left corner on the page. */
  originX: number;
  originY: number;
}

/** One side of one card at one place on a page. */
export interface Cell {
  /** The place's position in print order, so a front and the back behind it can be told to belong together. */
  index: number;
  side: "front" | "back";
  name: string;
  cardTypeId: string;
  x: number;
  y: number;
  /** The settled face; absent for the back of a card that has none — the place stays empty. */
  html?: string;
  /** Set when the place is a panel of a fold: which fold, and which of its panels, counted from 1. */
  fold?: { chunk: number; panel: number; panels: number };
}

export interface Page {
  side: "front" | "back";
  cells: Cell[];
  /** The cut marks, as lines in millimetres on the page. */
  marks: Line[];
  /** The fold marks, likewise. */
  folds: Line[];
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** What the composer reads of a deck. */
export interface Composable {
  cards: readonly PhysicalCard[];
  cardSize: CardSize;
  paperSize: PaperSize;
  pageMargin: number;
  duplexFlip: DuplexFlip;
  cutMarks: CutMarks;
  /** Absent: 1, nothing folds. */
  foldPanels?: number;
  /** Absent: `pairs`. */
  foldOrder?: FoldOrder;
}

/**
 * Lay the grid out. `auto` orientation tries the paper both ways and takes
 * the one that holds more cards, portrait on a tie. A card that does not
 * fit the paper even once is an error naming both; with `panels`, the
 * unit is a strip of that many cards side by side, and so is the error.
 */
export function layoutGrid(
  paper: PaperSize,
  card: CardSize,
  pageMargin: number,
  panels = 1
): Grid {
  const short = Math.min(paper.width, paper.height);
  const long = Math.max(paper.width, paper.height);
  const portrait = fit({ width: short, height: long }, card, pageMargin, panels);
  const landscape = fit({ width: long, height: short }, card, pageMargin, panels);
  const chosen =
    paper.orientation === "portrait"
      ? portrait
      : paper.orientation === "landscape"
        ? landscape
        : landscape.columns * landscape.rows > portrait.columns * portrait.rows
          ? landscape
          : portrait;

  if (chosen.columns < 1 || chosen.rows < 1) {
    const what =
      panels > 1
        ? `A fold of ${panels} ${card.width} × ${card.height} mm cards (${mm(panels * card.width)} × ${card.height} mm)`
        : `A ${card.width} × ${card.height} mm card`;
    throw new Error(
      `${what} does not fit on ${chosen.paper.width} × ${chosen.paper.height} mm paper`
    );
  }
  return chosen;
}

/** The grid on the paper this way round. The margin yields, per axis, where it would not leave room for one strip. */
function fit(
  paper: { width: number; height: number },
  card: CardSize,
  margin: number,
  panels: number
): Grid {
  const strip = panels * card.width;
  const marginX = Math.min(margin, Math.max(0, (paper.width - strip) / 2));
  const marginY = Math.min(margin, Math.max(0, (paper.height - card.height) / 2));
  const usableWidth = paper.width - 2 * marginX;
  const usableHeight = paper.height - 2 * marginY;
  const columns = Math.max(0, Math.floor(usableWidth / strip)) * panels;
  const rows = Math.max(0, Math.floor(usableHeight / card.height));
  return {
    paper,
    card,
    panels,
    columns,
    rows,
    originX: marginX + (usableWidth - columns * card.width) / 2,
    originY: marginY + (usableHeight - rows * card.height) / 2,
  };
}

/**
 * The pages, in print order: for each sheet its front page, then — when
 * any card in the deck has a back — its back page. A deck of fronts alone
 * prints no blank sheets; a deck with one back keeps every back page, so
 * that duplex alignment holds from the first sheet to the last.
 *
 * On a back page each card sits where its front lands after the flip:
 * turned about the long edge, the columns mirror within the row; about
 * the short edge, the rows mirror within the column.
 *
 * A folding deck places folds, not cards: each goes into the current
 * strip when it fits what is left of it, else starts the next one — so
 * the deck's order is the print order, and a strip's remainder stays
 * empty rather than taking a later card.
 */
export function composePages(deck: Composable): { pages: Page[]; grid: Grid } {
  const panels = deck.foldPanels ?? 1;
  const grid = layoutGrid(deck.paperSize, deck.cardSize, deck.pageMargin, panels);
  const stripColumns = grid.columns / panels;
  const stripsPerPage = stripColumns * grid.rows;
  const folds = foldChunks(deck.cards, panels, deck.foldOrder ?? "pairs");
  const withBacks = folds.some((fold) => fold.some((place) => place.back !== undefined));
  const sheets: { front: Cell[]; back: Cell[] }[] = [];

  let strip = 0;
  let used = 0;
  for (const fold of folds) {
    if (used + fold.length > panels) {
      strip++;
      used = 0;
    }
    const local = strip % stripsPerPage;
    const row = Math.floor(local / stripColumns);
    const first = (local % stripColumns) * panels + used;
    const sheet = (sheets[Math.floor(strip / stripsPerPage)] ??= { front: [], back: [] });
    fold.forEach((place, i) => {
      const column = first + i;
      const common = {
        index: place.index,
        name: place.name,
        cardTypeId: place.cardTypeId,
        ...(place.fold === undefined ? {} : { fold: place.fold }),
      };
      sheet.front.push({
        ...common,
        side: "front",
        ...at(grid, column, row),
        ...(place.front === undefined ? {} : { html: place.front }),
      });
      const mirrored =
        deck.duplexFlip === "short-edge"
          ? at(grid, column, grid.rows - 1 - row)
          : at(grid, grid.columns - 1 - column, row);
      sheet.back.push({
        ...common,
        side: "back",
        ...mirrored,
        ...(place.back === undefined ? {} : { html: place.back }),
      });
    });
    used += fold.length;
    if (used === panels) {
      strip++;
      used = 0;
    }
  }

  const pages: Page[] = [];
  for (const { front, back } of sheets) {
    pages.push(page("front", front, grid, deck.cutMarks));
    if (withBacks) pages.push(page("back", back, grid, deck.cutMarks));
  }
  return { pages, grid };
}

function page(side: "front" | "back", cells: Cell[], grid: Grid, marks: CutMarks): Page {
  return {
    side,
    cells,
    marks: cutMarks(cells, grid, marks),
    folds: foldMarks(cells, grid, marks),
  };
}

/** One place of a fold — or a whole card, when nothing folds — with the faces that go on it. */
interface Place {
  index: number;
  name: string;
  cardTypeId: string;
  front?: string;
  back?: string;
  fold?: { chunk: number; panel: number; panels: number };
}

/**
 * The deck's cards as folds: each note printing's cards — one `group` —
 * cut into runs of `panels`, the last run shorter. A run of one is a card
 * as it is. In a longer run the faces, numbered in reading order (the
 * first card's front and back, then the second's), go where `order`
 * says: `pairs` keeps each card on its panel; `leporello` puts the first
 * half across the front, left to right, and the rest behind them, so that
 * turned over like a page they read on.
 */
function foldChunks(
  cards: readonly PhysicalCard[],
  panels: number,
  order: FoldOrder
): Place[][] {
  const out: Place[][] = [];
  for (let start = 0; start < cards.length;) {
    let end = start + 1;
    while (
      end < cards.length &&
      end - start < panels &&
      cards[end]!.group === cards[start]!.group
    ) {
      end++;
    }
    const run = cards.slice(start, end);
    const count = run.length;
    const faces = run.flatMap((card) => [card.front, card.back]);
    const chunk = out.length;
    out.push(
      run.map((card, i) => {
        const front = order === "leporello" ? faces[i] : faces[2 * i];
        const back = order === "leporello" ? faces[2 * count - 1 - i] : faces[2 * i + 1];
        return {
          index: start + i,
          name: card.name,
          cardTypeId: card.cardTypeId,
          ...(front === undefined ? {} : { front }),
          ...(back === undefined ? {} : { back }),
          ...(count > 1 ? { fold: { chunk, panel: i + 1, panels: count } } : {}),
        };
      })
    );
    start = end;
  }
  return out;
}

/** A built deck onto pages: its settings are the composition's inputs, the baseline having answered whatever the block did not. */
export function composeDeck(deck: Deck): { pages: Page[]; grid: Grid } {
  const { settings } = deck;
  return composePages({
    cards: deck.cards,
    cardSize: deck.cardSize,
    paperSize: settings.paperSize ?? {
      ...PAPER_PRESETS[DEFAULT_PAPER_PRESET],
      orientation: "auto",
    },
    pageMargin: settings.pageMargin ?? 0,
    duplexFlip: settings.duplexFlip ?? "long-edge",
    cutMarks: settings.cutMarks ?? {},
    foldPanels: settings.foldPanels ?? 1,
    foldOrder: settings.foldOrder ?? "pairs",
  });
}

function at(grid: Grid, column: number, row: number): { x: number; y: number } {
  return {
    x: grid.originX + column * grid.card.width,
    y: grid.originY + row * grid.card.height,
  };
}

/**
 * Cut marks for a page: a cross at every corner of every card — four arms
 * along the two cuts that meet there, each `margin` clear of the corner.
 * An arm on a face is `length` long; an arm that leaves the block runs on
 * to the paper's edge, so every cut shows where it meets the edge and a
 * guillotine's gauge can be set against the line itself. At the block's
 * edge two arms go out and two lie on the faces; inside the block all four
 * lie on the faces, where a corner marks the only place a cut can be found
 * between cards packed without a gap. The document paints the marks over
 * the cards, so what stays on a cut card is a stub of each arm at each
 * corner, the same on every card wherever it printed. A corner shared by
 * several cards is marked once. Positions come from the cells as placed,
 * so a back page's marks mirror with its cards; the block is centred, so
 * its edges are the same either way round.
 *
 * A grid that holds one card gets no marks: that page is the card, or as
 * good as — a sheet for a screen, not for the guillotine. The rule reads
 * the grid, not the page, so the last page of a deck, part-filled, is
 * marked like the ones before it.
 *
 * A fold is one piece of paper: its corners are marked, the ends of its
 * creases are not, and an arm that would run along a crease is left out
 * — it would say "cut here" where the paper is folded.
 */
export function cutMarks(cells: readonly Cell[], grid: Grid, marks: CutMarks): Line[] {
  if (!marks.enabled || cells.length === 0) return [];
  if (grid.columns * grid.rows < 2) return [];
  const length = marks.length ?? 3;
  const gap = marks.margin ?? 0;
  const { width, height } = grid.card;
  const { pieces, creases } = paperPieces(cells, grid);

  // Keyed on the printed value: a corner reached from two pieces is the
  // same corner, whatever the last bit of the arithmetic said.
  const corners = new Map<string, { x: number; y: number }>();
  for (const piece of pieces) {
    for (const x of [piece.x, piece.x + piece.width]) {
      for (const y of [piece.y, piece.y + height]) {
        const key = `${mm(x)},${mm(y)}`;
        if (!corners.has(key)) corners.set(key, { x, y });
      }
    }
  }
  // A crease end, with the way the crease runs from it.
  const alongCrease = new Set<string>();
  for (const c of creases) {
    alongCrease.add(`${mm(c.x1)},${mm(c.y1)},down`);
    alongCrease.add(`${mm(c.x2)},${mm(c.y2)},up`);
  }

  const block = {
    left: mm(grid.originX),
    right: mm(grid.originX + grid.columns * width),
    top: mm(grid.originY),
    bottom: mm(grid.originY + grid.rows * height),
  };
  const out: Line[] = [];
  const arm = (line: Line) => {
    // An arm that would start on or past its end — a block flush with the
    // paper's edge, a gap wider than the margin — is nothing to draw.
    if (line.x1 === line.x2 ? line.y1 < line.y2 : line.x1 < line.x2) out.push(line);
  };
  for (const { x, y } of corners.values()) {
    const up = mm(y) === block.top ? 0 : y - gap - length;
    const down = mm(y) === block.bottom ? grid.paper.height : y + gap + length;
    const left = mm(x) === block.left ? 0 : x - gap - length;
    const right = mm(x) === block.right ? grid.paper.width : x + gap + length;
    const key = `${mm(x)},${mm(y)}`;
    if (!alongCrease.has(`${key},up`)) arm({ x1: x, y1: up, x2: x, y2: y - gap });
    if (!alongCrease.has(`${key},down`)) arm({ x1: x, y1: y + gap, x2: x, y2: down });
    arm({ x1: left, y1: y, x2: x - gap, y2: y });
    arm({ x1: x + gap, y1: y, x2: right, y2: y });
  }
  return out;
}

/**
 * Fold marks for a page: at each end of every crease, an arm running on
 * from it the way a cut arm would — `margin` clear, `length` long, to the
 * paper's edge where the crease ends at the block's — drawn dashed, so a
 * fold is never taken for a cut. An end where a cut meets the crease gets
 * none: the cut's own arm is there. They follow the cut marks: on, off,
 * colour and weight alike.
 */
export function foldMarks(cells: readonly Cell[], grid: Grid, marks: CutMarks): Line[] {
  if (!marks.enabled) return [];
  const { pieces, creases } = paperPieces(cells, grid);
  if (creases.length === 0) return [];
  const length = marks.length ?? 3;
  const gap = marks.margin ?? 0;
  const { height } = grid.card;
  const corners = new Set<string>();
  for (const piece of pieces) {
    for (const x of [piece.x, piece.x + piece.width]) {
      for (const y of [piece.y, piece.y + height]) corners.add(`${mm(x)},${mm(y)}`);
    }
  }
  const top = mm(grid.originY);
  const bottom = mm(grid.originY + grid.rows * height);
  const out: Line[] = [];
  for (const { x1: x, y1: start, y2: end } of creases) {
    if (!corners.has(`${mm(x)},${mm(start)}`)) {
      const from = mm(start) === top ? 0 : start - gap - length;
      if (from < start - gap) out.push({ x1: x, y1: from, x2: x, y2: start - gap });
    }
    if (!corners.has(`${mm(x)},${mm(end)}`)) {
      const to = mm(end) === bottom ? grid.paper.height : end + gap + length;
      if (end + gap < to) out.push({ x1: x, y1: end + gap, x2: x, y2: to });
    }
  }
  return out;
}

/**
 * The pieces of paper a page is cut into — a card, or a fold's panels
 * together — and the creases inside them, top to bottom.
 */
function paperPieces(
  cells: readonly Cell[],
  grid: Grid
): { pieces: { x: number; y: number; width: number }[]; creases: Line[] } {
  const { width, height } = grid.card;
  const pieces: { x: number; y: number; width: number }[] = [];
  const creases: Line[] = [];
  const folds = new Map<number, Cell[]>();
  for (const cell of cells) {
    if (cell.fold === undefined) pieces.push({ x: cell.x, y: cell.y, width });
    else {
      const panels = folds.get(cell.fold.chunk) ?? [];
      panels.push(cell);
      folds.set(cell.fold.chunk, panels);
    }
  }
  for (const panels of folds.values()) {
    const left = Math.min(...panels.map((cell) => cell.x));
    const y = panels[0]!.y;
    pieces.push({ x: left, y, width: panels.length * width });
    for (let i = 1; i < panels.length; i++) {
      creases.push({ x1: left + i * width, y1: y, x2: left + i * width, y2: y + height });
    }
  }
  return { pieces, creases };
}

/** The marks of a page as an SVG the size of the paper, its units millimetres; the fold marks dashed. */
export function cutMarksSvg(page: Page, grid: Grid, marks: CutMarks): string {
  if (page.marks.length === 0 && page.folds.length === 0) return "";
  const { width, height } = grid.paper;
  const stroke = marks.color ?? "#aaaaaa";
  const weight = marks.weight ?? 0.25;
  const line = (l: Line) =>
    `<line x1="${mm(l.x1)}" y1="${mm(l.y1)}" x2="${mm(l.x2)}" y2="${mm(l.y2)}"/>`;
  const lines = page.marks.map(line);
  if (page.folds.length > 0) {
    lines.push(
      `<g class="cs-fold-marks" stroke-dasharray="${mm(4 * weight)} ${mm(3 * weight)}">`,
      ...page.folds.map(line),
      "</g>"
    );
  }
  return (
    `<svg class="cs-cut-marks" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}" ` +
    `stroke="${stroke}" stroke-width="${weight}" xmlns="http://www.w3.org/2000/svg">` +
    lines.join("") +
    `</svg>`
  );
}

/** A millimetre value as an attribute: three decimals at most, no trailing zeros. */
export function mm(value: number): string {
  return String(Math.round(value * 1000) / 1000);
}

/**
 * The composition as text: page count, then per page each cell's side,
 * position, panel when it folds, and card name — what a reviewer reads
 * when a card moves.
 */
export function compositionText(pages: readonly Page[], grid: Grid): string {
  const lines = [
    `${pages.length} ${pages.length === 1 ? "page" : "pages"} · ${mm(grid.paper.width)} × ${mm(grid.paper.height)} mm · ${grid.columns} × ${grid.rows} of ${mm(grid.card.width)} × ${mm(grid.card.height)} mm at ${mm(grid.originX)}, ${mm(grid.originY)}${grid.panels > 1 ? ` · strips of ${grid.panels}` : ""}`,
  ];
  pages.forEach((page, i) => {
    lines.push(
      `${i + 1}. ${page.side} · ${page.marks.length} marks${page.folds.length > 0 ? ` · ${page.folds.length} fold marks` : ""}`
    );
    for (const cell of page.cells) {
      const panel = cell.fold ? `panel ${cell.fold.panel}/${cell.fold.panels} ` : "";
      lines.push(
        `   ${cell.side} #${cell.index + 1} at ${mm(cell.x)}, ${mm(cell.y)} ${panel}${cell.html === undefined ? "(empty) " : ""}${cell.cardTypeId}/${cell.name}`
      );
    }
  });
  return lines.join("\n") + "\n";
}
