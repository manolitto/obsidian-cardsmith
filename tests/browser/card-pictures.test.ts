import { describe, expect, it } from "vitest";
import { commands } from "vitest/browser";
import { collectDiagnostics } from "../../src/definitions/diagnostics";
import { BUNDLED_SYSTEMS } from "../../src/generated/bundled-systems";
import { layoutCard, type LaidOutCard } from "../../src/layout/engine";
import { OVERFLOW_ACTIVE_CLASS } from "../../src/layout/overflow-splitter";
import { escapeHtml } from "../../src/templates/inline-markdown";
import type { CardPicture } from "../helpers/picture-commands";
import { loadedSystem } from "../helpers/render";
import { listFixtures, renderFixture } from "./helpers/fixtures";

/**
 * The card pictures in the documentation: one card of every card type of
 * every bundled system, front and back side by side, under
 * `docs/images/cards/<system>/<card-type>.webp`. The card is a fixture note
 * of the system — the first in path order of that card type whose front
 * holds everything, so that its back is the designed one and not a
 * continuation, else simply the first — rendered and laid out through the
 * real engine, so the picture is what the plugin prints. Without the
 * flag a card type whose picture is missing fails, the way a documentation
 * example that drifts from the tree does; with it the pictures are taken.
 *
 *   UPDATE_PICTURES=1 npx vitest run --project browser tests/browser/card-pictures.test.ts
 */

declare module "vitest/browser" {
  interface BrowserCommands {
    cardPictures(system: string, pictures: CardPicture[]): Promise<string[]>;
  }
}

describe.each(BUNDLED_SYSTEMS.map((s) => s.id))("the %s system", (systemId) => {
  it("has a picture of every card type in the documentation", async () => {
    const system = await loadedSystem(systemId);
    const laidOut: LaidOutCard[] = [];
    for (const fixture of listFixtures().filter((f) => f.system === systemId)) {
      for (const rendered of await renderFixture(fixture)) {
        const diagnostics = collectDiagnostics();
        laidOut.push(await layoutCard(rendered, system, document, diagnostics));
        expect(diagnostics.messages).toEqual([]);
      }
    }

    const pictures: CardPicture[] = [];
    for (const cardType of Object.keys(system.cardTypes)) {
      const ofType = laidOut.filter((card) => card.cardTypeId === cardType);
      const sample = ofType.find(fitsOnTheFront) ?? ofType[0];
      expect(sample, `${systemId}/${cardType} has no fixture note`).toBeDefined();
      const faces = sample!.cards[0]!;
      pictures.push({
        cardType,
        html: pictureDocument(
          `${systemId} ${cardType}`,
          await system.stylesheet(cardType),
          [faces.front, faces.back].filter((face) => face !== undefined)
        ),
      });
    }

    expect(
      await commands.cardPictures(systemId, pictures),
      "card types without a picture — run with UPDATE_PICTURES=1 to take them"
    ).toEqual([]);
  });
});

/** One physical card whose front the overflow engine never split. */
function fitsOnTheFront(card: LaidOutCard): boolean {
  return (
    card.cards.length === 1 && !card.cards[0]!.front?.includes(OVERFLOW_ACTIVE_CLASS)
  );
}

/**
 * The page a picture is taken of: the faces in a row on nothing, each with
 * a hair of shadow so a white card has an edge on a white page too. The
 * picture is of `<main>`, which is exactly as wide as its faces.
 */
function pictureDocument(title: string, css: string, faces: string[]): string {
  return [
    "<!doctype html>",
    `<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>`,
    "<style>",
    "body { margin: 0; background: transparent; }",
    "main { display: inline-flex; gap: 24px; padding: 8px; }",
    ".card-root { box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35); }",
    "</style>",
    `<style>\n${css}\n</style>`,
    "</head><body><main>",
    ...faces,
    "</main></body></html>",
  ].join("\n");
}
