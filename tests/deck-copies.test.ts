import { describe, expect, it } from "vitest";
import { applyCopies, type DeckCard } from "../src/deck/copies";
import { collectDiagnostics } from "../src/definitions/diagnostics";

/** A laid-out card of `faces` physical cards, its front faces numbered. */
function laidOut(path: string, faces: number, copies?: number): DeckCard {
  const name = path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/, "");
  return {
    path,
    card: {
      name,
      cardTypeId: "gear",
      settings: copies === undefined ? {} : { copies },
      cards: Array.from({ length: faces }, (_, i) => ({
        front: `${name} ${i + 1}`,
        back: `${name} back`,
      })),
      clipped: false,
    },
  };
}

const fronts = (cards: { front?: string }[]): string[] => cards.map((c) => c.front ?? "");

describe("copies", () => {
  it("prints every physical card once when nothing says otherwise, faces intact", () => {
    const out = applyCopies(
      [laidOut("K/Beil.md", 1), laidOut("K/Lang.md", 3)],
      undefined,
      collectDiagnostics()
    );
    expect(fronts(out)).toEqual(["Beil 1", "Lang 1", "Lang 2", "Lang 3"]);
    expect(out[0]).toEqual({
      name: "Beil",
      cardTypeId: "gear",
      group: 0,
      front: "Beil 1",
      back: "Beil back",
    });
  });

  it("keeps the faces a card's side says — front alone, back alone, or both", () => {
    const sided = (side: "front" | "back" | "both") => {
      const card = laidOut("K/Beil.md", 2);
      card.card.settings = { side };
      return card;
    };
    const out = applyCopies(
      [sided("front"), sided("back"), sided("both")],
      undefined,
      collectDiagnostics()
    );
    expect(out.map((c) => [c.front, c.back])).toEqual([
      ["Beil 1", undefined],
      ["Beil 2", undefined],
      [undefined, "Beil back"],
      [undefined, "Beil back"],
      ["Beil 1", "Beil back"],
      ["Beil 2", "Beil back"],
    ]);
    expect(out[0]).not.toHaveProperty("back");
    expect(out[2]).not.toHaveProperty("front");
  });

  it("repeats a card's own copies as consecutive runs of its physical cards", () => {
    const out = applyCopies(
      [laidOut("K/Lang.md", 2, 2), laidOut("K/Beil.md", 1, 3)],
      undefined,
      collectDiagnostics()
    );
    expect(fronts(out)).toEqual([
      "Lang 1",
      "Lang 2",
      "Lang 1",
      "Lang 2",
      "Beil 1",
      "Beil 1",
      "Beil 1",
    ]);
    // A card's hinge colour rides along, absent where its chain sets none.
    expect(out[0]).not.toHaveProperty("hingeColor");
    // What a fold keeps together: one printing of one note, never two.
    expect(out.map((c) => c.group)).toEqual([0, 0, 1, 1, 2, 3, 4]);
  });

  it("lets card-copies win over the card's own, by path, path without .md, or name", () => {
    const diagnostics = collectDiagnostics();
    const out = applyCopies(
      [
        laidOut("K/Beil.md", 1, 5),
        laidOut("K/Bogen.md", 1, 5),
        laidOut("K/Speer.md", 1, 5),
      ],
      [
        { name: "K/Beil.md", copies: 1 },
        { name: "K/Bogen", copies: 2 },
        { name: "Speer", copies: 3 },
      ],
      diagnostics
    );
    expect(fronts(out)).toEqual([
      "Beil 1",
      "Bogen 1",
      "Bogen 1",
      "Speer 1",
      "Speer 1",
      "Speer 1",
    ]);
    expect(diagnostics.messages).toEqual([]);
  });

  it("multiplies the copies by how often the deck holds the note", () => {
    const twice = (card: DeckCard): DeckCard => ({ ...card, times: 2 });
    const out = applyCopies(
      [twice(laidOut("K/Beil.md", 1)), twice(laidOut("K/Wolf.md", 1, 3))],
      [{ name: "Beil", copies: 2 }],
      collectDiagnostics()
    );
    expect(fronts(out)).toEqual([
      ...Array<string>(4).fill("Beil 1"),
      ...Array<string>(6).fill("Wolf 1"),
    ]);
  });

  it("reports an entry that names no card in the deck", () => {
    const diagnostics = collectDiagnostics();
    applyCopies([laidOut("K/Beil.md", 1)], [{ name: "Biel", copies: 2 }], diagnostics);
    expect(
      diagnostics.matching('card-copies: "Biel" names no card in the deck')
    ).toHaveLength(1);
  });

  it("carries the card's hinge colour onto each of its physical cards", () => {
    const card = laidOut("K/Lang.md", 2);
    card.card.settings = { hingeColor: "#336699", hingeSides: "both" };
    const out = applyCopies([card], undefined, collectDiagnostics());
    expect(out.map((c) => c.hingeColor)).toEqual(["#336699", "#336699"]);
    expect(out.map((c) => c.hingeSides)).toEqual(["both", "both"]);
  });
});
