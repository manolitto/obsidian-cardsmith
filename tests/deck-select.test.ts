import { describe, expect, it } from "vitest";
import type { DeckSelection } from "../src/deck/block";
import { selectNotes, sortCards } from "../src/deck/select";
import { listDeckNotes, type DeckSource, type TaggedNote } from "../src/deck/source";
import { collectDiagnostics } from "../src/definitions/diagnostics";
import { parseNote } from "../src/render/note";

/** A card note from its block's `card:` lines, tagged. */
function note(path: string, card: string, tags: string[] = []): TaggedNote {
  const text = `\`\`\`cardsmith\ncard:\n${card
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n")}\n\`\`\``;
  const parsed = parseNote(text, path, collectDiagnostics());
  if (!parsed) throw new Error(`${path} is not a card note`);
  return { note: parsed, tags };
}

const system = {
  id: "demo",
  cardTypes: {
    gear: { cardSettings: { language: "de" } },
    spell: { cardSettings: { language: "de" } },
  },
};

const selection = (over: Partial<DeckSelection> = {}): DeckSelection => ({
  folders: [""],
  notes: [],
  systemId: "demo",
  cardTypeIds: [],
  includeTagsAll: [],
  includeTagsAny: [],
  excludeTagsAny: [],
  excludeTagsAll: [],
  languages: [],
  ...over,
});

const names = (kept: TaggedNote[]): string[] => kept.map((entry) => entry.note.name);

const select = (
  notes: TaggedNote[],
  over: Partial<DeckSelection> = {},
  diagnostics = collectDiagnostics()
) => names(selectNotes(notes, selection(over), system, diagnostics));

describe("selecting notes", () => {
  const beil = note("K/Beil.md", "system: demo\ncard-type: gear", ["waffe", "nahkampf"]);
  const bogen = note("K/Bogen.md", "system: demo\ncard-type: gear", [
    "Waffe",
    "fernkampf",
  ]);
  const feuerball = note("K/Feuerball.md", "system: demo\ncard-type: spell", ["feuer"]);
  const fremd = note("K/Fremd.md", "system: other\ncard-type: gear", ["waffe"]);
  const all = [beil, bogen, feuerball, fremd];

  it("keeps the deck's system and drops another silently", () => {
    const diagnostics = collectDiagnostics();
    expect(select(all, {}, diagnostics)).toEqual(["Beil", "Bogen", "Feuerball"]);
    expect(diagnostics.messages).toEqual([]);
  });

  it("reports a card note that names no system, since no deck could hold it", () => {
    const diagnostics = collectDiagnostics();
    const lost = note("K/Lost.md", "card-type: gear");
    expect(select([beil, lost], {}, diagnostics)).toEqual(["Beil"]);
    expect(
      diagnostics.matching("K/Lost.md: the cardsmith block names no system:")
    ).toHaveLength(1);
  });

  it("keeps the listed card types, the note's type resolved as the renderer resolves it", () => {
    expect(select(all, { cardTypeIds: ["spell"] })).toEqual(["Feuerball"]);
    // A note naming no card type is the only one of a one-type system.
    const only = { id: "demo", cardTypes: { gear: { cardSettings: {} } } };
    const unnamed = note("K/Unnamed.md", "system: demo");
    expect(
      names(
        selectNotes(
          [unnamed],
          selection({ cardTypeIds: ["gear"] }),
          only,
          collectDiagnostics()
        )
      )
    ).toEqual(["Unnamed"]);
    // In a two-type system it resolves to nothing, and a type filter drops it.
    expect(select([unnamed], { cardTypeIds: ["gear"] })).toEqual([]);
    expect(select([unnamed])).toEqual(["Unnamed"]);
  });

  it("applies the four tag filters, case aside, each on its own terms", () => {
    expect(select(all, { includeTagsAll: ["waffe", "nahkampf"] })).toEqual(["Beil"]);
    expect(select(all, { includeTagsAny: ["nahkampf", "feuer"] })).toEqual([
      "Beil",
      "Feuerball",
    ]);
    expect(select(all, { excludeTagsAny: ["fernkampf"] })).toEqual(["Beil", "Feuerball"]);
    expect(select(all, { excludeTagsAll: ["waffe", "fernkampf"] })).toEqual([
      "Beil",
      "Feuerball",
    ]);
    // Every filter must agree.
    expect(
      select(all, { includeTagsAny: ["waffe"], excludeTagsAny: ["nahkampf"] })
    ).toEqual(["Bogen"]);
  });

  it("keeps the cards that print in one of the deck's languages", () => {
    const english = note("K/Axe.md", "system: demo\ncard-type: gear\nlanguage: EN");
    const notes = [beil, english];
    expect(select(notes, { languages: ["de"] })).toEqual(["Beil"]);
    expect(select(notes, { languages: ["en"] })).toEqual(["Axe"]);
    expect(select(notes, { languages: ["en", "de"] })).toEqual(["Beil", "Axe"]);
  });

  it("lets a card whose chain names no language through — there is nothing to compare", () => {
    const mute = { id: "demo", cardTypes: { gear: { cardSettings: {} } } };
    const kept = selectNotes(
      [beil],
      selection({ languages: ["en"] }),
      mute,
      collectDiagnostics()
    );
    expect(names(kept)).toEqual(["Beil"]);
  });
});

describe("selecting named notes", () => {
  const named = (path: string, card: string, tags: string[] = []) => ({
    ...note(path, card, tags),
    listed: 1,
  });
  const beil = named("K/Beil.md", "system: demo\ncard-type: gear", ["waffe"]);
  const fremd = named("K/Fremd.md", "system: other\ncard-type: gear");
  const feuerball = named("K/Feuerball.md", "system: demo\ncard-type: spell");
  const entwurf = named("K/Entwurf.md", "system: demo\ncard-type: gear", ["entwurf"]);
  const english = named("K/Axe.md", "system: demo\ncard-type: gear\nlanguage: en");

  it("holds them to the filters, and says why it drops each", () => {
    const diagnostics = collectDiagnostics();
    expect(
      select(
        [beil, fremd, feuerball, entwurf, english],
        { cardTypeIds: ["gear"], excludeTagsAny: ["entwurf"], languages: ["de"] },
        diagnostics
      )
    ).toEqual(["Beil"]);
    expect(diagnostics.messages).toEqual([
      "K/Fremd.md: named under notes:, but its system is other, and the deck is demo; not in the deck",
      "K/Feuerball.md: named under notes:, but its card type is spell, and the deck takes gear; not in the deck",
      "K/Entwurf.md: named under notes:, but its tags fail the deck's tag filters; not in the deck",
      "K/Axe.md: named under notes:, but it prints in en, and the deck takes de; not in the deck",
    ]);
  });

  it("drops a folder's note of the same kind silently", () => {
    const diagnostics = collectDiagnostics();
    const { listed: _, ...unnamed } = fremd;
    expect(select([unnamed], {}, diagnostics)).toEqual([]);
    expect(diagnostics.messages).toEqual([]);
  });
});

describe("sorting cards", () => {
  const card = (cardTypeId: string, name: string, rollMin?: number) => ({
    cardTypeId,
    name,
    ...(rollMin === undefined ? {} : { rollMin }),
  });

  it("groups by the deck's card-type order, then the system's, then the id", () => {
    const cards = [
      card("spell", "b"),
      card("gear", "a"),
      card("rule", "c"),
      card("creature", "d"),
      card("zzz", "e"),
    ];
    const sorted = sortCards(cards, ["rule", "gear"], ["gear", "spell", "creature"]);
    expect(sorted.map((c) => c.cardTypeId)).toEqual([
      "rule",
      "gear",
      "spell",
      "creature",
      "zzz",
    ]);
  });

  it("orders a group by roll-min, cards without one after, then by name", () => {
    const cards = [
      card("table", "Zehn", 10),
      card("table", "Ohne"),
      card("table", "Eins", 1),
      card("table", "Auch ohne"),
      card("table", "Sieben", 7),
    ];
    expect(sortCards(cards, [], ["table"]).map((c) => c.name)).toEqual([
      "Eins",
      "Sieben",
      "Zehn",
      "Auch ohne",
      "Ohne",
    ]);
  });

  it("collates names as a reader would: numbers by value, case and accents aside", () => {
    const cards = ["Wolf 10", "wolf 2", "Äxte", "Axt", "Zwerg", "axt"].map((name) =>
      card("gear", name)
    );
    expect(sortCards(cards, [], ["gear"]).map((c) => c.name)).toEqual([
      "Axt",
      "axt",
      "Äxte",
      "wolf 2",
      "Wolf 10",
      "Zwerg",
    ]);
  });

  it("is stable and leaves the input alone", () => {
    const cards = [card("gear", "Same", 1), card("gear", "Same", 1)];
    const first = cards[0];
    const sorted = sortCards(cards, [], []);
    expect(sorted[0]).toBe(first);
    expect(sorted).not.toBe(cards);
  });
});

describe("listing the folders", () => {
  // A source over a fixed tree: a note is under a folder when its path
  // starts with it, and under the root always.
  const tree = [
    note("Waffen/Beil.md", "system: demo"),
    note("Waffen/Bogen.md", "system: demo"),
    note("Waffen/Alt/Keule.md", "system: demo"),
    note("Rüstung/Helm.md", "system: demo"),
  ];
  const source: DeckSource = {
    listNotes: (folder, recursive) =>
      Promise.resolve(
        tree.filter(({ note }) => {
          const parent = note.path.slice(0, note.path.lastIndexOf("/"));
          if (parent === folder) return true;
          return recursive && (folder === "" || parent.startsWith(`${folder}/`));
        })
      ),
    // By path, with or without `.md`, or by name; `Bild.png` is a file but no note.
    resolveNote: (target) => {
      if (target === "Bild.png") return Promise.resolve({ path: "Bild.png" });
      const found = tree.find(
        ({ note }) =>
          note.path === target || note.path === `${target}.md` || note.name === target
      );
      return Promise.resolve(found && { path: found.note.path, note: found });
    },
  };
  const list = async (
    folders: string[],
    recursive = false,
    notes: string[] = [],
    diagnostics = collectDiagnostics()
  ): Promise<string[]> =>
    names(
      await listDeckNotes(source, { folders, notes }, "Deck.md", recursive, diagnostics)
    );

  it("concatenates the folders in the order named", async () => {
    expect(await list(["Rüstung", "Waffen"])).toEqual(["Helm", "Beil", "Bogen"]);
    expect(await list(["Waffen"], true)).toEqual(["Beil", "Bogen", "Keule"]);
  });

  it("lists a note once when two folders both hold it", async () => {
    expect(await list(["Waffen/Alt", "Waffen"], true)).toEqual([
      "Keule",
      "Beil",
      "Bogen",
    ]);
    expect(await list(["", "Rüstung"], true)).toEqual(["Beil", "Bogen", "Keule", "Helm"]);
  });

  it("adds the notes named after the folders' own, each note once", async () => {
    expect(await list([], false, ["Waffen/Alt/Keule", "Helm", "Waffen/Beil.md"])).toEqual(
      ["Keule", "Helm", "Beil"]
    );
    expect(await list(["Waffen"], false, ["Helm", "Beil", "Helm"])).toEqual([
      "Beil",
      "Bogen",
      "Helm",
    ]);
  });

  it("counts how often a note is named, by any spelling, also when a folder holds it", async () => {
    const listed = await listDeckNotes(
      source,
      { folders: ["Waffen"], notes: ["Beil", "Helm", "Waffen/Beil.md", "Beil"] },
      "Deck.md",
      false,
      collectDiagnostics()
    );
    expect(listed.map((entry) => [entry.note.name, entry.listed ?? 0])).toEqual([
      ["Beil", 3],
      ["Bogen", 0],
      ["Helm", 1],
    ]);
  });

  it("reports a name that reaches no note, and a file that is no card note", async () => {
    const diagnostics = collectDiagnostics();
    expect(await list([], false, ["Nirgends", "Bild.png", "Helm"], diagnostics)).toEqual([
      "Helm",
    ]);
    expect(diagnostics.messages).toEqual([
      'Deck.md: notes: "Nirgends" — no such note',
      'Deck.md: notes: "Bild.png" — Bild.png is not a card note',
    ]);
  });
});
