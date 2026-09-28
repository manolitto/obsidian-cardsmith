import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, relative } from "path";
import { describe, expect, it, vi } from "vitest";
import { collectDiagnostics } from "../src/definitions/diagnostics";
import { BUNDLED_SYSTEMS } from "../src/generated/bundled-systems";
import { parseNote } from "../src/render/note";
import { resolveCards } from "../src/render/card";
import type { LoadedCardType, LoadedSystem } from "../src/systems/loader";
import type { App, Editor, EditorPosition } from "obsidian";
import {
  blankLineBefore,
  buildCardBlock,
  insertAtCursor,
  linkedSamplePictures,
  writeSamplePictures,
  type InsertMode,
} from "../src/ui/insert-card";
import { BundledSystemSource } from "../src/systems/bundled-source";
import { loadSystem } from "../src/systems/loader";
import { FIXTURES_DIR } from "./helpers/render-fixture";
import { downloadFromResources } from "./helpers/systems";
import { loadedSystem } from "./helpers/render";

/**
 * The block the insert commands write, held as a golden per card type and
 * mode beside the fixtures: `tests/fixtures/<system>/_insert-<type>-<mode>.md`.
 * A changed description or sample fails exactly the card types that carry
 * it. `UPDATE_GOLDENS=1` rewrites them.
 */

const UPDATE = process.env["UPDATE_GOLDENS"] === "1";

/** The sample table the builder writes for the card type, in `en` or the system's first language. */
function sampleTableOf(system: LoadedSystem, cardType: LoadedCardType) {
  const tables = cardType.declaration.sampleTable;
  return tables?.["en"] ?? tables?.[system.declaration.languages[0] ?? ""];
}
const MODES: InsertMode[] = ["empty", "sample"];

const cases = BUNDLED_SYSTEMS.flatMap((system) =>
  MODES.map((mode) => [system.id, mode] as const)
);

describe.each(cases)("buildCardBlock for %s, %s", (systemId, mode) => {
  it("matches the golden of every card type", async () => {
    const system = await loadedSystem(systemId);
    for (const cardType of Object.values(system.cardTypes)) {
      const block = buildCardBlock(system, cardType, "en", mode);
      const path = join(
        FIXTURES_DIR,
        systemId,
        `_insert-${cardType.declaration.id}-${mode}.md`
      );
      if (UPDATE) writeFileSync(path, block);
      expect(
        existsSync(path),
        `${relative(FIXTURES_DIR, path)} is missing — run with UPDATE_GOLDENS=1 to write it`
      ).toBe(true);
      expect(block, relative(FIXTURES_DIR, path)).toBe(readFileSync(path, "utf-8"));
    }
  });
});

describe("the sample block", () => {
  it("is a card note the renderer resolves, for every bundled card type", async () => {
    for (const bundled of BUNDLED_SYSTEMS) {
      const system: LoadedSystem = await loadedSystem(bundled.id);
      for (const cardType of Object.values(system.cardTypes)) {
        const diagnostics = collectDiagnostics();
        const note = parseNote(
          buildCardBlock(system, cardType, "en", "sample"),
          `${bundled.id}/${cardType.declaration.id}.md`,
          diagnostics
        );
        expect(note, cardType.declaration.id).toBeDefined();
        const cards = resolveCards(note!, system, diagnostics);
        // A card type with a sample table is at least one card per row — more
        // when a row's roll range expands; any other card type is one.
        const rows = sampleTableOf(system, cardType)?.rows.length ?? 1;
        expect(cards.length, cardType.declaration.id).toBeGreaterThanOrEqual(rows);
        if (rows === 1) expect(cards, cardType.declaration.id).toHaveLength(1);
        for (const card of cards) expect(card.cardTypeId).toBe(cardType.declaration.id);
        expect(diagnostics.messages, cardType.declaration.id).toEqual([]);
      }
    }
  });

  it("writes only the properties bound to a place on the card, canonical names only", async () => {
    const system = await loadedSystem("simple");
    const cardType = system.cardTypes["simple"]!;
    const block = buildCardBlock(system, cardType, "en", "empty");
    expect(block).toContain("  name:\n");
    expect(block).toContain("  content:\n");
    expect(block).not.toContain("  body:");
    expect(block).not.toContain("  image:");
    expect(block).not.toContain("  titel:");
  });

  it("says the language it is written in, so the card prints its captions in it", async () => {
    const system = await loadedSystem("5e_2024");
    const cardType = system.cardTypes["item"]!;
    for (const [asked, written] of [
      ["de", "de"],
      ["en", "en"],
      ["fr", "en"], // not a language of the system: its primary one
    ] as const) {
      const block = buildCardBlock(system, cardType, asked, "sample");
      expect(block).toContain(`  card-type: item\n  language: ${written}\n`);
      const diagnostics = collectDiagnostics();
      const note = parseNote(block, "5e_2024/item.md", diagnostics)!;
      expect(resolveCards(note, system, diagnostics)[0]?.settings.language).toBe(written);
    }
    expect(buildCardBlock(system, cardType, "de", "sample")).toContain(
      "label: Stunden Öl"
    );
  });

  it("falls back to the language the system documents in", async () => {
    const system = await loadedSystem("eiserne-zeit");
    const cardType = Object.values(system.cardTypes)[0]!;
    const de = buildCardBlock(system, cardType, "de", "sample");
    const fr = buildCardBlock(system, cardType, "fr", "sample");
    expect(fr).toBe(de);
  });
});

describe("a sample table", () => {
  it("is written as a table note: the table, the columns under table:, the rest under data:", async () => {
    const system = await loadedSystem("dragonbane");
    const block = buildCardBlock(system, system.cardTypes["roll-table"]!, "de", "sample");
    const lines = block.split("\n");
    expect(lines[0]).toMatch(
      /^\| Würfelwurf +\| Wurf-Min \| Wurf-Max \| Name +\| Voraussetzungen \| Rationen \| Beschreibung +\|$/
    );
    expect(lines[1]).toMatch(/^\| -+ \| -+ \| -+ \| -+ \| -+ \| -+ \| -+ \|$/);
    expect(lines[2]).toMatch(/^\| 1 +\| 1 +\| 1 +\| Nebelbarsch/);
    expect(block).toContain("table:\n");
    expect(block).toContain("  roll: Würfelwurf\n");
    expect(block).toContain("  stats:\n    - Voraussetzungen\n    - Rationen\n");
    // A column property is not repeated under data:.
    expect(block.slice(block.indexOf("data:"))).not.toMatch(
      /^ {2}(name|roll|stats|description):/m
    );
    expect(block.slice(block.indexOf("data:"))).toMatch(/^ {2}category:/m);
  });

  it("is a headed, empty table in the empty mode", async () => {
    const system = await loadedSystem("dino-island");
    const block = buildCardBlock(system, system.cardTypes["roll-table"]!, "de", "empty");
    const lines = block.split("\n");
    expect(lines[0]).toMatch(/^\| Wurf \| Gerücht \|$/);
    expect(lines[2]).toMatch(/^\| +\| +\|$/);
    expect(block).toContain("table:\n");
    expect(block).toMatch(/^ {2}heading:$/m);
  });

  it("reports a column that is not a property of the card type", async () => {
    const { loadSystem } = await import("../src/systems/loader");
    const { MemorySource, completeSystem } = await import("./helpers/systems");
    const files = completeSystem();
    files["game-system.yaml"] = files["game-system.yaml"]!.toString().replace(
      "card-types:\n  gear:\n",
      "card-types:\n  gear:\n    sample-table:\n      en:\n        columns: { nosuch: Header }\n        rows: [{ Header: x }]\n"
    );
    const diagnostics = collectDiagnostics();
    await loadSystem(new MemorySource(files), "demo", diagnostics);
    expect(
      diagnostics.matching(
        'demo: card-types.gear.sample-table.en names the column "nosuch", which is not a property of the card type'
      )
    ).toHaveLength(1);
  });
});

describe("inserting a block", () => {
  it("puts it after a blank line, adding only what is missing", () => {
    expect(blankLineBefore("Intro\nSome text", false)).toBe("\n\n");
    expect(blankLineBefore("Some text\n", false)).toBe("\n");
    expect(blankLineBefore("Some text\n   ", false)).toBe("\n");
    expect(blankLineBefore("\n", false)).toBe("");
    expect(blankLineBefore("  \n", false)).toBe("");
    expect(blankLineBefore("", true)).toBe("");
    expect(blankLineBefore("Title", true)).toBe("\n\n");
  });

  /** A note as a string, behind the four editor calls the insert makes. */
  function editorOn(note: string, cursor: EditorPosition) {
    let text = note;
    let at = cursor;
    const offset = (p: EditorPosition) =>
      text
        .split("\n")
        .slice(0, p.line)
        .reduce((n, l) => n + l.length + 1, 0) + p.ch;
    const editor = {
      getCursor: () => at,
      getRange: (a: EditorPosition, b: EditorPosition) =>
        text.slice(offset(a), offset(b)),
      replaceRange: (insert: string, p: EditorPosition) => {
        text = text.slice(0, offset(p)) + insert + text.slice(offset(p));
      },
      setCursor: (p: EditorPosition) => {
        at = p;
      },
    } as unknown as Editor;
    return { editor, text: () => text, cursor: () => at };
  }

  it.each([
    [
      "after text on the cursor's line",
      "Buch:: PHB",
      { line: 0, ch: 10 },
      "Buch:: PHB\n\nBLOCK",
    ],
    [
      "on an empty line under text",
      "Buch:: PHB\n",
      { line: 1, ch: 0 },
      "Buch:: PHB\n\nBLOCK",
    ],
    ["after a blank line", "Buch:: PHB\n\n", { line: 2, ch: 0 }, "Buch:: PHB\n\nBLOCK"],
    ["at the start of an empty note", "", { line: 0, ch: 0 }, "BLOCK"],
  ])("%s", (_case, note, cursor, expected) => {
    const target = editorOn(note, cursor);
    insertAtCursor(target.editor, "BLOCK");
    expect(target.text()).toBe(expected);
    const lines = expected.split("\n");
    expect(target.cursor()).toEqual({ line: lines.length - 1, ch: "BLOCK".length });
  });
});

describe("the pictures a sample links", () => {
  const PICTURE = /\[\[([^\]|#]+\.(?:png|jpe?g|webp|gif|svg))(?:[#|][^\]]*)?\]\]/gi;

  it("are all declared by the system, so an inserted sample never links a picture it cannot write", async () => {
    for (const bundled of BUNDLED_SYSTEMS) {
      const system: LoadedSystem = await loadedSystem(bundled.id);
      for (const language of system.declaration.languages) {
        for (const cardType of Object.values(system.cardTypes)) {
          const block = buildCardBlock(system, cardType, language, "sample");
          const values = block
            .split("\n")
            .filter((line) => !/^\s*#/.test(line))
            .join("\n");
          const links = [...values.matchAll(PICTURE)].map((m) => m[1]);
          const declared = linkedSamplePictures(system, block).map((p) => p.link);
          expect(
            declared,
            `${bundled.id}/${cardType.declaration.id} (${language})`
          ).toEqual([...new Set(links)]);
        }
      }
    }
  });

  it("are matched by file name, and a description's example is not one", async () => {
    const system = await loadedSystem("dragonbane");
    const block = [
      "```cardsmith",
      "data:",
      "  # A picture, e.g. `[[Medaillon.png]]`.",
      "  artwork: '[[Nebelkraehe.jpg]]'",
      "  back-image: '[[Medaillon.png|the seal]]'",
      "  other: '[[Medaillon.png]] [[Unknown.png]]'",
      "```",
    ].join("\n");
    expect(linkedSamplePictures(system, block)).toEqual([
      { link: "Nebelkraehe.jpg", path: "assets/samples/Nebelkraehe.jpg" },
      { link: "Medaillon.png", path: "assets/samples/Medaillon.png" },
    ]);
  });

  it("are written where the note's attachments go, unless the link already resolves", async () => {
    const bundled = BUNDLED_SYSTEMS.find((s) => s.id === "dragonbane")!;
    const system = (await loadSystem(
      new BundledSystemSource(bundled, downloadFromResources),
      "dragonbane",
      collectDiagnostics()
    ))!;
    const block = "  artwork: '[[Nebelkraehe.jpg]]'\n  back-image: '[[Medaillon.png]]'";
    const created: [string, number][] = [];
    const app = {
      metadataCache: {
        getFirstLinkpathDest: (link: string) => (link === "Medaillon.png" ? {} : null),
      },
      fileManager: {
        getAvailablePathForAttachment: async (name: string, from: string) =>
          `${from.slice(0, from.lastIndexOf("/"))}/attachments/${name}`,
      },
      vault: {
        createBinary: async (path: string, data: ArrayBuffer) => {
          created.push([path, data.byteLength]);
        },
      },
    } as unknown as App;
    const result = await writeSamplePictures(app, system, block, "Cards/Crow.md");
    expect(result).toEqual({
      written: ["Cards/attachments/Nebelkraehe.jpg"],
      unavailable: [],
    });
    const bytes = await system.source.readBinary(
      system.declaration.samplePictures.find((p) => p.endsWith("Nebelkraehe.jpg"))!
    );
    expect(created).toEqual([["Cards/attachments/Nebelkraehe.jpg", bytes.byteLength]]);
  });

  it("skip a picture that cannot be downloaded, and name it, without failing the insert", async () => {
    const bundled = BUNDLED_SYSTEMS.find((s) => s.id === "dragonbane")!;
    const system = (await loadSystem(
      new BundledSystemSource(bundled, () => Promise.reject(new Error("offline"))),
      "dragonbane",
      collectDiagnostics()
    ))!;
    const created: string[] = [];
    const app = {
      metadataCache: { getFirstLinkpathDest: () => null },
      fileManager: { getAvailablePathForAttachment: async (name: string) => name },
      vault: {
        createBinary: async (path: string) => {
          created.push(path);
        },
      },
    } as unknown as App;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await writeSamplePictures(
      app,
      system,
      "  artwork: '[[Nebelkraehe.jpg]]'",
      "Cards/Crow.md"
    );
    warn.mockRestore();
    expect(result).toEqual({ written: [], unavailable: ["Nebelkraehe.jpg"] });
    expect(created).toEqual([]);
  });
});
