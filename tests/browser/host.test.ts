/// <reference types="vite/client" />
import { afterEach, describe, expect, it } from "vitest";
import sourceSans from "../../resources/systems/simple/fonts/source-sans-3-normal-latin.woff2?inline";
import {
  hoistFontFaces,
  mountLayoutHost,
  waitForSettledLayout,
  type LayoutHost,
} from "../../src/layout/host";
import { BASELINE } from "../../src/systems/baseline";
import { backHtml, faceHtml, paragraphs } from "./helpers/face";

/**
 * The measurement host: faces on the page under a stylesheet, hidden, with
 * their fonts and images ready to be measured.
 */

const FAMILY = "Host Sans";
const FONT_RULE = `@font-face { font-family: "${FAMILY}"; src: url("${sourceSans}") format("woff2"); }`;
const TYPE = `.card-root { font: 12px/1.3 "${FAMILY}", serif; padding: 4%; }`;

let host: LayoutHost | undefined;
afterEach(() => {
  host?.remove();
  host = undefined;
  document.head.querySelectorAll("style[data-cs-fonts]").forEach((s) => s.remove());
});

const front = faceHtml({ body: paragraphs(2) });

describe("mountLayoutHost", () => {
  it("lays the faces out hidden and off-screen, and reads them back in order", () => {
    host = mountLayoutHost(document, "test", `${BASELINE.stylesheet}\n${TYPE}`, [
      front,
      backHtml(),
    ]);
    const roots = host.root.querySelectorAll<HTMLElement>(".card-root");
    expect(roots).toHaveLength(2);
    expect(roots[0]!.getBoundingClientRect().width).toBeCloseTo((63 / 25.4) * 96, 0);
    const wrapper = (host.root.host as HTMLElement).style;
    expect(wrapper.visibility).toBe("hidden");
    expect(wrapper.position).toBe("absolute");

    const faces = host.faces();
    expect(faces).toHaveLength(2);
    expect(faces[0]).toMatch(/^<div class="card-root card-front/);
    expect(faces[1]).toMatch(/^<div class="card-root card-back/);
    expect(faces[0]).not.toContain("cs-face");

    host.remove();
    expect(document.body.contains(host.root.host)).toBe(false);
    host = undefined;
  });
});

describe("pinImages", () => {
  // A 2×3 PNG and a 4×6 SVG, set to a width, so each has a height the
  // measurement can be checked against.
  const PNG =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAADCAYAAAC56t6BAAAAEklEQVQIW2NkYGD4z8DAwMgAAAgxAQFoxJyQAAAAAElFTkSuQmCC";
  const SVG =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="6"><rect width="4" height="6"/></svg>'
    );
  const picture = (src: string) => `<img src="${src}" style="display:block; width:20px">`;

  it("measures the same picture through a blob URL and hands the data URI back", async () => {
    host = mountLayoutHost(document, "pin", `${BASELINE.stylesheet}\n${TYPE}`, [
      faceHtml({ body: picture(PNG) + picture(SVG) }),
      backHtml(),
    ]);
    await waitForSettledLayout(host.root);
    await host.pinImages();
    const imgs = host.root.querySelectorAll("img");
    expect(imgs).toHaveLength(2);
    for (let i = 0; i < imgs.length; i++) {
      expect(imgs[i]!.src).toMatch(/^blob:/);
      expect(imgs[i]!.complete).toBe(true);
    }
    expect(imgs[0]!.getBoundingClientRect().height).toBe(30);
    expect(imgs[1]!.getBoundingClientRect().height).toBe(30);

    // A restore from the HTML string — what the splitter does on every
    // trial — parses the short URL and the picture is there at once.
    const body = host.root.querySelector<HTMLElement>(".card-body-scalable")!;
    const snapshot = body.innerHTML;
    expect(snapshot).not.toContain("data:");
    body.innerHTML = snapshot;
    const restored = body.querySelector("img")!;
    expect(restored.complete).toBe(true);
    expect(restored.getBoundingClientRect().height).toBe(30);

    const [front] = host.faces();
    expect(front).toContain(`src="${PNG}"`);
    expect(front).toContain(`src="${SVG}"`);
    expect(front).not.toContain("blob:");
  });

  it("swaps a string's base64 pictures for the same blob URLs", async () => {
    host = mountLayoutHost(document, "pin", `${BASELINE.stylesheet}\n${TYPE}`, [
      faceHtml({ body: picture(PNG) }),
    ]);
    await waitForSettledLayout(host.root);
    await host.pinImages();
    const url = host.root.querySelector("img")!.src;
    const html = `<p>x</p>${picture(PNG)}${picture(SVG)}`;
    const pinned = host.pin(html);
    expect(pinned).toContain(`src="${url}"`);
    expect(pinned).toContain(`src="${SVG}"`);
  });

  it("releases the blobs with the host", async () => {
    host = mountLayoutHost(document, "pin", `${BASELINE.stylesheet}\n${TYPE}`, [
      faceHtml({ body: picture(PNG) }),
    ]);
    await waitForSettledLayout(host.root);
    await host.pinImages();
    const url = host.root.querySelector("img")!.src;
    host.remove();
    host = undefined;
    await expect(fetch(url)).rejects.toThrow();
  });
});

describe("hoistFontFaces", () => {
  it("moves the @font-face rules into one style element per system", () => {
    const css = `${FONT_RULE}\n\n.a { color: red; }`;
    const stripped = hoistFontFaces(document, "sys", css);
    expect(stripped).not.toContain("@font-face");
    expect(stripped).toContain(".a { color: red; }");
    const style = document.head.querySelector('style[data-cs-fonts="sys"]');
    expect(style).not.toBeNull();
    expect(style!.textContent).toBe(FONT_RULE);
  });

  it("adds a rule once, however many stylesheets carry it", () => {
    hoistFontFaces(document, "sys", `${FONT_RULE}\n.a {}`);
    hoistFontFaces(document, "sys", `${FONT_RULE}\n.b {}`);
    const other = `@font-face { font-family: "Other"; src: local("serif"); }`;
    hoistFontFaces(document, "sys", `${FONT_RULE}\n${other}\n.c {}`);
    const style = document.head.querySelector('style[data-cs-fonts="sys"]')!;
    expect(style.textContent!.split("@font-face")).toHaveLength(3);
    expect(style.textContent).toContain(other);
    expect(document.head.querySelectorAll("style[data-cs-fonts]")).toHaveLength(1);
  });

  it("keeps systems apart", () => {
    hoistFontFaces(document, "one", FONT_RULE);
    hoistFontFaces(document, "two", FONT_RULE);
    expect(document.head.querySelectorAll("style[data-cs-fonts]")).toHaveLength(2);
  });

  it("leaves a stylesheet without fonts alone", () => {
    expect(hoistFontFaces(document, "sys", ".a {}")).toBe(".a {}");
    expect(document.head.querySelector('style[data-cs-fonts="sys"]')).toBeNull();
  });
});

describe("waitForSettledLayout", () => {
  it("resolves with the card's web font loaded, so the text measures in it", async () => {
    // The same face once in the web font and once in the fallback: after the
    // wait the two differ, which they cannot while the font is still pending.
    host = mountLayoutHost(
      document,
      "fonts",
      `${BASELINE.stylesheet}\n${FONT_RULE}\n${TYPE}\n.fallback { font-family: serif; }`,
      [front]
    );
    await waitForSettledLayout(host.root);
    expect(document.fonts.check(`12px "${FAMILY}"`)).toBe(true);
    const p = host.root.querySelector<HTMLElement>(".card-body-scalable p")!;
    const inFont = p.getBoundingClientRect().height;
    p.classList.add("fallback");
    expect(p.getBoundingClientRect().height).not.toBe(inFont);
  });

  it("resolves with every image decoded", async () => {
    const svg =
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="60"><rect width="40" height="60"/></svg>'
      );
    host = mountLayoutHost(document, "images", `${BASELINE.stylesheet}\n${TYPE}`, [
      faceHtml({ body: `<img src="${svg}" style="display:block; width:40px">` }),
    ]);
    await waitForSettledLayout(host.root);
    const img = host.root.querySelector("img")!;
    expect(img.complete).toBe(true);
    expect(img.getBoundingClientRect().height).toBe(60);
  });

  it("gives up on a broken image rather than hanging", async () => {
    host = mountLayoutHost(document, "broken", `${BASELINE.stylesheet}\n${TYPE}`, [
      faceHtml({ body: `<img src="data:image/png;base64,AAAA">` }),
    ]);
    await waitForSettledLayout(host.root);
    expect(host.root.querySelector("img")!.complete).toBe(true);
  });
});
