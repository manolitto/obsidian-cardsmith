import { expect, it } from "vitest";
import { collectDiagnostics } from "../../src/definitions/diagnostics";
import { layoutCard } from "../../src/layout/engine";
import { loadedSystem, renderNote } from "../helpers/render";

/**
 * A Dragonbane stat cell is one short value, set on one line — but a value
 * that is longer than the stat box is wide ("2 (bei Wuchtschaden: 4)" behind
 * the label "Rüstungswert") has to wrap inside the box rather than run out
 * past its torn edge. Checked on the settled face, under the real stylesheet.
 * A break the value sets itself is kept, in a cell and in a wide row alike.
 */

const NOTE = `---
Name: Beschlagenes Leder
Art: Rüstung
Rüstungswert: "2 (bei Wuchtschaden: 4)"
Preis: 10 Gold
Verfügbarkeit: Ungewöhnlich
---

\`\`\`cardsmith
card:
  system: dragonbane
  card-type: gear
  language: de
\`\`\`
`;

const BROKEN = NOTE.replace(
  'Rüstungswert: "2 (bei Wuchtschaden: 4)"',
  'Rüstungswert: "2\\n(bei Wuchtschaden: 4)"\nEffekt: "[[Nachteil]] auf\\nHEIMLICHKEIT"'
);

async function render(text: string) {
  const [card] = await renderNote(
    text,
    "dragonbane/Beschlagenes Leder.md",
    "dragonbane",
    {
      resolve: () => Promise.resolve(undefined),
    }
  );
  return card!;
}

it("keeps a break the value sets, in a stat cell and in a wide row", async () => {
  const host = document.createElement("div");
  host.innerHTML = (await render(BROKEN)).faces.front!;
  const cell = host.querySelector(".db-stats-row > .db-stat")!;
  expect(cell.innerHTML).toContain("2<br>(bei Wuchtschaden: 4)");
  const wide = host.querySelector(".db-stats-row-wide .db-trait")!;
  expect(wide.innerHTML).toMatch(/Nachteil<\/span> auf<br>HEIMLICHKEIT/);
});

it("wraps a stat value too long for the box inside the box", async () => {
  const system = await loadedSystem("dragonbane");
  const card = await render(NOTE);
  const out = await layoutCard(card, system, document, collectDiagnostics());
  const style = document.createElement("style");
  style.textContent = await system.stylesheet("gear");
  const host = document.createElement("div");
  host.innerHTML = out.cards[0]!.front!;
  document.head.append(style);
  document.body.append(host);
  try {
    await document.fonts.ready;
    const box = host.querySelector<HTMLElement>(".db-stats-box")!;
    const inner = box.getBoundingClientRect();
    const cs = getComputedStyle(box);
    const right =
      inner.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth);
    const cells = Array.from(
      box.querySelectorAll<HTMLElement>(".db-stats-row > .db-stat")
    );
    expect(cells.length).toBe(3);
    for (const cell of cells) {
      const range = document.createRange();
      range.selectNodeContents(cell);
      expect(range.getBoundingClientRect().right, cell.textContent!).toBeLessThanOrEqual(
        right + 0.5
      );
    }
  } finally {
    host.remove();
    style.remove();
  }
});
