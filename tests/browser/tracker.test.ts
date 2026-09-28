import { describe, expect, it } from "vitest";
import { collectDiagnostics } from "../../src/definitions/diagnostics";
import { layoutCard, type LayoutSystem } from "../../src/layout/engine";
import { readScaleFromTransform } from "../../src/layout/font-scaler";
import type { RenderedCard } from "../../src/render/renderer";
import { BASELINE } from "../../src/systems/baseline";
import { trackerHtml } from "../../src/templates/tracker";
import {
  backHtml,
  faceHtml,
  fontReady,
  mountFace,
  paragraphs,
  TEST_FONT_FAMILY,
} from "./helpers/face";

/**
 * The tracker on a laid-out card: boxes of a size a pen can use, wrapping
 * inside the body, and one block the layout engine scales with the text
 * and moves whole — never cut, always on the last front.
 */

const TYPE = `${BASELINE.stylesheet}
.card-root { font: 12px/1.3 "${TEST_FONT_FAMILY}"; padding: 4%; --card-font-size-min: 6px; --card-font-size-title-min: 10px; }
.card-title { font-size: 20px; padding: 0 4%; }
.card-body-scalable p { margin: 0 0 0.5em; }`;

const system: LayoutSystem = { id: "synthetic", stylesheet: async () => TYPE };

const MM = 96 / 25.4;
const ARROWS = trackerHtml({ count: 20, label: "Arrows" }, () => undefined);

function card(body: string, overflowMode: "none" | "extra-cards"): RenderedCard {
  return {
    name: "Synthetic",
    cardTypeId: "card",
    settings: { overflowMode },
    faces: { front: faceHtml({ body }), back: backHtml() },
  };
}

function rootOf(html: string | undefined): HTMLElement {
  const el = document.createElement("div");
  el.innerHTML = html ?? "";
  return el.firstElementChild as HTMLElement;
}

/**
 * Whether a settled front shows its last box whole: the box's bottom edge
 * inside the part of the body the card does not clip. Measured in a
 * shadow root under the card's stylesheet alone, out of the page's flow,
 * as the layout engine measures — placed in the page, the card is
 * squeezed by it and a line moves.
 */
async function lastBoxShows(front: string | undefined): Promise<boolean> {
  const host = document.createElement("div");
  host.style.position = "absolute";
  host.style.left = "-99999px";
  host.style.top = "0";
  document.body.append(host);
  try {
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<style>${TYPE}</style>${front ?? ""}`;
    await document.fonts.ready;
    const body = root.querySelector<HTMLElement>(".card-body-scalable")!;
    const boxes = root.querySelectorAll<HTMLElement>(".cs-tracker-box");
    const last = boxes[boxes.length - 1];
    if (!last) return true;
    return last.getBoundingClientRect().bottom <= body.getBoundingClientRect().bottom;
  } finally {
    host.remove();
  }
}

async function laidOut(body: string, overflowMode: "none" | "extra-cards") {
  const diagnostics = collectDiagnostics();
  const out = await layoutCard(card(body, overflowMode), system, document, diagnostics);
  expect(diagnostics.messages).toEqual([]);
  return out;
}

describe("the boxes", () => {
  it("are 3.5 to 4 mm, drawn in the text colour, and wrap in whole groups inside the body", async () => {
    await fontReady();
    const face = mountFace(faceHtml({ body: `<p>Text.</p>${ARROWS}` }), TYPE);
    try {
      const body = face.root.querySelector<HTMLElement>(".card-body-scalable")!;
      body.style.color = "rgb(10, 20, 30)";
      const boxes = Array.from(
        face.root.querySelectorAll<HTMLElement>(".cs-tracker-box")
      );
      expect(boxes).toHaveLength(20);
      const size = boxes[0]!.getBoundingClientRect();
      expect(size.width / MM).toBeGreaterThanOrEqual(3.49);
      expect(size.width / MM).toBeLessThanOrEqual(4.01);
      expect(size.height).toBeCloseTo(size.width, 1);
      const style = getComputedStyle(boxes[0]!);
      expect(style.borderTopColor).toBe("rgb(10, 20, 30)");
      expect(style.backgroundColor).toBe("rgba(0, 0, 0, 0)");

      const right = body.getBoundingClientRect().right;
      for (const box of boxes)
        expect(box.getBoundingClientRect().right).toBeLessThanOrEqual(right + 0.5);

      // No line breaks inside a group of five that fits on a line.
      for (const group of Array.from(face.root.querySelectorAll(".cs-tracker-group"))) {
        const tops = new Set(
          Array.from(group.children).map((box) =>
            Math.round(box.getBoundingClientRect().top)
          )
        );
        expect(tops.size).toBe(1);
      }
    } finally {
      face.unmount();
    }
  });

  it("stand beside the label when they fit there, and below it when they do not", async () => {
    await fontReady();
    const short = trackerHtml({ count: 3, label: "Per rest" }, () => undefined);
    const face = mountFace(faceHtml({ body: `${short}${ARROWS}` }), TYPE);
    try {
      const rows = Array.from(face.root.querySelectorAll(".cs-tracker-row"));
      const top = (row: Element, selector: string) =>
        Math.round(row.querySelector(selector)!.getBoundingClientRect().top);
      const beside = rows[0]!;
      expect(top(beside, ".cs-tracker-box")).toBeLessThanOrEqual(
        Math.round(
          beside.querySelector(".cs-tracker-label")!.getBoundingClientRect().bottom
        )
      );
      const below = rows[1]!;
      expect(top(below, ".cs-tracker-box")).toBeGreaterThanOrEqual(
        Math.round(
          below.querySelector(".cs-tracker-label")!.getBoundingClientRect().bottom
        )
      );
    } finally {
      face.unmount();
    }
  });
});

describe("a tracker on a card that overflows", () => {
  it("is moved whole to the last front, as the last block of its body, however much text precedes it", async () => {
    await fontReady();
    let spilled = 0;
    for (let n = 4; n <= 24; n += 2) {
      const out = await laidOut(`${paragraphs(n)}${ARROWS}`, "extra-cards");
      expect(out.clipped).toBe(false);
      const fronts = out.cards.map((pair) => rootOf(pair.front));
      const holding = fronts.filter((front) => front.querySelector(".cs-tracker"));
      expect(holding, `${n} paragraphs`).toHaveLength(1);
      expect(holding[0]).toBe(fronts[fronts.length - 1]);
      expect(holding[0]!.querySelectorAll(".cs-tracker-box")).toHaveLength(20);
      const body = holding[0]!.querySelector(".card-body-scalable")!;
      expect(body.lastElementChild?.classList.contains("cs-tracker")).toBe(true);
      expect(
        await lastBoxShows(out.cards[fronts.indexOf(holding[0]!)]!.front),
        `${n} paragraphs`
      ).toBe(true);
      if (fronts.length > 1) spilled++;
    }
    // The run crosses the point where the text no longer fits one card.
    expect(spilled).toBeGreaterThan(0);
  });
});

describe("a tracker on a dense card", () => {
  it("is counted when the body is scaled to fit", async () => {
    await fontReady();
    // The smallest run of paragraphs the scaler has to shrink for: the
    // tracker under it must shrink it further, and still fit.
    let n = 2;
    let without = 1;
    for (; n <= 30; n++) {
      const out = await laidOut(paragraphs(n), "none");
      without = readScaleFromTransform(
        rootOf(out.cards[0]!.front).querySelector<HTMLElement>(".card-body-scalable")!
      );
      if (without < 0.9) break;
    }
    expect(without).toBeLessThan(0.9);
    const out = await laidOut(`${paragraphs(n)}${ARROWS}`, "none");
    expect(out.clipped).toBe(false);
    const front = rootOf(out.cards[0]!.front);
    const scale = readScaleFromTransform(
      front.querySelector<HTMLElement>(".card-body-scalable")!
    );
    expect(scale).toBeLessThan(without);
    expect(await lastBoxShows(out.cards[0]!.front)).toBe(true);
    expect(front.querySelectorAll(".cs-tracker-box")).toHaveLength(20);
  });
});
