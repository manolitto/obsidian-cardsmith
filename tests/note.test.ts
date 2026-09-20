import { describe, expect, it } from "vitest";
import { collectDiagnostics } from "../src/definitions/diagnostics";
import { parseNote, sectionKey } from "../src/render/note";

const parse = (
  text: string,
  diagnostics = collectDiagnostics(),
  path = "Karten/Beil.md"
) => parseNote(text, path, diagnostics);

const BLOCK =
  "```cardsmith\ncard:\n  system: dragonbane\n  card-type: gear\ndata:\n  price: 10\n```";

describe("the cardsmith block", () => {
  it("is found with spaces after the fence, and read into card:, data: and the name", () => {
    const note = parse(
      `# Beil\n\n\`\`\`cardsmith   \ncard:\n  system: x\ndata:\n  a: 1\n\`\`\`\n`
    );
    expect(note?.name).toBe("Beil");
    expect(note?.path).toBe("Karten/Beil.md");
    expect(note?.card).toEqual({ system: "x" });
    expect(note?.data).toEqual({ a: 1 });
    expect(note?.table).toBeUndefined();
  });

  it("makes a note without one not a card, and reports nothing", () => {
    const diagnostics = collectDiagnostics();
    expect(parse("# Just a note\n\n```yaml\ncard: x\n```", diagnostics)).toBeUndefined();
    expect(diagnostics.messages).toEqual([]);
  });

  it("reads the first of two blocks and reports the second", () => {
    const diagnostics = collectDiagnostics();
    const note = parse(
      `${BLOCK}\n\n\`\`\`cardsmith\ndata: { price: 99 }\n\`\`\``,
      diagnostics
    );
    expect(note?.data).toEqual({ price: 10 });
    expect(diagnostics.matching("2 cardsmith blocks")).toHaveLength(1);
  });

  it("reports broken YAML with the note named, and the note is not a card", () => {
    const diagnostics = collectDiagnostics();
    expect(parse("```cardsmith\ncard: [\n```", diagnostics)).toBeUndefined();
    expect(
      diagnostics.matching("Karten/Beil.md: the cardsmith block is not valid YAML")
    ).toHaveLength(1);
  });

  it("reads the table: map in both forms, and reports a key it does not know", () => {
    const diagnostics = collectDiagnostics();
    const note = parse(
      "```cardsmith\ncard: { system: x }\ntable:\n  Roll: Wurf\n  stats: [Rationen, Dauer]\ncolumns: { a: b }\n```",
      diagnostics
    );
    expect(note?.table).toEqual({ roll: "Wurf", stats: ["Rationen", "Dauer"] });
    expect(diagnostics.matching('"columns:"')).toHaveLength(1);
  });

  it("keeps an empty block a card with nothing said", () => {
    expect(parse("```cardsmith\n```")?.card).toEqual({});
  });
});

describe("the frontmatter", () => {
  it("is read with the wikilink guard, and only from the first line", () => {
    const note = parse(`---\nBild: [[Beil.png]]\nPreis: 10\n---\n\n${BLOCK}`);
    expect(note?.frontmatter).toEqual({ Bild: "[[Beil.png]]", Preis: 10 });
    expect(parse(`\n---\na: 1\n---\n${BLOCK}`)?.frontmatter).toEqual({});
  });

  it("is empty for a note without one, and reported when broken", () => {
    expect(parse(BLOCK)?.frontmatter).toEqual({});
    const diagnostics = collectDiagnostics();
    parse(`---\na: [\n---\n${BLOCK}`, diagnostics);
    expect(diagnostics.matching("frontmatter is not valid YAML")).toHaveLength(1);
  });

  it("never lets a frontmatter pipe reach the text", () => {
    const note = parse(`---\nBuch: "[[Rules.pdf#page=51|Rules p. 49]]"\n---\n${BLOCK}`);
    expect(note?.text).not.toContain("Rules p. 49");
  });
});

describe("the statblock", () => {
  const statblock = (body: string) => `\`\`\`statblock\n${body}\n\`\`\``;

  it("is read as YAML, with the wikilink guard", () => {
    const note = parse(
      `${statblock("layout: Creature\nhp: 22\ntraits:\n  - Beast\nimage: [[Ratte.png]]")}\n${BLOCK}`
    );
    expect(note?.statblock).toEqual({
      layout: "Creature",
      hp: 22,
      traits: ["Beast"],
      image: "[[Ratte.png]]",
    });
  });

  it("reads a Key:: line as a YAML key, a list continued under it included", () => {
    const note = parse(
      `${statblock(
        'Name:: "Ratte"\nSize:: small\nMerkmale::\n  - name: Tier\n    desc: "a:: b"\nBild::\n'
      )}\n${BLOCK}`
    );
    expect(note?.statblock).toEqual({
      Name: "Ratte",
      Size: "small",
      Merkmale: [{ name: "Tier", desc: "a:: b" }],
      Bild: null,
    });
  });

  it("is empty for a note without one, and the sections never see it", () => {
    expect(parse(BLOCK)?.statblock).toEqual({});
    const note = parse(`Intro.\n\n${statblock("hp: 22")}\n${BLOCK}`);
    expect(note?.sections["body"]).toBe("Intro.");
    expect(note?.text).not.toContain("hp: 22");
  });

  it("reads the first of two blocks and reports the second", () => {
    const diagnostics = collectDiagnostics();
    const note = parse(
      `${statblock("hp: 1")}\n${statblock("hp: 2")}\n${BLOCK}`,
      diagnostics
    );
    expect(note?.statblock).toEqual({ hp: 1 });
    expect(diagnostics.matching("2 statblock blocks")).toHaveLength(1);
  });

  it("reports broken YAML and leaves the note a card", () => {
    const diagnostics = collectDiagnostics();
    const note = parse(`${statblock("hp: [")}\n${BLOCK}`, diagnostics);
    expect(note?.statblock).toEqual({});
    expect(note?.data).toEqual({ price: 10 });
    expect(diagnostics.matching("statblock block is not valid YAML")).toHaveLength(1);
  });

  it("reports a block that is not a mapping, and yields nothing for it", () => {
    const diagnostics = collectDiagnostics();
    expect(parse(`${statblock("- a\n- b")}\n${BLOCK}`, diagnostics)?.statblock).toEqual(
      {}
    );
    expect(diagnostics.matching("statblock block must be a mapping")).toHaveLength(1);
  });
});

describe("the inline fields", () => {
  it("are read from a Key:: line, keyed like a heading, valued like a cell", () => {
    const note = parse(
      [
        "Category:: Wondrous item",
        "**engl**:: Rope of Climbing",
        "Geübte Fertigkeiten:: [[Akrobatik]], [[Ausweichen]]",
        "  Page:: 15",
        "Tags:: [a, b]",
        "Portrait:: ![[Seil.png]]",
        BLOCK,
      ].join("\n")
    );
    expect(note?.fields).toEqual({
      category: "Wondrous item",
      engl: "Rope of Climbing",
      "geübte-fertigkeiten": "[[Akrobatik]], [[Ausweichen]]",
      page: 15,
      tags: ["a", "b"],
      portrait: "![[Seil.png]]",
    });
  });

  it("leave the text without their lines, in the body and in a section alike", () => {
    const note = parse(
      [
        "Intro.",
        "Category:: Wondrous item",
        "",
        "## Notes",
        "Page:: 15",
        "The notes.",
        BLOCK,
      ].join("\n")
    );
    expect(note?.sections["body"]).toBe("Intro.");
    expect(note?.sections["notes"]).toBe("The notes.");
    expect(note?.text).not.toContain("::");
  });

  it("set nothing for an empty value, and the line still goes", () => {
    const note = parse(`Intro.\nDescription::\nCategory:: \n${BLOCK}`);
    expect(note?.fields).toEqual({});
    expect(note?.sections["body"]).toBe("Intro.");
  });

  it("keep the last value of a key written twice", () => {
    expect(parse(`Page:: 1\nPage:: 2\n${BLOCK}`)?.fields).toEqual({ page: 2 });
  });

  it("are text anywhere else — a callout, a list item, mid-line, a code block", () => {
    const text = [
      "> Ansatz:: Verteidigen",
      "- Item:: one",
      "Some prose with [Key:: value] in it.",
      "Key::value",
      "https://example.org",
      "```yaml",
      "Inside:: a code block",
      "```",
      BLOCK,
    ].join("\n");
    const note = parse(text);
    expect(note?.fields).toEqual({});
    expect(note?.sections["body"]).toContain("> Ansatz:: Verteidigen");
    expect(note?.sections["body"]).toContain("- Item:: one");
    expect(note?.sections["body"]).toContain("[Key:: value]");
    expect(note?.sections["body"]).toContain("Key::value");
    expect(note?.sections["body"]).not.toContain("Inside::");
  });
});

describe("the sections", () => {
  it("key the intro as body and each ## heading in kebab-case", () => {
    const note = parse(
      `Intro text.\n\n## Vorderseite\n\nFront **text**.\n\n## Front Side\n\nEnglish.\n\n${BLOCK}`
    );
    expect(note?.sections).toEqual({
      body: "Intro text.",
      vorderseite: "Front **text**.",
      "front-side": "English.",
    });
  });

  it("strip markdown, tags and trailing hashes from the heading", () => {
    expect(sectionKey("**Vorderseite** #card ##")).toBe("vorderseite");
    expect(sectionKey("[[Regeln|Die Regeln]]")).toBe("die-regeln");
    expect(sectionKey("  Über uns  ")).toBe("über-uns");
    expect(sectionKey("#tag")).toBe("");
  });

  it("report a heading that yields no key", () => {
    const diagnostics = collectDiagnostics();
    const note = parse(`## ***\n\nText.\n\n${BLOCK}`, diagnostics);
    expect(note?.sections).toEqual({});
    expect(diagnostics.matching("yields no property name")).toHaveLength(1);
  });

  it("never contain a code block, and drop inline tags", () => {
    const note = parse(
      `Before #tag the block.\n\n${BLOCK}\n\nAfter.\n\n## S\n\n\`\`\`js\nx\n\`\`\`\n\n#done`
    );
    expect(note?.sections["body"]).toBe("Before  the block.\n\n\n\nAfter.");
    expect(note?.sections["s"]).toBeUndefined();
    expect(note?.text).not.toContain("cardsmith");
  });

  it("set nothing for an empty value — a tag line above the block is not a body", () => {
    const note = parse(`#Ausrüstung #Werkzeug\n\n${BLOCK}`);
    expect(note?.sections).toEqual({});
  });

  it("keep ### headings inside their section", () => {
    const note = parse(`## A\n\n### Sub\n\nText.\n\n${BLOCK}`);
    expect(note?.sections["a"]).toBe("### Sub\n\nText.");
  });
});
