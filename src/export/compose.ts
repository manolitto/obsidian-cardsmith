import type { PhysicalCard } from "../deck/copies";
import type { Deck } from "../deck/pipeline";
import type { CutMarks, DuplexFlip, Fold } from "../definitions/deck-settings";
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
 * A deck may fold: the physical cards of one note then print side by side
 * in one row, uncut, and the strip is folded instead of cut apart. A row
 * is laid out in millimetres: pieces of paper — a card, or a fold's panels
 * — edge to edge, a fold never breaking across a row. Nothing changes for
 * the back page: each panel's back lies behind it, mirrored about the
 * paper's centre, as any card's does. With a fold gap, the panels of a
 * fold stand that far apart, and the gap between two of them is a hinge:
 * printed as a strip to cut out, so that a laminate seals to itself there
 * and folds as film.
 */

/** The grid a deck is imposed in: the paper the right way round, and where the cards sit on it. */
export interface Grid {
  /** The paper as printed — width across, height down. */
  paper: { width: number; height: number };
  card: CardSize;
  /** How many cards fit across, edge to edge. */
  columns: number;
  rows: number;
  /** The block's top-left corner on the page. */
  originX: number;
  originY: number;
  /** The block's width: its widest row, never less than `columns` cards. */
  width: number;
  /** The width the margin leaves for a row. */
  usable: number;
  /** The hinge between two panels of a fold, in millimetres; 0 folds along a crease. */
  gap: number;
  /** A `cover`'s outer hinge, between the cover and the last page, when it wraps panels folded inside. */
  gapOuter: number;
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
  /** The hinges to cut out, on a front page whose deck folds with a gap. */
  hinges: Rect[];
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
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
  /** Absent: `off`. */
  fold?: Fold;
  /** Millimetres between the panels of a fold; absent or under `off`, none. */
  foldGap?: number;
  /** A `cover`'s outer hinge, when it wraps panels folded inside; absent, `foldGap`. Needs a `foldGap`. */
  foldGapOuter?: number;
}

/**
 * Lay the grid out. `auto` orientation tries the paper both ways and takes
 * the one that holds more cards, portrait on a tie. A card that does not
 * fit the paper even once is an error naming both. `minColumns` — two for
 * a deck that folds — has `auto` count only the cards that fit in runs of
 * that many across, so it never picks a way round with fewer, and a fixed
 * one with fewer is an error of its own.
 */
export function layoutGrid(
  paper: PaperSize,
  card: CardSize,
  pageMargin: number,
  minColumns = 1
): Grid {
  const short = Math.min(paper.width, paper.height);
  const long = Math.max(paper.width, paper.height);
  const portrait = fit({ width: short, height: long }, card, pageMargin);
  const landscape = fit({ width: long, height: short }, card, pageMargin);
  // Counted in runs of `minColumns`: a folding deck's place left over at
  // the end of an odd row holds a single card at best.
  const holds = (g: Grid) => Math.floor(g.columns / minColumns) * minColumns * g.rows;
  const chosen =
    paper.orientation === "portrait"
      ? portrait
      : paper.orientation === "landscape"
        ? landscape
        : holds(landscape) > holds(portrait)
          ? landscape
          : portrait;

  const where = `${chosen.paper.width} × ${chosen.paper.height} mm paper`;
  if (chosen.columns < 1 || chosen.rows < 1) {
    throw new Error(`A ${card.width} × ${card.height} mm card does not fit on ${where}`);
  }
  if (chosen.columns < minColumns) {
    throw new Error(
      `A fold needs ${minColumns} ${card.width} × ${card.height} mm cards side by side, and ${where} holds ${chosen.columns}`
    );
  }
  return chosen;
}

/** The grid on the paper this way round. The margin yields, per axis, where it would not leave room for one card. */
function fit(
  paper: { width: number; height: number },
  card: CardSize,
  margin: number
): Grid {
  const marginX = Math.min(margin, Math.max(0, (paper.width - card.width) / 2));
  const marginY = Math.min(margin, Math.max(0, (paper.height - card.height) / 2));
  const usableWidth = paper.width - 2 * marginX;
  const usableHeight = paper.height - 2 * marginY;
  const columns = Math.max(0, Math.floor(usableWidth / card.width));
  const rows = Math.max(0, Math.floor(usableHeight / card.height));
  return {
    paper,
    card,
    columns,
    rows,
    originX: marginX + (usableWidth - columns * card.width) / 2,
    originY: marginY + (usableHeight - rows * card.height) / 2,
    width: columns * card.width,
    usable: usableWidth,
    gap: 0,
    gapOuter: 0,
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
 * A folding deck places folds, not cards: each goes into the current row
 * when it fits what is left of it, else starts the next one — so the
 * deck's order is the print order, and a row's remainder stays empty
 * rather than taking a later card. A row is measured in millimetres, so
 * hinges of different widths sit side by side.
 */
export function composePages(deck: Composable): { pages: Page[]; grid: Grid } {
  const fold = deck.fold ?? "off";
  const plain = layoutGrid(
    deck.paperSize,
    deck.cardSize,
    deck.pageMargin,
    fold === "off" ? 1 : 2
  );
  const gap = fold === "off" ? 0 : (deck.foldGap ?? 0);
  const gapOuter = gap > 0 ? (deck.foldGapOuter ?? gap) : 0;
  const card = plain.card.width;
  const hinges = (count: number) => foldHinges(count, fold, gap, gapOuter);
  const widthOf = (count: number) =>
    count * card + hinges(count).reduce((sum, h) => sum + h, 0);

  // A fold reaches as far as its panels and hinges fit a row.
  let reach = 1;
  while (fold !== "off" && widthOf(reach + 1) <= plain.usable + 1e-9) reach++;
  if (fold !== "off" && reach < 2) {
    throw new Error(
      `A fold needs 2 ${plain.card.width} × ${plain.card.height} mm cards side by side with a ${mm(gap)} mm hinge, and ${plain.paper.width} × ${plain.paper.height} mm paper holds 1`
    );
  }
  const pieces = foldPieces(deck.cards, fold, reach);

  // Rows in millimetres: each piece where it fits what is left of its row,
  // else at the start of the next; the deck's order is the print order.
  const placed: { piece: Place[]; row: number; x: number; offsets: number[] }[] = [];
  let row = 0;
  let cursor = 0;
  let widest = 0;
  for (const piece of pieces) {
    const width = widthOf(piece.length);
    if (cursor > 0 && cursor + width > plain.usable + 1e-9) {
      row++;
      cursor = 0;
    }
    // Each panel's left edge within the piece: the cards and hinges before it.
    const offsets = [0];
    for (const hinge of hinges(piece.length))
      offsets.push(offsets.at(-1)! + card + hinge);
    placed.push({ piece, row, x: cursor, offsets });
    cursor += width;
    widest = Math.max(widest, cursor);
  }

  // The block is the widest row, centred as a full row of cards would be,
  // so that a deck without folds sits where it always did.
  const width = Math.max(plain.width, widest);
  const grid: Grid = {
    ...plain,
    originX: plain.originX - (width - plain.width) / 2,
    width,
    gap,
    gapOuter,
  };
  const withBacks = pieces.some((piece) =>
    piece.some((place) => place.back !== undefined)
  );
  const sheets: { front: Cell[]; back: Cell[]; hinges: Rect[] }[] = [];

  for (const { piece, row, x, offsets } of placed) {
    const local = row % grid.rows;
    const sheet = (sheets[Math.floor(row / grid.rows)] ??= {
      front: [],
      back: [],
      hinges: [],
    });
    const y = grid.originY + local * grid.card.height;
    piece.forEach((place, i) => {
      const left = grid.originX + x + offsets[i]!;
      const common = {
        index: place.index,
        name: place.name,
        cardTypeId: place.cardTypeId,
        ...(place.fold === undefined ? {} : { fold: place.fold }),
      };
      sheet.front.push({
        ...common,
        side: "front",
        x: left,
        y,
        ...(place.front === undefined ? {} : { html: place.front }),
      });
      // Turned about the long edge, a place lands mirrored about the
      // paper's vertical centre line; about the short edge, its row does.
      sheet.back.push({
        ...common,
        side: "back",
        ...(deck.duplexFlip === "short-edge"
          ? { x: left, y: grid.originY + (grid.rows - 1 - local) * grid.card.height }
          : { x: grid.paper.width - left - grid.card.width, y }),
        ...(place.back === undefined ? {} : { html: place.back }),
      });
      const next = offsets[i + 1];
      if (gap > 0 && next !== undefined) {
        sheet.hinges.push({
          x: left + card,
          y,
          width: next - offsets[i]! - card,
          height: grid.card.height,
        });
      }
    });
  }

  const pages: Page[] = [];
  for (const { front, back, hinges } of sheets) {
    pages.push(page("front", front, grid, deck.cutMarks, hinges));
    if (withBacks) pages.push(page("back", back, grid, deck.cutMarks, []));
  }
  return { pages, grid };
}

function page(
  side: "front" | "back",
  cells: Cell[],
  grid: Grid,
  marks: CutMarks,
  hinges: Rect[]
): Page {
  return {
    side,
    cells,
    marks: cutMarks(cells, grid, marks),
    folds: foldMarks(cells, grid, marks),
    // The knife works from the front; behind a hinge there is no paper left.
    hinges,
  };
}

/**
 * The hinges of a fold of `count` panels, left to right: `gap` each, but
 * for a `cover` of three panels or more, whose cover wraps the panels
 * folded accordion-wise inside it — its outer hinge, between the last
 * page and the cover, is `gapOuter`.
 */
function foldHinges(count: number, fold: Fold, gap: number, gapOuter: number): number[] {
  return Array.from({ length: Math.max(0, count - 1) }, (_, i) =>
    fold === "cover" && count >= 3 && i === count - 2 ? gapOuter : gap
  );
}

/** One place on the paper — a card, or a panel of a fold — with the faces that go on it. */
interface Place {
  index: number;
  name: string;
  cardTypeId: string;
  front?: string;
  back?: string;
  fold?: { chunk: number; panel: number; panels: number };
}

/**
 * The deck's cards as pieces of paper, each a run of places side by side.
 * A note printing's cards — one `group` — fold together; a run of one is a
 * card as it is, whatever the fold, and with `off` every card is. The
 * faces are numbered in reading order, the first card's front 1, its back
 * 2, the second card's front 3, and on:
 *
 * - `strip` reads 1 to `k` across the front, page 1 on the left with its
 *   fold on the right, and turned over like a page, on across the back —
 *   unfolded, a strip with a front and a back;
 * - `cover` puts page 1 on the right with its fold on the left, the last
 *   pages before it — `k + 2` to `2k`, then 1 — and 2 to `k + 1` across
 *   the back, so that folded inwards page 1 is a cover and the last page
 *   lies behind it;
 *
 * both as far as a row reaches, the rest a further piece. `booklet` is a
 * printer's booklet: the faces padded with blank pages to a multiple of
 * four, then sheets of two panels, nested — of eight, the outer sheet
 * 8 | 1 with 2 | 7 behind it, the inner 6 | 3 with 4 | 5.
 */
function foldPieces(
  cards: readonly PhysicalCard[],
  fold: Fold,
  reach: number
): Place[][] {
  const out: Place[][] = [];
  let index = 0;
  const place = (
    card: PhysicalCard,
    front: string | undefined,
    back: string | undefined,
    panel: number,
    panels: number
  ): Place => ({
    index: index++,
    name: card.name,
    cardTypeId: card.cardTypeId,
    ...(front === undefined ? {} : { front }),
    ...(back === undefined ? {} : { back }),
    ...(panels > 1 ? { fold: { chunk: out.length, panel, panels } } : {}),
  });

  for (let start = 0; start < cards.length;) {
    const longest = fold === "off" ? 1 : fold === "booklet" ? Infinity : reach;
    let end = start + 1;
    while (
      end < cards.length &&
      end - start < longest &&
      cards[end]!.group === cards[start]!.group
    ) {
      end++;
    }
    const run = cards.slice(start, end);
    start = end;
    const faces = run.flatMap((card) => [card.front, card.back]);
    const count = run.length;

    if (count === 1) {
      out.push([place(run[0]!, faces[0], faces[1], 1, 1)]);
    } else if (fold === "booklet") {
      const pages = 4 * Math.ceil(count / 2);
      const face = (n: number) => faces[n - 1];
      for (let sheet = 0; sheet < pages / 4; sheet++) {
        const card = run[0]!;
        const outer = pages - 2 * sheet;
        const inner = 1 + 2 * sheet;
        out.push([
          place(card, face(outer), face(outer - 1), 1, 2),
          place(card, face(inner), face(inner + 1), 2, 2),
        ]);
      }
    } else {
      // Panel `n` of `count`, counted from the left on the front; what lies
      // behind it shows mirrored when the strip is turned over.
      const face = (n: number) => faces[n - 1];
      out.push(
        run.map((card, i) => {
          const n = i + 1;
          return fold === "cover"
            ? place(
                card,
                face(n < count ? count + 1 + n : 1),
                face(count + 2 - n),
                n,
                count
              )
            : place(card, face(n), face(2 * count + 1 - n), n, count);
        })
      );
    }
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
    fold: settings.fold ?? "off",
    foldGap: settings.foldGap ?? 0,
    ...(settings.foldGapOuter === undefined
      ? {}
      : { foldGapOuter: settings.foldGapOuter }),
  });
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
 * — it would say "cut here" where the paper is folded. A fold with a gap
 * is a card per panel again, every corner marked: the crosses either side
 * of a hinge are the four cuts that take it out.
 */
export function cutMarks(cells: readonly Cell[], grid: Grid, marks: CutMarks): Line[] {
  if (!marks.enabled || cells.length === 0) return [];
  if (grid.columns * grid.rows < 2) return [];
  const length = marks.length ?? 3;
  const gap = marks.margin ?? 0;
  const { height } = grid.card;
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
    right: mm(grid.originX + grid.width),
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
 * together — and the creases inside them, top to bottom. With a hinge
 * between its panels a fold has no crease on paper: each panel is a piece
 * of its own.
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
    if (cell.fold === undefined || grid.gap > 0) {
      pieces.push({ x: cell.x, y: cell.y, width });
      continue;
    }
    const panels = folds.get(cell.fold.chunk) ?? [];
    panels.push(cell);
    folds.set(cell.fold.chunk, panels);
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

/**
 * The marks of a page as an SVG the size of the paper, its units
 * millimetres: the hinges first, filled light in the marks' colour —
 * drawn whether or not the marks are, being what to cut out rather than a
 * mark — then the cut marks, then the fold marks dashed.
 */
export function cutMarksSvg(page: Page, grid: Grid, marks: CutMarks): string {
  if (page.marks.length === 0 && page.folds.length === 0 && page.hinges.length === 0)
    return "";
  const { width, height } = grid.paper;
  const stroke = marks.color ?? "#aaaaaa";
  const weight = marks.weight ?? 0.25;
  const line = (l: Line) =>
    `<line x1="${mm(l.x1)}" y1="${mm(l.y1)}" x2="${mm(l.x2)}" y2="${mm(l.y2)}"/>`;
  const lines: string[] = [];
  if (page.hinges.length > 0) {
    lines.push(
      `<g class="cs-hinges" fill="${stroke}" fill-opacity="0.6" stroke="none">`,
      ...page.hinges.map(
        (r) =>
          `<rect x="${mm(r.x)}" y="${mm(r.y)}" width="${mm(r.width)}" height="${mm(r.height)}"/>`
      ),
      "</g>"
    );
  }
  lines.push(...page.marks.map(line));
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
    `${pages.length} ${pages.length === 1 ? "page" : "pages"} · ${mm(grid.paper.width)} × ${mm(grid.paper.height)} mm · ${grid.columns} × ${grid.rows} of ${mm(grid.card.width)} × ${mm(grid.card.height)} mm at ${mm(grid.originX)}, ${mm(grid.originY)}${grid.gap > 0 ? ` · gap ${mm(grid.gap)} mm${grid.gapOuter !== grid.gap ? `, outer ${mm(grid.gapOuter)} mm` : ""}` : ""}`,
  ];
  pages.forEach((page, i) => {
    lines.push(
      `${i + 1}. ${page.side} · ${page.marks.length} marks${page.folds.length > 0 ? ` · ${page.folds.length} fold marks` : ""}${page.hinges.length > 0 ? ` · ${page.hinges.length} ${page.hinges.length === 1 ? "hinge" : "hinges"}` : ""}`
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
