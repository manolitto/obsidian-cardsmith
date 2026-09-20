import { expect, it } from "vitest";
import { collectDiagnostics } from "../../src/definitions/diagnostics";
import { layoutCard } from "../../src/layout/engine";
import { loadedSystem } from "../helpers/render";
import { listFixtures, renderFixture } from "./helpers/fixtures";

/**
 * The Eiserne Zeit logo is all or nothing: the last face draws it only when
 * the band under the text gets at least 30 % of the body's height, and a
 * band any shorter draws nothing. The stylesheet decides this with a
 * container query, so it is checked on settled faces under the real
 * stylesheet — every face of every Eiserne Zeit fixture, against the
 * band's measured share — and the fixtures must exercise both outcomes.
 */

const THRESHOLD = 0.3;

it("draws the logo only where its band reaches 30 % of the body", async () => {
  const system = await loadedSystem("eiserne-zeit");
  const style = document.createElement("style");
  style.textContent = await system.stylesheet("generic");
  document.head.append(style);
  const host = document.createElement("div");
  document.body.append(host);
  const seen = { drawn: [] as string[], suppressed: [] as string[] };
  try {
    for (const fixture of listFixtures().filter((f) => f.system === "eiserne-zeit")) {
      for (const rendered of await renderFixture(fixture)) {
        const out = await layoutCard(rendered, system, document, collectDiagnostics());
        const faces = out.cards.flatMap((pair) => [pair.front, pair.back]);
        faces.forEach((html, i) => {
          if (!html) return;
          host.innerHTML = html;
          const band = host.querySelector<HTMLElement>(".ez-logo-band");
          if (!band || getComputedStyle(band).display === "none") return;
          const body = host.querySelector<HTMLElement>(".card-body-scalable")!;
          const share =
            band.getBoundingClientRect().height / body.getBoundingClientRect().height;
          const logo = host.querySelector<HTMLElement>(".ez-logo")!;
          const drawn = getComputedStyle(logo).display !== "none";
          const label = `${fixture.name} face ${i + 1} (${(share * 100).toFixed(0)} %)`;
          expect(drawn, label).toBe(share >= THRESHOLD);
          (drawn ? seen.drawn : seen.suppressed).push(label);
        });
      }
    }
  } finally {
    host.remove();
    style.remove();
  }
  expect(seen.drawn.length).toBeGreaterThan(0);
  expect(seen.suppressed.length).toBeGreaterThan(0);
});
