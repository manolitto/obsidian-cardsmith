import { describe, expect, it } from "vitest";
import { collectDiagnostics } from "../src/definitions/diagnostics";
import { parseNote } from "../src/render/note";
import { CardRenderer } from "../src/render/renderer";
import { BASELINE } from "../src/systems/baseline";
import { TemplateEngine } from "../src/templates/engine";
import {
  DEFAULT_GROUP,
  MAX_COUNT,
  parseTracker,
  trackerHtml,
  type TrackerRow,
} from "../src/templates/tracker";
import { loadedSystem } from "./helpers/render";

/**
 * The tracker: a value read into rows of boxes, the rows as markup, and
 * the property reaching a front — through a template that places it, and
 * through the engine where no template does.
 */

function parse(value: unknown): { rows: TrackerRow[]; reports: string[] } {
  const reports: string[] = [];
  const rows = parseTracker(value, (message) => reports.push(message));
  return { rows, reports };
}

/** How many boxes each group of each row holds, as the markup has them. */
function groupsOf(html: string): number[][] {
  return [...html.matchAll(/<div class="cs-tracker-row">(.*?)<\/span><\/div>/g)].map(
    (row) =>
      [
        ...(row[1] as string).matchAll(
          /<span class="cs-tracker-group">(.*?)<\/span><\/span>/g
        ),
      ].map(
        (group) => ((group[1] as string) + "</span>").split("cs-tracker-box").length - 1
      )
  );
}

function labelsOf(html: string): string[] {
  return [
    ...html.matchAll(
      /<span class="cs-tracker-label">(.*?)<\/span><span class="cs-tracker-boxes">/g
    ),
  ].map((m) => m[1] as string);
}

describe("parseTracker", () => {
  it("reads a number as one row of that many boxes", () => {
    expect(parse(20)).toEqual({
      rows: [{ count: 20, group: DEFAULT_GROUP }],
      reports: [],
    });
  });

  it("reads a number written as text — a table cell, an inline field", () => {
    expect(parse(" 7 ").rows).toEqual([{ count: 7, group: 5 }]);
  });

  it("reads a labelled row, its keys in any case", () => {
    expect(parse({ Count: 20, LABEL: "Pfeile" }).rows).toEqual([
      { count: 20, group: 5, label: "Pfeile" },
    ]);
  });

  it("reads a group size", () => {
    expect(parse({ count: 12, group: 4 }).rows).toEqual([{ count: 12, group: 4 }]);
    expect(parse({ count: 12, group: "3" }).rows).toEqual([{ count: 12, group: 3 }]);
  });

  it("reads a list as several rows, numbers and rows mixed", () => {
    expect(
      parse([
        { count: 7, label: "Ladungen" },
        { count: 3, label: "Pro Rast", group: 3 },
        4,
      ]).rows
    ).toEqual([
      { count: 7, group: 5, label: "Ladungen" },
      { count: 3, group: 3, label: "Pro Rast" },
      { count: 4, group: 5 },
    ]);
  });

  it("reads an empty value, and a count of 0, as no rows and no report", () => {
    for (const value of [undefined, null, "", [], 0, { count: 0 }]) {
      expect(parse(value)).toEqual({ rows: [], reports: [] });
    }
  });

  it("reports a count that is not a whole number in range, and leaves the row out", () => {
    for (const value of [
      -3,
      2.5,
      "twenty",
      MAX_COUNT + 1,
      { label: "Pfeile" },
      { count: true },
    ]) {
      const { rows, reports } = parse(value);
      expect(rows).toEqual([]);
      expect(reports).toHaveLength(1);
    }
    expect(parse([5, "x", 3]).rows.map((r) => r.count)).toEqual([5, 3]);
  });

  it("reports a bad group and a stray key, and still prints the row", () => {
    expect(parse({ count: 6, group: 0, colour: "red" })).toEqual({
      rows: [{ count: 6, group: 5 }],
      reports: [
        '"colour" is not a tracker field (count, label, group are); ignoring it',
        "group: 0 is not a whole number from 1; using 5",
      ],
    });
  });

  it("drops an empty label", () => {
    expect(parse({ count: 2, label: "  " }).rows).toEqual([{ count: 2, group: 5 }]);
  });
});

describe("trackerHtml", () => {
  const quiet = () => undefined;

  it("draws a count in groups of five, the last group the remainder", () => {
    const html = trackerHtml(12, quiet);
    expect(groupsOf(html)).toEqual([[5, 5, 2]]);
    expect(html.split('class="cs-tracker-box"').length - 1).toBe(12);
  });

  it("is one block the splitter keeps whole", () => {
    expect(trackerHtml(3, quiet)).toMatch(/^<div class="cs-tracker cs-keep-together">/);
  });

  it("groups by the row's own size", () => {
    expect(groupsOf(trackerHtml({ count: 7, group: 3 }, quiet))).toEqual([[3, 3, 1]]);
    expect(groupsOf(trackerHtml({ count: 4, group: 10 }, quiet))).toEqual([[4]]);
  });

  it("puts each label before its row's boxes, as inline markdown", () => {
    const html = trackerHtml(
      [
        { count: 7, label: "**Ladungen**" },
        { count: 3, label: "Pro [[Rast|langer Rast]]" },
      ],
      quiet
    );
    expect(groupsOf(html)).toEqual([[5, 2], [3]]);
    expect(labelsOf(html)).toEqual([
      "<strong>Ladungen</strong>",
      'Pro <span class="cs-wikilink">langer Rast</span>',
    ]);
    expect(html.indexOf("cs-tracker-label")).toBeLessThan(
      html.indexOf("cs-tracker-group")
    );
  });

  it("escapes markup in a label", () => {
    expect(labelsOf(trackerHtml({ count: 1, label: "<b>x</b>" }, quiet))).toEqual([
      "&lt;b&gt;x&lt;/b&gt;",
    ]);
  });

  it("is empty when there is nothing to draw", () => {
    expect(trackerHtml(0, quiet)).toBe("");
    expect(trackerHtml(undefined, quiet)).toBe("");
  });
});

describe("the tracker property", () => {
  it("is in the baseline, bound to front-tracker, with its aliases and both descriptions", () => {
    const def = BASELINE.properties["tracker"];
    expect(def?.slot).toEqual(["front-tracker"]);
    expect(def?.aliases).toEqual(
      expect.arrayContaining([
        "boxes",
        "kästchen",
        "kaestchen",
        "ankreuzfelder",
        "abstreichen",
      ])
    );
    expect(Object.keys(def?.description as object)).toEqual(["de", "en"]);
  });
});

// ── Through the pipeline ───────────────────────────────────────────

async function render(text: string, system: string) {
  const diagnostics = collectDiagnostics();
  const note = parseNote(text, `${system}/Note.md`, diagnostics);
  if (!note) throw new Error("not a card note");
  const renderer = new CardRenderer(new TemplateEngine(), {
    resolve: () => Promise.resolve(undefined),
  });
  const cards = await renderer.render(note, await loadedSystem(system), diagnostics);
  return { cards, messages: diagnostics.messages };
}

const block = (system: string, cardType: string, data: string) =>
  [
    "```cardsmith",
    "card:",
    `  system: ${system}`,
    `  card-type: ${cardType}`,
    "data:",
    "  name: Pfeile",
    "  description: Jeder Angriff verbraucht ein Geschoss.",
    ...data.split("\n").map((line) => `  ${line}`),
    "```",
  ].join("\n");

const boxes = (html: string | undefined) =>
  (html ?? "").split('class="cs-tracker-box"').length - 1;

describe("a card with a tracker", () => {
  it("reads the property under every alias", async () => {
    for (const key of [
      "tracker",
      "boxes",
      "Kästchen",
      "kaestchen",
      "ankreuzfelder",
      "abstreichen",
    ]) {
      const { cards, messages } = await render(
        block("simple", "simple", `${key}: 4`),
        "simple"
      );
      expect(messages).toEqual([]);
      expect(boxes(cards[0]?.faces.front), key).toBe(4);
    }
  });

  it("reads it from the frontmatter and from an inline field", async () => {
    const front = `---\nkästchen: 6\n---\n${block("simple", "simple", "")}`;
    expect(boxes((await render(front, "simple")).cards[0]?.faces.front)).toBe(6);
    const field = `Abstreichen:: 9\n\n${block("simple", "simple", "")}`;
    expect(boxes((await render(field, "simple")).cards[0]?.faces.front)).toBe(9);
  });

  it("reads it from a table row, one card per row", async () => {
    const text = [
      "| Name | Ladungen |",
      "| --- | --- |",
      "| Zauberstab | 7 |",
      "| Stab | 3 |",
      "| Ring |  |",
      "",
      "```cardsmith",
      "card:",
      "  system: simple",
      "table:",
      "  name: Name",
      "  tracker: Ladungen",
      "```",
    ].join("\n");
    const { cards, messages } = await render(text, "simple");
    expect(messages).toEqual([]);
    expect(cards.map((card) => boxes(card.faces.front))).toEqual([7, 3, 0]);
  });

  it("appends the boxes to the end of the body when no template places them", async () => {
    // simple's front reads no front-tracker: the engine puts the tracker
    // after the body's last block, inside `.card-body-scalable`.
    const { cards } = await render(
      block("simple", "simple", "tracker: { count: 20, label: Pfeile }"),
      "simple"
    );
    const front = cards[0]?.faces.front ?? "";
    expect(boxes(front)).toBe(20);
    const body = front.indexOf("card-body-scalable");
    const tracker = front.indexOf('<div class="cs-tracker cs-keep-together"');
    const text = front.indexOf("Jeder Angriff");
    expect(body).toBeGreaterThan(-1);
    expect(text).toBeLessThan(tracker);
    // Only the body's end tag, the content container's and the rest of the
    // face follow the tracker's own markup.
    const after = front.slice(
      front.indexOf("</span></div></div>", tracker) + "</span></div></div>".length
    );
    expect(after.trimStart().startsWith("</div>")).toBe(true);
    expect(cards[0]?.faces.back).not.toContain("cs-tracker");
  });

  it("is placed where a template says, under 5E's red rule, and only there", async () => {
    const { cards, messages } = await render(
      block("5e_2014", "item", "tracker: { count: 20, label: Pfeile }"),
      "5e_2014"
    );
    expect(messages).toEqual([]);
    const front = cards[0]?.faces.front ?? "";
    expect(front.split('class="cs-tracker cs-keep-together"').length - 1).toBe(1);
    expect(front).toMatch(
      /<div class="cs-keep-together dd-tracker">\s*<svg class="dd-rule"[^>]*>.*?<\/svg>\s*<div class="cs-tracker cs-keep-together">/s
    );
  });

  it("prints nothing extra on a card without one", async () => {
    const { cards } = await render(block("5e_2014", "item", ""), "5e_2014");
    expect(cards[0]?.faces.front).not.toContain("tracker");
  });

  it("reports what it cannot read, naming the card type", async () => {
    const { cards, messages } = await render(
      block("simple", "simple", "tracker: zwanzig"),
      "simple"
    );
    expect(boxes(cards[0]?.faces.front)).toBe(0);
    expect(messages).toEqual([
      `tracker in simple/simple: "zwanzig" is not a number of boxes from 0 to ${MAX_COUNT}; leaving it out`,
    ]);
  });
});
