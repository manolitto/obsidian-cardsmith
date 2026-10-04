import { describe, expect, it } from "vitest";
import type { PhysicalCard } from "../src/deck/copies";
import {
  composePages,
  compositionText,
  cutMarks,
  cutMarksSvg,
  layoutGrid,
  type Composable,
  type Page,
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

const deck = (over: Partial<Composable> = {}): Composable => ({
  cards: cards(6),
  cardSize: card("poker"),
  paperSize: paper("140 x 280"),
  pageMargin: 0,
  duplexFlip: "long-edge",
  cutMarks: { enabled: true, length: 3, margin: 0, color: "#aaaaaa", weight: 0.25 },
  ...over,
});

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
    expect(front).toHaveLength(4 * 4);
    expect(front.find((l) => l.x1 === 7 && l.y2 === 8 - 1)).toMatchObject({ y1: 0 });
    expect(front.find((l) => l.x1 === 7 && l.y1 === 8 + 1)).toMatchObject({ y2: 8 + 5 });
    // The card's lower corners sit inside the block: their arms are `length` long both ways.
    expect(front.find((l) => l.x1 === 7 && l.y2 === 96 - 1)).toMatchObject({
      y1: 96 - 5,
    });
    expect(front.find((l) => l.x1 === 7 && l.y1 === 96 + 1)).toMatchObject({
      y2: 96 + 5,
    });
    // The one card's back sits in the other column, and its marks with it.
    const back = pages[1]!.marks;
    const xs = [...new Set(back.filter((l) => l.x1 === l.x2).map((l) => l.x1))];
    expect(xs.sort((a, b) => a - b)).toEqual([70, 133]);
  });

  it("are none on a page that holds one card, and still there on a part-filled last page", () => {
    const single = composePages(deck({ cards: cards(1), paperSize: paper("poker") }));
    expect(single.grid).toMatchObject({ columns: 1, rows: 1 });
    expect(single.pages[0]!.marks).toEqual([]);

    const last = composePages(deck({ cards: cards(7) })).pages.at(-1)!;
    expect(last.cells).toHaveLength(1);
    expect(last.marks).toHaveLength(16);
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

  it("counts the grid in strips: a fold of two poker cards on A4 turns the sheet, a fold of three does not", () => {
    expect(layoutGrid(paper("A4"), card("poker"), 10, 2)).toMatchObject({
      paper: { width: 297, height: 210 },
      panels: 2,
      columns: 4,
      rows: 2,
    });
    expect(layoutGrid(paper("A4"), card("poker"), 10, 3)).toMatchObject({
      paper: { width: 210, height: 297 },
      panels: 3,
      columns: 3,
      rows: 3,
      originX: 10.5,
    });
  });

  it("refuses a strip that fits the paper no way round, naming the fold", () => {
    expect(() => layoutGrid(paper("150 x 150"), card("poker"), 0, 3)).toThrow(
      "A fold of 3 63 × 88 mm cards (189 × 88 mm) does not fit on 150 × 150 mm paper"
    );
  });

  it("pairs: each panel is a card, its back behind it — 1 and 3 side by side, 2 behind 1, 4 behind 3", () => {
    const { pages } = composePages(deck({ cards: notes(2), foldPanels: 2 }));
    expect(faces(pages[0]!)).toEqual(["A1f@7,8", "A2f@70,8"]);
    // Mirrored about the long edge: the back of the left panel is on the right.
    expect(faces(pages[1]!)).toEqual(["A1b@70,8", "A2b@7,8"]);
    expect(pages[0]!.cells.map((c) => c.fold)).toEqual([
      { chunk: 0, panel: 1, panels: 2 },
      { chunk: 0, panel: 2, panels: 2 },
    ]);
  });

  it("leporello: 1, 2, 3 across the front, and 4, 5, 6 read across the back once turned over", () => {
    const { pages } = composePages(
      deck({
        cards: notes(3),
        paperSize: paper("189 x 88"),
        foldPanels: 3,
        foldOrder: "leporello",
      })
    );
    expect(faces(pages[0]!)).toEqual(["A1f@0,0", "A1b@63,0", "A2f@126,0"]);
    expect(faces(pages[1]!)).toEqual(["A3b@126,0", "A3f@63,0", "A2b@0,0"]);
    const leftToRight = [...pages[1]!.cells].sort((a, b) => a.x - b.x).map((c) => c.html);
    expect(leftToRight).toEqual(["A2b", "A3f", "A3b"]);
  });

  it("leporello of two: 1, 2 on the front, 4 behind 1, 3 behind 2", () => {
    const { pages } = composePages(
      deck({ cards: notes(2), foldPanels: 2, foldOrder: "leporello" })
    );
    expect(faces(pages[0]!)).toEqual(["A1f@7,8", "A1b@70,8"]);
    expect(faces(pages[1]!)).toEqual(["A2b@70,8", "A2f@7,8"]);
  });

  it("keeps each panel's back behind it under a short-edge flip", () => {
    const { pages } = composePages(
      deck({ cards: notes(2), foldPanels: 2, duplexFlip: "short-edge" })
    );
    expect(faces(pages[1]!)).toEqual(["A1b@7,184", "A2b@70,184"]);
  });

  it("fills strips in deck order: short folds share one, a fold that does not fit starts the next", () => {
    // A and B single, C two cards, D three — a fold and a single — on strips of two, three to a page.
    const { pages } = composePages(deck({ cards: notes(1, 1, 2, 3, 1), foldPanels: 2 }));
    expect(pages.map((p) => p.side)).toEqual(["front", "back", "front", "back"]);
    expect(faces(pages[0]!)).toEqual([
      "A1f@7,8",
      "B1f@70,8",
      "C1f@7,96",
      "C2f@70,96",
      "D1f@7,184",
      "D2f@70,184",
    ]);
    // D's third card and E share the next sheet's first strip, two pieces of paper.
    expect(faces(pages[2]!)).toEqual(["D3f@7,8", "E1f@70,8"]);
    expect(pages[2]!.cells.map((c) => c.fold)).toEqual([undefined, undefined]);
    expect(pages[0]!.cells.map((c) => c.index + 1)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("leaves the rest of a strip empty rather than take a later card", () => {
    const { pages } = composePages(deck({ cards: notes(1, 2), foldPanels: 2 }));
    expect(faces(pages[0]!)).toEqual(["A1f@7,8", "B1f@7,96", "B2f@70,96"]);
  });

  it("does not fold the copies of a note together: each printing is its own", () => {
    const twice = [...notes(1), { ...notes(1)[0]!, group: 1 }];
    const { pages } = composePages(deck({ cards: twice, foldPanels: 2 }));
    expect(pages[0]!.cells.map((c) => c.fold)).toEqual([undefined, undefined]);
  });

  it("marks a fold's corners, not its crease, and puts a dashed fold mark at each end of it", () => {
    const { pages } = composePages(deck({ cards: notes(2), foldPanels: 2 }));
    const { marks, folds } = pages[0]!;
    // One piece of paper: four corners, four arms each, nothing at the crease.
    expect(marks).toHaveLength(16);
    expect(marks.some((l) => l.x1 === 70 || l.x2 === 70)).toBe(false);
    // Up to the paper's edge at the block's top, `length` on at the crease's foot.
    expect(folds).toEqual([
      { x1: 70, y1: 0, x2: 70, y2: 8 },
      { x1: 70, y1: 96, x2: 70, y2: 99 },
    ]);
    // The back page's crease sits where the panels' backs meet.
    expect(pages[1]!.folds.map((l) => l.x1)).toEqual([70, 70]);
  });

  it("draws no cut arm along a crease, and no fold mark where a cut meets it", () => {
    // A fold above two single cards: their corner sits on the crease's foot.
    const { pages } = composePages(deck({ cards: notes(2, 1, 1), foldPanels: 2 }));
    const { marks, folds } = pages[0]!;
    expect(marks.some((l) => l.x1 === 70 && l.x2 === 70 && l.y2 <= 96)).toBe(false);
    expect(marks.some((l) => l.x1 === 70 && l.x2 === 70 && l.y1 >= 96)).toBe(true);
    expect(folds).toEqual([{ x1: 70, y1: 0, x2: 70, y2: 8 }]);
  });

  it("follows the cut marks off", () => {
    const { pages } = composePages(
      deck({ cards: notes(2), foldPanels: 2, cutMarks: { enabled: false } })
    );
    expect(pages[0]!.folds).toEqual([]);
  });

  it("dashes the fold marks in the SVG, and reads them in the composition text", () => {
    const { pages, grid } = composePages(deck({ cards: notes(2), foldPanels: 2 }));
    const svg = cutMarksSvg(pages[0]!, grid, { enabled: true, weight: 0.25 });
    expect(svg).toContain(
      '<g class="cs-fold-marks" stroke-dasharray="1 0.75"><line x1="70" y1="0" x2="70" y2="8"/>'
    );
    expect(cutMarksSvg({ ...pages[0]!, marks: [] }, grid, {})).toContain("cs-fold-marks");
    expect(compositionText(pages, grid).split("\n").slice(0, 4)).toEqual([
      "2 pages · 140 × 280 mm · 2 × 3 of 63 × 88 mm at 7, 8 · strips of 2",
      "1. front · 16 marks · 2 fold marks",
      "   front #1 at 7, 8 panel 1/2 gear/A",
      "   front #2 at 70, 8 panel 2/2 gear/A",
    ]);
  });
});
