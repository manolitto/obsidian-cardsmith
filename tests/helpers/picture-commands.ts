import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { chromium } from "playwright";
import type { BrowserCommand } from "vitest/node";

/**
 * The card pictures in the documentation — `docs/images/cards/<system>/
 * <card-type>.webp`, one card of every card type with its front and back
 * side by side — and their file side, run by vitest in node for the
 * browser project. A browser test has no file system, so it hands over the
 * page a picture is taken of and asks which card types still lack one;
 * under `UPDATE_PICTURES=1` the pictures are taken first, so the answer is
 * none. They are taken through Playwright's Chromium at twice the screen
 * density, as WebP: a parchment texture at that density is 800 KB as PNG
 * and a tenth of it as WebP, with nothing a reader could tell apart.
 *
 *   UPDATE_PICTURES=1 npx vitest run --project browser tests/browser/card-pictures.test.ts
 *
 * Regenerate them whenever a stylesheet or a template changes what a card
 * looks like — the pictures are committed, so a change shows in the diff
 * like a golden does.
 */

const UPDATE = process.env["UPDATE_PICTURES"] === "1";
const PICTURES_DIR = join(__dirname, "..", "..", "docs", "images", "cards");

export interface CardPicture {
  cardType: string;
  /** A complete document whose `<main>` holds the faces to picture. */
  html: string;
}

/**
 * The card types of `system` that have no picture, in the order given;
 * under `UPDATE_PICTURES=1` every picture is written and the answer is
 * empty.
 */
export const cardPictures: BrowserCommand<
  [system: string, pictures: CardPicture[]]
> = async (_ctx, system, pictures): Promise<string[]> => {
  const dir = join(PICTURES_DIR, system);
  if (UPDATE) {
    mkdirSync(dir, { recursive: true });
    // One Chromium for the system's pictures, closed after them: one kept
    // open across the run would hold vitest's process after the last test.
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ deviceScaleFactor: 2 });
      for (const { cardType, html } of pictures) {
        await page.setContent(html, { waitUntil: "load" });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            Array.from(document.images, (img) =>
              img.complete ? Promise.resolve() : img.decode().catch(() => undefined)
            )
          );
        });
        const picture = await page
          .locator("main")
          .screenshot({ type: "webp", quality: 85, omitBackground: true });
        writeFileSync(join(dir, `${cardType}.webp`), picture);
      }
    } finally {
      await browser.close();
    }
  }
  return pictures
    .map(({ cardType }) => cardType)
    .filter((cardType) => !existsSync(join(dir, `${cardType}.webp`)));
};
