import { describe, expect, it } from "vitest";
import type { PhysicalCard } from "../src/deck/copies";
import type { Fold } from "../src/definitions/card-settings";
import type { Deck } from "../src/deck/pipeline";
import { exportDocument } from "../src/export/document";
import {
  composePages,
  compositionText,
  cutMarks,
  cutMarksSvg,
  layoutGrid,
  type Cell,
  type Composable,
  type Page,
  hingesSvg,
} from "../src/export/compose";
import { CARD_PRESETS, type CardPreset } from "../src/model/card-size";
import { parsePaperSize, type PaperSize } from "../src/model/paper-size";

const paper = (s: string): PaperSize => parsePaperSize(s)!;
const card = (p: CardPreset) => CARD_PRESETS[p];

function cards(count: number, faces: "both" | "front" = "both"): PhysicalCard[] {
  return Array.from({ length: count }, (_, i) => ({
    name: `Card ${i + 1}`,
    cardTypeId: "gear",
    group: i,
    front: `<div>front ${i + 1}</div>`,
    ...(faces === "both" ? { back: `<div>back ${i + 1}</div>` } : {}),
  }));
}

/**
 * A deck; `fold` is the cards' fold setting and `gap` / `outerGap` / `cutOut`
 * their hinge settings, so they go onto every card, as a deck block's would.
 */
const deck = ({
  fold,
  gap,
  outerGap,
  cutOut,
  ...over
}: Partial<Composable> & {
  fold?: Fold;
  gap?: number;
  outerGap?: number;
  cutOut?: boolean;
} = {}): Composable => {
  const composed: Composable = {
    cards: cards(6),
    cardSize: card("poker"),
    paperSize: paper("140 x 280"),
    pageMargin: 0,
    duplexFlip: "long-edge",
    cutMarks: { enabled: true, length: 3, margin: 0, color: "#aaaaaa", weight: 0.25 },
    ...over,
  };
  const folded =
    fold === undefined
      ? composed
      : { ...composed, cards: composed.cards.map((c) => ({ ...c, fold })) };
  if (gap === undefined && outerGap === undefined && cutOut === undefined) return folded;
  return {
    ...folded,
    cards: folded.cards.map((c) => ({
      ...c,
      hinge: {
        ...c.hinge,
        ...(gap === undefined ? {} : { gap }),
        ...(outerGap === undefined ? {} : { outerGap }),
        ...(cutOut === undefined ? {} : { cutOut }),
      },
    })),
  };
};

describe("layoutGrid", () => {
  it("packs each preset onto A4 both ways round, inside a 10 mm margin", () => {
    const counts = (p: CardPreset, orientation: string) => {
      const g = layoutGrid(paper(`A4 ${orientation}`), card(p), 10);
      return `${g.columns}x${g.rows}`;
    };
    expect(counts("mini", "portrait")).toBe("4x4");
    expect(counts("mini", "landscape")).toBe("6x3");
    expect(counts("poker", "portrait")).toBe("3x3");
    expect(counts("poker", "landscape")).toBe("4x2");
    expect(counts("tarot", "portrait")).toBe("2x2");
    expect(counts("tarot", "landscape")).toBe("3x1");
    expect(counts("large", "portrait")).toBe("2x2");
    expect(counts("large", "landscape")).toBe("3x1");
  });

  it("lets auto pick whichever way holds more, portrait on a tie", () => {
    // Mini: 18 landscape against 16 portrait. Poker: 9 portrait against 8.
    expect(layoutGrid(paper("A4"), card("mini"), 10).paper).toEqual({
      width: 297,
      height: 210,
    });
    expect(layoutGrid(paper("A4"), card("poker"), 10).paper).toEqual({
      width: 210,
      height: 297,
    });
    // A square card ties 3 × 4 against 4 × 3.
    expect(layoutGrid(paper("A4"), { width: 60, height: 60 }, 10).paper).toEqual({
      width: 210,
      height: 297,
    });
  });

  it("centres the block inside the margin", () => {
    const g = layoutGrid(paper("A4 portrait"), card("poker"), 10);
    expect(g.originX).toBeCloseTo(10 + (190 - 189) / 2);
    expect(g.originY).toBeCloseTo(10 + (277 - 264) / 2);
  });

  it("makes a paper that is the card one borderless card, whatever the margin", () => {
    for (const size of ["poker", "63 x 88"]) {
      expect(layoutGrid(paper(size), card("poker"), 10)).toMatchObject({
        paper: { width: 63, height: 88 },
        columns: 1,
        rows: 1,
        originX: 0,
        originY: 0,
      });
    }
    // A card preset as paper turns with the card.
    expect(layoutGrid(paper("poker"), { width: 88, height: 63 }, 10)).toMatchObject({
      paper: { width: 88, height: 63 },
      columns: 1,
      rows: 1,
      originX: 0,
      originY: 0,
    });
    expect(layoutGrid(paper("large"), card("large"), 25)).toMatchObject({
      paper: { width: 88.9, height: 127 },
      columns: 1,
      rows: 1,
      originX: 0,
      originY: 0,
    });
  });

  it("keeps the card its size and lets the margin yield, on the axis where it must", () => {
    // 100 wide leaves 37 for two margins around a 63 mm card; 297 high keeps the 25.
    const g = layoutGrid(paper("100 x 297"), card("poker"), 25);
    expect(g).toMatchObject({ columns: 1, rows: 2, originX: 18.5 });
    expect(g.originY).toBeCloseTo(25 + (247 - 176) / 2);
  });

  it("refuses a card that does not fit the paper even once, naming both", () => {
    expect(() => layoutGrid(paper("100 x 100"), card("tarot"), 10)).toThrow(
      "A 70 × 120 mm card does not fit on 100 × 100 mm paper"
    );
  });
});

describe("composePages", () => {
  const positions = (page: { cells: { index: number; x: number; y: number }[] }) =>
    page.cells.map((c) => `${c.index + 1}@${c.x},${c.y}`);

  it("fills a 2 × 3 grid in reading order and mirrors the backs about the long edge", () => {
    const { pages, grid } = composePages(deck());
    expect([grid.columns, grid.rows]).toEqual([2, 3]);
    expect(pages.map((p) => p.side)).toEqual(["front", "back"]);
    expect(positions(pages[0]!)).toEqual([
      "1@7,8",
      "2@70,8",
      "3@7,96",
      "4@70,96",
      "5@7,184",
      "6@70,184",
    ]);
    // Columns swap within each row; the sheet turns left to right.
    expect(positions(pages[1]!)).toEqual([
      "1@70,8",
      "2@7,8",
      "3@70,96",
      "4@7,96",
      "5@70,184",
      "6@7,184",
    ]);
    expect(pages[1]!.cells[0]!.html).toBe("<div>back 1</div>");
  });

  it("mirrors the rows about the short edge", () => {
    const { pages } = composePages(deck({ duplexFlip: "short-edge" }));
    expect(positions(pages[1]!)).toEqual([
      "1@7,184",
      "2@70,184",
      "3@7,96",
      "4@70,96",
      "5@7,8",
      "6@70,8",
    ]);
  });

  it("goes on to further sheets, the last one part-filled, and mirrors what is there", () => {
    const { pages } = composePages(deck({ cards: cards(8) }));
    expect(pages.map((p) => `${p.side}:${p.cells.length}`)).toEqual([
      "front:6",
      "back:6",
      "front:2",
      "back:2",
    ]);
    expect(positions(pages[2]!)).toEqual(["7@7,8", "8@70,8"]);
    expect(positions(pages[3]!)).toEqual(["7@70,8", "8@7,8"]);
  });

  it("prints no back page for a deck of fronts, and every back page for a deck with one back", () => {
    expect(
      composePages(deck({ cards: cards(8, "front") })).pages.map((p) => p.side)
    ).toEqual(["front", "front"]);
    const mixed = [...cards(7, "front"), ...cards(1)];
    const { pages } = composePages(deck({ cards: mixed }));
    expect(pages.map((p) => p.side)).toEqual(["front", "back", "front", "back"]);
    // The one back sits on the second sheet; the first back page is all empty places.
    expect(pages[1]!.cells.every((c) => c.html === undefined)).toBe(true);
    expect(pages[3]!.cells.map((c) => c.html !== undefined)).toEqual([false, true]);
  });
});

describe("cut marks", () => {
  it("are a cross of four arms at every corner of every card, shared corners once", () => {
    const { pages, grid } = composePages(deck());
    const marks = pages[0]!.marks;
    // A full 2 × 3 page has 3 × 4 distinct corners.
    expect(marks).toHaveLength(12 * 4);
    const vertical = marks.filter((l) => l.x1 === l.x2);
    const horizontal = marks.filter((l) => l.y1 === l.y2);
    expect(vertical).toHaveLength(24);
    expect(horizontal).toHaveLength(24);
    expect([...new Set(vertical.map((l) => l.x1))].sort((a, b) => a - b)).toEqual([
      7, 70, 133,
    ]);
    expect([...new Set(horizontal.map((l) => l.y1))].sort((a, b) => a - b)).toEqual([
      8, 96, 184, 272,
    ]);
    // The top-left corner: up and left out to the paper's edge, down and right on the card.
    const at = (x: number, y: number) =>
      marks.filter((l) => (l.x1 === x && l.x2 === x) || (l.y1 === y && l.y2 === y));
    expect(at(7, 8)).toEqual(
      expect.arrayContaining([
        { x1: 7, y1: 0, x2: 7, y2: 8 },
        { x1: 7, y1: 8, x2: 7, y2: 11 },
        { x1: 0, y1: 8, x2: 7, y2: 8 },
        { x1: 7, y1: 8, x2: 10, y2: 8 },
      ])
    );
    // The bottom-right corner likewise, out to the far edges.
    expect(at(133, 272)).toEqual(
      expect.arrayContaining([
        { x1: 133, y1: 272, x2: 133, y2: 280 },
        { x1: 133, y1: 272, x2: 140, y2: 272 },
      ])
    );
    // An inner corner, shared by four cards: its four arms once.
    const y = grid.originY + 88;
    expect(marks.filter((l) => l.x1 === 70 && l.x2 === 70 && l.y2 === y)).toHaveLength(1);
    expect(marks.filter((l) => l.x1 === 70 && l.x2 === 70 && l.y1 === y)).toHaveLength(1);
    expect(marks.filter((l) => l.y1 === y && l.y2 === y && l.x2 === 70)).toHaveLength(1);
    expect(marks.filter((l) => l.y1 === y && l.y2 === y && l.x1 === 70)).toHaveLength(1);
  });

  it("keep a margin from the corner, and mirror with the backs on a part-filled page", () => {
    const { pages } = composePages(
      deck({ cards: cards(1), cutMarks: { enabled: true, length: 4, margin: 1 } })
    );
    const front = pages[0]!.marks;
    // Four corners; no arm runs to its right, where no other card is cut, and
    // the cut along its foot runs down into the margin, as the last row's does:
    // 4 × 4 arms less the two right.
    expect(front).toHaveLength(4 * 4 - 2);
    expect(front.find((l) => l.x1 === 7 && l.y2 === 8 - 1)).toMatchObject({ y1: 0 });
    expect(front.find((l) => l.x1 === 7 && l.y1 === 8 + 1)).toMatchObject({ y2: 8 + 5 });
    // A lower corner: its arm runs up the card's own edge, and down to the paper's.
    expect(front.find((l) => l.x1 === 7 && l.y2 === 96 - 1)).toMatchObject({
      y1: 96 - 5,
    });
    expect(front.find((l) => l.x1 === 7 && l.y1 === 96 + 1)).toMatchObject({ y2: 280 });
    // The one card's back sits in the other column, and its marks with it.
    const back = pages[1]!.marks;
    const xs = [...new Set(back.filter((l) => l.x1 === l.x2).map((l) => l.x1))];
    expect(xs.sort((a, b) => a - b)).toEqual([70, 133]);
  });

  it("run into the margin below a part-filled sheet's last row, and above it on a back turned about the short edge", () => {
    // Two cards in the top row of a sheet three rows high.
    const long = composePages(deck({ cards: cards(2) }));
    const down = (page: Page) => page.marks.filter((l) => l.x1 === l.x2 && l.y2 === 280);
    expect(down(long.pages[0]!).map((l) => [l.x1, l.y1])).toEqual([
      [7, 96],
      [70, 96],
      [133, 96],
    ]);
    // Turned about the short edge, the backs sit in the bottom row: the cuts leave
    // them at the top, where the front's run along the block.
    const short = composePages(deck({ cards: cards(2), duplexFlip: "short-edge" }));
    const back = short.pages[1]!;
    expect(back.cells.every((c) => c.y === 184)).toBe(true);
    const up = back.marks.filter((l) => l.x1 === l.x2 && l.y1 === 0);
    expect(up.map((l) => [l.x1, l.y2])).toEqual([
      [7, 184],
      [70, 184],
      [133, 184],
    ]);
  });

  it("are none on a page that holds one card, and still there on a part-filled last page", () => {
    const single = composePages(deck({ cards: cards(1), paperSize: paper("poker") }));
    expect(single.grid).toMatchObject({ columns: 1, rows: 1 });
    expect(single.pages[0]!.marks).toEqual([]);

    const last = composePages(deck({ cards: cards(7) })).pages.at(-1)!;
    expect(last.cells).toHaveLength(1);
    expect(last.marks).toHaveLength(14);
  });

  it("draw no outward arm where the block is flush with the paper's edge", () => {
    // Two poker cards side by side on paper exactly their width: nothing lies left or right.
    const { pages } = composePages(
      deck({ cards: cards(2), paperSize: paper("126 x 100") })
    );
    const marks = pages[0]!.marks;
    // Six corners, three arms each on the outer ones and four on the shared pair — none off the paper.
    expect(marks).toHaveLength(4 * 3 + 2 * 4);
    expect(marks.every((l) => l.x1 >= 0 && l.x2 <= 126)).toBe(true);
    expect(
      marks.filter((l) => l.x1 === l.x2 && (l.y1 === 0 || l.y2 === 100))
    ).toHaveLength(6);
  });

  it("are none when switched off", () => {
    const grid = layoutGrid(paper("A4"), card("poker"), 10);
    expect(
      cutMarks(
        [{ index: 0, side: "front", name: "a", cardTypeId: "t", x: 10, y: 10 }],
        grid,
        { enabled: false }
      )
    ).toEqual([]);
  });

  it("render as an SVG in millimetres, with the stroke the settings say", () => {
    const { pages, grid } = composePages(deck({ cards: cards(1) }));
    const svg = cutMarksSvg(pages[0]!, grid, {
      enabled: true,
      color: "#ff0000",
      weight: 0.5,
    });
    expect(svg).toMatch(
      /^<svg class="cs-cut-marks" width="140mm" height="280mm" viewBox="0 0 140 280" stroke="#ff0000" stroke-width="0.5"/
    );
    expect(svg).toContain('<line x1="7" y1="0" x2="7" y2="8"/>');
    expect(svg).not.toContain("px");
    expect(cutMarksSvg({ ...pages[0]!, marks: [] }, grid, {})).toBe("");
  });
});

describe("compositionText", () => {
  it("reads as a page count, then each cell's side, place and name", () => {
    const { pages, grid } = composePages(
      deck({ cards: [...cards(1, "front"), ...cards(1)] })
    );
    expect(compositionText(pages, grid)).toBe(
      [
        "2 pages · 140 × 280 mm · 2 × 3 of 63 × 88 mm at 7, 8",
        "1. front · 24 marks",
        "   front #1 at 7, 8 gear/Card 1",
        "   front #2 at 70, 8 gear/Card 1",
        "2. back · 24 marks",
        "   back #1 at 70, 8 (empty) gear/Card 1",
        "   back #2 at 7, 8 gear/Card 1",
        "",
      ].join("\n")
    );
  });
});

describe("folding", () => {
  /** Notes by how many physical cards each spilled onto; faces named `<note><card>f` / `b`. */
  function notes(...counts: number[]): PhysicalCard[] {
    return counts.flatMap((count, group) => {
      const note = String.fromCharCode(65 + group);
      return Array.from({ length: count }, (_, i) => ({
        name: note,
        cardTypeId: "gear",
        group,
        front: `${note}${i + 1}f`,
        back: `${note}${i + 1}b`,
      }));
    });
  }
  const faces = (page: Page) => page.cells.map((c) => `${c.html ?? "-"}@${c.x},${c.y}`);
  /** Three poker cards across, three down, no margin. */
  const wide = paper("189 x 264");

  it("needs two cards across: auto turns the paper for it, a fixed way round that has one is refused", () => {
    // A wide card on narrow paper: one across and four down, or two by two — a tie
    // that portrait takes, unless the deck folds.
    const banner = { width: 100, height: 50 };
    const narrow: PaperSize = { width: 120, height: 210, orientation: "auto" };
    expect(layoutGrid(narrow, banner, 0).paper.width).toBe(120);
    expect(layoutGrid(narrow, banner, 0, 2)).toMatchObject({
      paper: { width: 210, height: 120 },
      columns: 2,
      rows: 2,
    });
    // Poker on A4: 3 × 3 portrait, 4 × 2 landscape. Folding, portrait holds six in pairs.
    expect(layoutGrid(paper("A4"), card("poker"), 10).paper.width).toBe(210);
    expect(layoutGrid(paper("A4"), card("poker"), 10, 2).paper.width).toBe(297);
    expect(() => layoutGrid(paper("A5 portrait"), card("large"), 0, 2)).toThrow(
      "A fold needs 2 88.9 × 127 mm cards side by side, and 148 × 210 mm paper holds 1"
    );
  });

  it("strip: 1, 2, 3 across the front, and 4, 5, 6 read across the back once turned over", () => {
    const { pages } = composePages(
      deck({ cards: notes(3), paperSize: wide, fold: "strip" })
    );
    expect(faces(pages[0]!)).toEqual(["A1f@0,0", "A1b@63,0", "A2f@126,0"]);
    expect(faces(pages[1]!)).toEqual(["A3b@126,0", "A3f@63,0", "A2b@0,0"]);
    const leftToRight = [...pages[1]!.cells].sort((a, b) => a.x - b.x).map((c) => c.html);
    expect(leftToRight).toEqual(["A2b", "A3f", "A3b"]);
    expect(pages[0]!.cells.map((c) => c.fold)).toEqual([
      { chunk: 0, panel: 1, panels: 3 },
      { chunk: 0, panel: 2, panels: 3 },
      { chunk: 0, panel: 3, panels: 3 },
    ]);
  });

  it("strip of two: 1, 2 on the front, 3, 4 behind them", () => {
    const { pages } = composePages(deck({ cards: notes(2), fold: "strip" }));
    expect(faces(pages[0]!)).toEqual(["A1f@7,8", "A1b@70,8"]);
    // Mirrored about the long edge: what lies behind the left panel is on the right.
    expect(faces(pages[1]!)).toEqual(["A2b@70,8", "A2f@7,8"]);
  });

  it("cover of two: 4 | 1 on the front, 2 | 3 behind — a greeting card", () => {
    const { pages } = composePages(deck({ cards: notes(2), fold: "cover" }));
    expect(faces(pages[0]!)).toEqual(["A2b@7,8", "A1f@70,8"]);
    expect(faces(pages[1]!)).toEqual(["A2f@70,8", "A1b@7,8"]);
  });

  it("cover of three: 5, 6, 1 across the front, 2, 3, 4 across the back once turned over", () => {
    const { pages } = composePages(
      deck({ cards: notes(3), paperSize: wide, fold: "cover" })
    );
    expect(faces(pages[0]!)).toEqual(["A3f@0,0", "A3b@63,0", "A1f@126,0"]);
    expect(faces(pages[1]!)).toEqual(["A2b@126,0", "A2f@63,0", "A1b@0,0"]);
  });

  it("cover of four: 6, 7, 8, 1 across the front, 2, 3, 4, 5 across the back", () => {
    const { pages } = composePages(
      deck({ cards: notes(4), paperSize: paper("252 x 88"), fold: "cover" })
    );
    const leftToRight = (page: Page) =>
      [...page.cells].sort((a, b) => a.x - b.x).map((c) => c.html);
    expect(leftToRight(pages[0]!)).toEqual(["A3b", "A4f", "A4b", "A1f"]);
    expect(leftToRight(pages[1]!)).toEqual(["A1b", "A2f", "A2b", "A3f"]);
  });

  it("booklet of eight pages: 8 | 1 with 2 | 7 behind, then 6 | 3 with 4 | 5", () => {
    const { pages } = composePages(deck({ cards: notes(4), fold: "booklet" }));
    // Faces 1–8 are A1f, A1b, A2f, A2b, A3f, A3b, A4f, A4b.
    expect(faces(pages[0]!)).toEqual(["A4b@7,8", "A1f@70,8", "A3b@7,96", "A2f@70,96"]);
    // Turned over, each sheet reads left to right: 2 | 7, then 4 | 5.
    expect(faces(pages[1]!)).toEqual(["A4f@70,8", "A1b@7,8", "A3f@70,96", "A2b@7,96"]);
    expect(pages[0]!.cells.map((c) => `${c.fold!.chunk}:${c.fold!.panel}`)).toEqual([
      "0:1",
      "0:2",
      "1:1",
      "1:2",
    ]);
  });

  it("booklet: a greeting card from two cards, blank pages at the end from three", () => {
    const two = composePages(deck({ cards: notes(2), fold: "booklet" }));
    expect(faces(two.pages[0]!)).toEqual(["A2b@7,8", "A1f@70,8"]);
    expect(faces(two.pages[1]!)).toEqual(["A2f@70,8", "A1b@7,8"]);
    // Six faces make eight pages: 7 and 8 are blank, the outer sheet's left panel empty.
    const three = composePages(deck({ cards: notes(3), fold: "booklet" }));
    expect(faces(three.pages[0]!)).toEqual([
      "-@7,8",
      "A1f@70,8",
      "A3b@7,96",
      "A2f@70,96",
    ]);
    expect(faces(three.pages[1]!)).toEqual([
      "-@70,8",
      "A1b@7,8",
      "A3f@70,96",
      "A2b@7,96",
    ]);
  });

  it("keeps each panel's back behind it under a short-edge flip", () => {
    const { pages } = composePages(
      deck({ cards: notes(2), fold: "strip", duplexFlip: "short-edge" })
    );
    expect(faces(pages[1]!)).toEqual(["A2b@7,184", "A2f@70,184"]);
  });

  it("never splits a note: three large cards turn A4 the wide way round", () => {
    const large = { cardSize: card("large"), paperSize: paper("A4"), pageMargin: 10 };
    const { pages, grid } = composePages(
      deck({ ...large, cards: notes(3), fold: "strip" })
    );
    expect(grid.paper).toEqual({ width: 297, height: 210 });
    expect(pages[0]!.cells.map((c) => c.fold?.panels)).toEqual([3, 3, 3]);
    // Two of them stay the narrow way round, as any deck of two-card folds did.
    expect(
      composePages(deck({ ...large, cards: notes(2), fold: "strip" })).grid.paper.width
    ).toBe(210);
  });

  it("takes the way round the widest fold needs, for every fold and card of the deck", () => {
    const large = { cardSize: card("large"), paperSize: paper("A4"), pageMargin: 10 };
    const { pages, grid } = composePages(
      deck({ ...large, cards: notes(2, 3, 1), fold: "strip" })
    );
    expect(grid).toMatchObject({ paper: { width: 297 }, columns: 3 });
    expect(pages[0]!.cells.map((c) => `${c.name}${c.fold?.panels ?? 1}`)).toEqual([
      "A2",
      "A2",
    ]);
  });

  it("refuses a fold wider than the paper, naming the note, rather than split it", () => {
    const large = { cardSize: card("large"), pageMargin: 10 };
    expect(() =>
      composePages(
        deck({ ...large, paperSize: paper("A4"), cards: notes(4), fold: "strip" })
      )
    ).toThrow(
      '"A": a strip of 4 88.9 × 127 mm cards is 355.6 mm across and does not fit 210 × 297 mm paper either way round — a fold is never split; give the deck wider paper or the note fewer cards'
    );
    expect(() =>
      composePages(
        deck({
          ...large,
          paperSize: paper("A4 portrait"),
          cards: notes(3),
          fold: "cover",
        })
      )
    ).toThrow(
      "a cover of 3 88.9 × 127 mm cards is 266.7 mm across and does not fit 210 × 297 mm paper, portrait"
    );
  });

  it("folds the notes that say so, and cuts apart the ones that do not", () => {
    const cards = notes(2, 2).map((c) =>
      c.group === 0 ? { ...c, fold: "strip" as const } : c
    );
    const { pages } = composePages(deck({ cards, paperSize: wide }));
    const front = pages.filter((p) => p.side === "front").flatMap((p) => p.cells);
    expect(front.map((c) => `${c.html}:${c.fold?.panels ?? 1}`)).toEqual([
      "A1f:2",
      "A1b:2",
      "B1f:1",
      "B2f:1",
    ]);
  });

  it("groups the pieces by shape, in the order the deck first reaches each, a shape to a sheet", () => {
    // Three across, three down: A, C and E are single cards, B and D two-card folds.
    // The singles share a sheet, the folds take the next, a row each; the places
    // count in print order.
    const { pages } = composePages(
      deck({ cards: notes(1, 2, 1, 2, 1), paperSize: wide, fold: "strip" })
    );
    expect(faces(pages[0]!)).toEqual(["A1f@0,0", "C1f@63,0", "E1f@126,0"]);
    expect(faces(pages[2]!)).toEqual(["B1f@0,0", "B1b@63,0", "D1f@0,88", "D1b@63,88"]);
    expect(
      pages
        .filter((p) => p.side === "front")
        .flatMap((p) => p.cells.map((c) => c.index + 1))
    ).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("starts a new shape on a new sheet even where the last has rows to spare", () => {
    // A third row stands empty on the folds' sheet; C, a single card, opens the next.
    const { pages } = composePages(
      deck({ cards: notes(2, 2, 1), paperSize: wide, fold: "strip" })
    );
    expect(faces(pages[0]!)).toEqual(["A1f@0,0", "A1b@63,0", "B1f@0,88", "B1b@63,88"]);
    expect(faces(pages[2]!)).toEqual(["C1f@0,0"]);
  });

  it("keeps the deck's order within a shape, and a deck of one shape as it comes", () => {
    const { pages } = composePages(
      deck({ cards: notes(2, 2, 2, 2), paperSize: paper("A4 landscape"), fold: "strip" })
    );
    expect(pages[0]!.cells.map((c) => c.name)).toEqual([
      "A",
      "A",
      "B",
      "B",
      "C",
      "C",
      "D",
      "D",
    ]);
    expect(pages[0]!.cells.map((c) => c.index)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("prints a note on one card as a card, and never folds two copies together", () => {
    const twice = [...notes(1), { ...notes(1)[0]!, group: 1 }];
    for (const fold of ["strip", "cover", "booklet"] as const) {
      const { pages } = composePages(deck({ cards: twice, fold }));
      expect(pages[0]!.cells.map((c) => c.fold)).toEqual([undefined, undefined]);
      expect(faces(pages[0]!)).toEqual(["A1f@7,8", "A1f@70,8"]);
    }
  });

  it("composes as it always did when off", () => {
    expect(composePages(deck({ fold: "off" }))).toEqual(composePages(deck()));
  });

  it("marks a fold's corners, not its crease, and puts a dashed fold mark where the crease meets the block's edge", () => {
    const { pages } = composePages(deck({ cards: notes(2), fold: "strip" }));
    const { marks, folds } = pages[0]!;
    // One piece of paper: four corners, nothing at the crease, its foot cut on
    // into the margin as the page's last row.
    expect(marks).toHaveLength(16);
    expect(marks.some((l) => l.x1 === 70 || l.x2 === 70)).toBe(false);
    // Out to the paper's edge at both ends: the fold is the page's only row.
    expect(folds).toEqual([
      { x1: 70, y1: 0, x2: 70, y2: 8 },
      { x1: 70, y1: 96, x2: 70, y2: 280 },
    ]);
    // The back page's crease sits where the panels' backs meet.
    expect(pages[1]!.folds.map((l) => l.x1)).toEqual([70, 70]);
  });

  it("draws no cut arm along a crease, and a fold mark only where it leaves the printed rows", () => {
    // Two folds, one above the other, on a sheet three rows high: the crease runs
    // through both, no mark between them, and out at the top and below the second.
    const { pages } = composePages(deck({ cards: notes(2, 2), fold: "strip" }));
    const { marks, folds } = pages[0]!;
    expect(marks.some((l) => l.x1 === 70 && l.x2 === 70)).toBe(false);
    expect(folds).toEqual([
      { x1: 70, y1: 0, x2: 70, y2: 8 },
      { x1: 70, y1: 184, x2: 70, y2: 280 },
    ]);
  });

  it("follows the cut marks off", () => {
    const { pages } = composePages(
      deck({ cards: notes(2), fold: "strip", cutMarks: { enabled: false } })
    );
    expect(pages[0]!.folds).toEqual([]);
  });

  it("dashes the fold marks in the SVG, and reads them in the composition text", () => {
    const { pages, grid } = composePages(deck({ cards: notes(2), fold: "strip" }));
    const svg = cutMarksSvg(pages[0]!, grid, { enabled: true, weight: 0.25 });
    expect(svg).toContain(
      '<g class="cs-fold-marks" stroke-dasharray="1 0.75"><line x1="70" y1="0" x2="70" y2="8"/>'
    );
    expect(cutMarksSvg({ ...pages[0]!, marks: [] }, grid, {})).toContain("cs-fold-marks");
    expect(compositionText(pages, grid).split("\n").slice(0, 4)).toEqual([
      "2 pages · 140 × 280 mm · 2 × 3 of 63 × 88 mm at 7, 8",
      "1. front · 16 marks · 2 fold marks",
      "   front #1 at 7, 8 panel 1/2 gear/A",
      "   front #2 at 70, 8 panel 2/2 gear/A",
    ]);
  });
});

describe("fold gaps", () => {
  const notes = (...counts: number[]): PhysicalCard[] =>
    counts.flatMap((count, group) => {
      const note = String.fromCharCode(65 + group);
      return Array.from({ length: count }, (_, i) => ({
        name: note,
        cardTypeId: "gear",
        group,
        front: `${note}${i + 1}f`,
        back: `${note}${i + 1}b`,
      }));
    });
  const faces = (page: Page) => page.cells.map((c) => `${c.html ?? "-"}@${c.x},${c.y}`);
  /** A two-card strip with a 3 mm hinge to cut out — the laminating case. */
  const hinged = (over: Partial<Composable> = {}) =>
    composePages(deck({ cards: notes(2), fold: "strip", gap: 3, cutOut: true, ...over }));

  it("stands the columns apart, the block centred, every back still behind its front", () => {
    const { pages, grid } = hinged();
    // 2 × 63 + 3 = 129 mm across 140.
    expect(grid).toMatchObject({ columns: 2, originX: 5.5, width: 129 });
    expect(faces(pages[0]!)).toEqual(["A1f@5.5,8", "A1b@71.5,8"]);
    expect(faces(pages[1]!)).toEqual(["A2b@71.5,8", "A2f@5.5,8"]);
    expect(faces(hinged({ duplexFlip: "short-edge" }).pages[1]!)).toEqual([
      "A2b@5.5,184",
      "A2f@71.5,184",
    ]);
  });

  it("puts no gap between separate cards: three poker cards across A4 portrait, a hinged fold and a card not", () => {
    const a4 = { paperSize: paper("A4 portrait"), pageMargin: 10, gap: 1.5 };
    const singles = composePages(deck({ ...a4, cards: notes(1, 1, 1), fold: "strip" }));
    expect(faces(singles.pages[0]!)).toEqual([
      "A1f@10.5,16.5",
      "B1f@73.5,16.5",
      "C1f@136.5,16.5",
    ]);
    // A fold and a card are two shapes, two sheets, each block centred.
    const mixed = composePages(deck({ ...a4, cards: notes(2, 1), fold: "strip" }));
    expect(faces(mixed.pages[0]!).map((f) => f.split("@")[1])).toEqual([
      "10.5,16.5",
      "75,16.5",
    ]);
    expect(faces(mixed.pages[2]!).map((f) => f.split("@")[1])).toEqual(["10.5,16.5"]);
  });

  it("prints a hinge between the panels of one fold, on the front page only", () => {
    const { pages } = hinged();
    expect(pages[0]!.hinges).toEqual([
      { x: 68.5, y: 8, width: 3, height: 88, color: "#ffffff" },
    ]);
    expect(pages[1]!.hinges).toEqual([]);
    // Two single cards side by side: the gap between them is paper, cut through later.
    expect(hinged({ cards: notes(1, 1) }).pages[0]!.hinges).toEqual([]);
    // Three panels, two hinges.
    const three = composePages(
      deck({ cards: notes(3), paperSize: paper("195 x 88"), fold: "cover", gap: 3 })
    );
    expect(three.pages[0]!.hinges.map((h) => h.x)).toEqual([63, 129]);
  });

  it("marks every panel's corners, so the crosses either side of a hinge are the cuts that take it out", () => {
    const { marks, folds } = hinged().pages[0]!;
    const xs = new Set(marks.filter((l) => l.x1 === l.x2).map((l) => l.x1));
    expect([...xs].sort((a, b) => a - b)).toEqual([5.5, 68.5, 71.5, 134.5]);
    expect(folds).toEqual([]);
  });

  it("keeps the hinges when the cut marks are off — they say what to cut out", () => {
    const { pages, grid } = hinged({ cutMarks: { enabled: false } });
    expect(pages[0]!.marks).toEqual([]);
    // Half a millimetre under the cards either side, so no seam of white shows.
    expect(hingesSvg(pages[0]!, grid)).toContain(
      '<rect x="68" y="8" width="4" height="88" fill="#ffffff"/>'
    );
    expect(cutMarksSvg(pages[0]!, grid, { enabled: false })).toBe("");
  });

  it("is no gap at 0, and none when the deck does not fold", () => {
    const strip = deck({ cards: notes(2), fold: "strip" });
    expect(composePages(deck({ cards: notes(2), fold: "strip", gap: 0 }))).toEqual(
      composePages(strip)
    );
    expect(composePages(deck({ gap: 3 }))).toEqual(composePages(deck()));
  });

  it("reads the gap and the hinges in the composition text", () => {
    const { pages, grid } = hinged();
    expect(compositionText(pages, grid).split("\n").slice(0, 2)).toEqual([
      "2 pages · 140 × 280 mm · 2 × 3 of 63 × 88 mm at 5.5, 8",
      "1. front · 32 marks · 1 hinge (3 mm)",
    ]);
  });

  it("gives a cover's outer hinge its own width once panels fold inside it", () => {
    const outer = { gap: 1.5, outerGap: 2.5, paperSize: paper("200 x 88") };
    const { pages, grid } = composePages(
      deck({ ...outer, cards: notes(3), fold: "cover" })
    );
    // 189 + 1.5 + 2.5 = 193 mm, centred on 200: 5, 6 | 1 with the wide hinge before the cover.
    expect(faces(pages[0]!)).toEqual(["A3f@3.5,0", "A3b@68,0", "A1f@133.5,0"]);
    expect(pages[0]!.hinges).toEqual([
      { x: 66.5, y: 0, width: 1.5, height: 88, color: "#ffffff" },
      { x: 131, y: 0, width: 2.5, height: 88, color: "#ffffff" },
    ]);
    // Behind each panel, mirrored about the paper's centre — the hinges are uneven, so the
    // middle panel's back lands a millimetre off its front's x, and exactly behind it.
    expect(faces(pages[1]!)).toEqual(["A2b@133.5,0", "A2f@69,0", "A1b@3.5,0"]);
    expect(compositionText(pages, grid).split("\n")[1]).toContain(
      "2 hinges (1.5, 2.5 mm)"
    );
    const hingeWidths = (
      cards: PhysicalCard[],
      fold: "cover" | "strip",
      size = "200 x 88"
    ) =>
      composePages(
        deck({ ...outer, paperSize: paper(size), cards, fold })
      ).pages[0]!.hinges.map((h) => h.width);
    // A greeting card folds round nothing; a strip folds zigzag; four panels widen only the outer one.
    expect(hingeWidths(notes(2), "cover")).toEqual([1.5]);
    expect(hingeWidths(notes(3), "strip")).toEqual([1.5, 1.5]);
    expect(hingeWidths(notes(4), "cover", "260 x 88")).toEqual([1.5, 1.5, 2.5]);
  });

  it("needs a fold gap for the outer one", () => {
    const { pages } = composePages(
      deck({
        cards: notes(3),
        paperSize: paper("200 x 88"),
        fold: "cover",
        outerGap: 2.5,
      })
    );
    expect(pages[0]!.hinges).toEqual([]);
  });

  it("paints each hinge in its own card's colour, escaped for the attribute", () => {
    const tinted = (color: string, group: number): PhysicalCard[] =>
      notes(2).map((c) => ({ ...c, group, hinge: { color } }));
    const { pages, grid } = composePages(
      deck({
        cards: [...tinted("#ff0000", 0), ...tinted('red" onload="x', 1)],
        fold: "strip",
        gap: 1.5,
      })
    );
    expect(pages[0]!.hinges.map((h) => h.color)).toEqual(["#ff0000", 'red" onload="x']);
    const svg = hingesSvg(pages[0]!, grid);
    expect(svg).toContain('fill="#ff0000"/>');
    expect(svg).toContain('fill="red&quot; onload=&quot;x"/>');
  });

  it("prints a hinge behind itself on the back page where its card asks for both sides", () => {
    const both = notes(2).map((c) => ({ ...c, hinge: { sides: "both" as const } }));
    const long = composePages(deck({ cards: both, fold: "strip", gap: 3 }));
    expect(long.pages[0]!.hinges.map((h) => h.x)).toEqual([68.5]);
    // 140 − 68.5 − 3: the strip lands behind itself, between the panels' backs.
    expect(long.pages[1]!.hinges).toEqual([
      { x: 68.5, y: 8, width: 3, height: 88, color: "#ffffff" },
    ]);
    const short = composePages(
      deck({ cards: both, fold: "strip", gap: 3, duplexFlip: "short-edge" })
    );
    expect(short.pages[1]!.hinges.map((h) => [h.x, h.y])).toEqual([[68.5, 184]]);
    // A card that says nothing keeps its back clean.
    expect(
      composePages(deck({ cards: notes(2), fold: "strip", gap: 3 })).pages[1]!.hinges
    ).toEqual([]);
  });

  it("puts uneven hinges behind themselves too", () => {
    const both = notes(3).map((c) => ({ ...c, hinge: { sides: "both" as const } }));
    const { pages } = composePages(
      deck({
        cards: both,
        fold: "cover",
        gap: 1.5,
        outerGap: 2.5,
        paperSize: paper("200 x 88"),
      })
    );
    // Front hinges at 66.5 (1.5) and 131 (2.5); behind them at 200 − x − width.
    expect(pages[1]!.hinges.map((h) => [h.x, h.width])).toEqual([
      [132, 1.5],
      [66.5, 2.5],
    ]);
  });

  it("takes each fold's hinge width from its own card", () => {
    const own = (gap: number, group: number): PhysicalCard[] =>
      notes(2).map((c) => ({ ...c, group, hinge: { gap } }));
    const { pages } = composePages(
      deck({
        cards: [...own(0.5, 0), ...own(1, 1), ...own(0, 2)],
        fold: "strip",
        paperSize: paper("A4"),
      })
    );
    // The third card folds along a crease: no hinge, a dashed fold mark instead.
    // Three widths, three shapes, three sheets.
    expect(
      pages.filter((p) => p.side === "front").map((p) => p.hinges.map((h) => h.width))
    ).toEqual([[0.5], [1], []]);
    expect(pages[4]!.folds.length).toBeGreaterThan(0);
  });

  it("keeps a strip that is not cut out as the fold's spine: one piece, a fold mark at each edge", () => {
    const { pages, grid } = composePages(
      deck({ cards: notes(2), fold: "strip", gap: 3 })
    );
    const { marks, folds, hinges } = pages[0]!;
    // The strip is still printed, between the panels.
    expect(hinges).toEqual([{ x: 68.5, y: 8, width: 3, height: 88, color: "#ffffff" }]);
    // One piece of paper: four corners, no cut along either edge of the strip.
    expect(marks).toHaveLength(16);
    expect(marks.some((l) => l.x1 === l.x2 && (l.x1 === 68.5 || l.x1 === 71.5))).toBe(
      false
    );
    // Dashed fold marks at both edges, out into the paper's margin, to score along.
    expect(folds).toEqual([
      { x1: 68.5, y1: 0, x2: 68.5, y2: 8 },
      { x1: 68.5, y1: 96, x2: 68.5, y2: 280 },
      { x1: 71.5, y1: 0, x2: 71.5, y2: 8 },
      { x1: 71.5, y1: 96, x2: 71.5, y2: 280 },
    ]);
    expect(compositionText(pages, grid).split("\n")[1]).toBe(
      "1. front · 16 marks · 4 fold marks · 1 hinge (3 mm)"
    );
  });

  it("puts no fold mark where two folds meet inside the block, and keeps the cut marks there", () => {
    // Two strips stacked on paper two rows high, 10 mm above and below: the
    // creases of the two meet between the rows.
    const { pages } = composePages(
      deck({ cards: notes(2, 2), fold: "strip", gap: 3, paperSize: paper("140 x 196") })
    );
    const { marks, folds } = pages[0]!;
    expect(folds).toEqual([
      { x1: 68.5, y1: 0, x2: 68.5, y2: 10 },
      { x1: 71.5, y1: 0, x2: 71.5, y2: 10 },
      { x1: 68.5, y1: 186, x2: 68.5, y2: 196 },
      { x1: 71.5, y1: 186, x2: 71.5, y2: 196 },
    ]);
    // The cut between the rows is still marked at the pieces' outer corners.
    expect(marks.some((l) => l.y1 === 98 && l.y2 === 98 && l.x2 <= 5.5)).toBe(true);
  });

  it("is painted under the cards in the document, the marks over them", () => {
    const { pages, grid } = hinged();
    const deckLike = { settings: {}, stylesheets: [] } as unknown as Deck;
    const html = exportDocument(deckLike, pages, grid, "t");
    const page = html.slice(html.indexOf('data-cs-side="front"'));
    expect(page.indexOf('class="cs-hinges"')).toBeLessThan(
      page.indexOf('class="cs-cell"')
    );
    expect(page.indexOf('class="cs-cell"')).toBeLessThan(
      page.indexOf('class="cs-cut-marks"')
    );
  });

  it("tells shapes apart by their hinges' widths and by whether they are cut out", () => {
    const shaped = (group: number, hinge: PhysicalCard["hinge"]): PhysicalCard[] =>
      notes(2).map((c) => ({
        ...c,
        name: String.fromCharCode(65 + group),
        group,
        hinge,
      }));
    const { pages } = composePages(
      deck({
        cards: [
          ...shaped(0, { gap: 1.5 }),
          ...shaped(1, { gap: 1.5, cutOut: true }),
          ...shaped(2, { gap: 1.5, color: "#d9c5a8", sides: "both" }),
          ...shaped(3, { gap: 2 }),
        ],
        fold: "strip",
        paperSize: paper("A4 landscape"),
        pageMargin: 10,
      })
    );
    // A and C share a row — the strip's colour and sides are no part of its shape;
    // B, cut out, and D, wider, take sheets of their own.
    const rows = (page: Page) =>
      [...new Set(page.cells.map((c) => c.y))].map((y) =>
        page.cells
          .filter((c) => c.y === y)
          .map((c) => c.name)
          .join("")
      );
    expect(rows(pages[0]!)).toEqual(["AACC"]);
    expect(rows(pages[2]!)).toEqual(["BB"]);
    expect(rows(pages[4]!)).toEqual(["DD"]);
  });

  it("cuts and folds the rows of one shape along the same lines, through the sheet", () => {
    // A4 across, poker, two-card folds with a 2 mm strip that stays: two folds a row,
    // two rows, every edge and every crease of the top row on the bottom row's too.
    const { pages } = composePages(
      deck({
        cards: notes(2, 2, 2, 2),
        fold: "strip",
        gap: 2,
        paperSize: paper("A4 landscape"),
        pageMargin: 10,
      })
    );
    const { cells, marks, folds } = pages[0]!;
    const xs = (y: number) => cells.filter((c) => c.y === y).map((c) => c.x);
    expect(xs(17)).toEqual(xs(105));
    // Each piece's outer edges are cut above and below the row line between them.
    const vertical = (x: number) => marks.filter((l) => l.x1 === x && l.x2 === x);
    for (const x of [20.5, 148.5, 276.5]) {
      expect(vertical(x).filter((l) => l.y2 <= 105 && l.y1 > 0)).not.toEqual([]);
      expect(vertical(x).filter((l) => l.y1 >= 105 && l.y2 < 210)).not.toEqual([]);
    }
    // Every crease reaches the block's top and its bottom: a fold mark at both ends.
    for (const x of [83.5, 85.5, 211.5, 213.5]) {
      expect(folds.filter((l) => l.x1 === x && l.y1 === 0)).toHaveLength(1);
      expect(folds.filter((l) => l.x1 === x && l.y2 === 210)).toHaveLength(1);
    }
  });

  it("centres each sheet on its own widest row, so a sheet of single cards sits mid-paper", () => {
    // Eight single cards, then two folds with a 0.5 mm strip: 253 mm a row of folds,
    // 252 a row of cards. The cards' sheet does not move over for the folds' sheet.
    const { pages } = composePages(
      deck({
        cards: notes(1, 1, 1, 1, 1, 1, 1, 1, 2, 2),
        fold: "cover",
        gap: 0.5,
        paperSize: paper("A4 landscape"),
        pageMargin: 10,
      })
    );
    const lefts = (page: Page) => [...new Set(page.cells.map((c) => c.x))];
    expect(lefts(pages[0]!)).toEqual([22.5, 85.5, 148.5, 211.5]);
    // Behind them, the same places: the block is symmetric on the paper.
    expect(lefts(pages[1]!).sort((a, b) => a - b)).toEqual([22.5, 85.5, 148.5, 211.5]);
    expect(Math.min(...pages[2]!.cells.map((c) => c.x))).toBe(22);
    // Every row line runs into both margins, on the front and behind it.
    for (const sheet of [pages[0]!, pages[1]!]) {
      for (const y of [17, 105, 193]) {
        const row = sheet.marks.filter((l) => l.y1 === y && l.y2 === y);
        expect(row.some((l) => l.x1 === 0)).toBe(true);
        expect(row.some((l) => l.x2 === 297)).toBe(true);
      }
    }
  });

  it("marks only cuts that are there, where a hinge shifts one row against the next", () => {
    // A folding deck composes no such page any more; a page placed by hand still can be
    // — a card, a fold with a 2 mm strip that stays, a card, then four single cards.
    const { grid } = composePages(
      deck({
        cards: notes(1, 2, 1),
        fold: "strip",
        gap: 2,
        paperSize: paper("A4 landscape"),
        pageMargin: 10,
      })
    );
    const at = (name: string, x: number, y: number, panel?: number): Cell => ({
      index: 0,
      side: "front",
      name,
      cardTypeId: "gear",
      x,
      y,
      html: name,
      ...(panel === undefined
        ? {}
        : { fold: { chunk: 1, panel, panels: 2, hinged: true, cutOut: false } }),
    });
    const cells = [
      at("A", 21.5, 17),
      at("B", 84.5, 17, 1),
      at("B", 149.5, 17, 2),
      at("C", 212.5, 17),
      ...["D", "E", "F", "G"].map((name, i) => at(name, 21.5 + 63 * i, 105)),
    ];
    const marks = cutMarks(cells, grid, deck().cutMarks);
    const vertical = (x: number) => marks.filter((l) => l.x1 === x && l.x2 === x);
    const above = (x: number) => vertical(x).filter((l) => l.y2 <= 105);
    const below = (x: number) => vertical(x).filter((l) => l.y1 >= 105);
    // 147.5: a cut in the lower row only — the upper row's strip begins there.
    expect(above(147.5)).toEqual([]);
    expect(below(147.5)).not.toEqual([]);
    // 149.5: the strip's other edge, a crease — no cut in either row.
    expect(vertical(149.5)).toEqual([]);
    // 212.5 is cut in the upper row only, 210.5 in the lower row only.
    expect(below(212.5)).toEqual([]);
    expect(above(212.5)).not.toEqual([]);
    expect(above(210.5).filter((l) => l.y1 > 0)).toEqual([]);
    // The lower row ends 2 mm short of the upper: its corner's arm to the right
    // stops where the upper row's cut along the same line stops.
    expect(
      marks.filter((l) => l.y1 === 105 && l.y2 === 105 && l.x1 === 273.5).map((l) => l.x2)
    ).toEqual([275.5]);
  });
});
