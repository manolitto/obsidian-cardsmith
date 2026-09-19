import { FACE_CLASS } from "./overflow-splitter";

/*
 * The measurement host: a card's faces on the page, hidden, under the
 * card's stylesheet, so the layout engine can read real boxes.
 *
 * The host is an off-screen `div` with a shadow root. The shadow root
 * keeps the card's stylesheet from touching the page and the page's from
 * touching the card; the `div` is `visibility: hidden` rather than
 * `display: none`, since a face that is not displayed has no layout to
 * measure. Inside, one `.cs-face` wrapper per face in print order, in a
 * container the overflow splitter appends further wrappers to.
 *
 * One thing the shadow root cannot do is load a font: an `@font-face` rule
 * inside a shadow tree never registers with the document, and the text lays
 * out in the fallback face. The host therefore lifts every `@font-face` out
 * of the stylesheet into one `<style>` per system in the document's head,
 * kept across cards — the rules carry the font files as data URIs, and a
 * deck would otherwise parse them once per card.
 *
 * DOM only. No Obsidian, no globals: the document is the caller's, so the
 * engine runs in the plugin window and in the browser test alike.
 */

export interface LayoutHost {
  /** What the splitter is handed: the shadow root the faces lay out in. */
  root: ShadowRoot;
  /**
   * Swap every picture's data URI for a blob URL and resolve once the
   * pictures have decoded again. Call it with the faces settled and faded,
   * before anything measures or restores them.
   */
  pinImages(): Promise<void>;
  /**
   * The same swap on an HTML string the splitter will parse repeatedly.
   * Base64 payloads only: a percent-encoded one may carry entities in its
   * HTML form, and it is short anyway.
   */
  pin(html: string): string;
  /** Every face's `.card-root` in print order, as HTML, wrappers dropped, pictures as data URIs again. */
  faces(): string[];
  /** Take the host off the page. */
  remove(): void;
}

/**
 * Put the faces on the page. `stylesheet` is the card's whole cascade —
 * baseline, system, card type — as `LoadedSystem.stylesheet` assembles it;
 * `systemId` keys the hoisted fonts.
 */
export function mountLayoutHost(
  doc: Document,
  systemId: string,
  stylesheet: string,
  faces: readonly string[]
): LayoutHost {
  const css = hoistFontFaces(doc, systemId, stylesheet);

  const host = doc.createElement("div");
  host.style.position = "absolute";
  host.style.left = "-99999px";
  host.style.top = "0";
  host.style.visibility = "hidden";
  host.setAttribute("aria-hidden", "true");
  doc.body.appendChild(host);

  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>${css}</style><div>${faces
    .map((face) => `<div class="${FACE_CLASS}">${face}</div>`)
    .join("")}</div>`;

  const win = doc.defaultView;
  /** Blob URL → the data URI it stands in for. */
  const pinned = new Map<string, string>();
  const pin = (uri: string): string => {
    if (!win) return uri;
    for (const [url, held] of pinned) if (held === uri) return url;
    const blob = blobOfDataUri(uri);
    if (!blob) return uri;
    const url = win.URL.createObjectURL(blob);
    pinned.set(url, uri);
    return url;
  };

  return {
    root,
    async pinImages() {
      const imgs = root.querySelectorAll("img");
      const decoding: Promise<void>[] = [];
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i]!;
        const uri = img.getAttribute("src") ?? "";
        const url = pin(uri);
        if (url === uri) continue;
        img.src = url;
        decoding.push(
          img.decode().catch(() => {
            // The blob would not decode where the data URI did: undo this one.
            img.src = uri;
          })
        );
      }
      await Promise.all(decoding);
    },
    pin(html) {
      return html.replace(
        / src="(data:[^";]*;base64,[^"]*)"/g,
        (_, uri: string) => ` src="${pin(uri)}"`
      );
    },
    faces() {
      const out: string[] = [];
      const wrappers = root.querySelectorAll(`.${FACE_CLASS}`);
      for (let i = 0; i < wrappers.length; i++) {
        const cardRoot = wrappers[i]!.querySelector(".card-root");
        if (!cardRoot) continue;
        let html = cardRoot.outerHTML;
        for (const [url, uri] of pinned) html = html.split(url).join(uri);
        out.push(html);
      }
      return out;
    },
    remove() {
      host.remove();
      if (win) for (const url of pinned.keys()) win.URL.revokeObjectURL(url);
      pinned.clear();
    },
  };
}

/**
 * The bytes a data URI carries, as a blob of its media type; `undefined`
 * for anything that is not a well-formed data URI, which then stays as it
 * is. Base64 payloads are decoded, percent-encoded ones (an inline SVG)
 * unescaped.
 */
function blobOfDataUri(uri: string): Blob | undefined {
  const comma = uri.indexOf(",");
  if (!uri.startsWith("data:") || comma < 0) return undefined;
  const meta = uri.slice(5, comma);
  const payload = uri.slice(comma + 1);
  try {
    if (meta.endsWith(";base64")) {
      const binary = atob(payload);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return new Blob([bytes], { type: meta.slice(0, -";base64".length) });
    }
    return new Blob([decodeURIComponent(payload)], { type: meta });
  } catch {
    return undefined;
  }
}

const FONT_FACE_RULE = /@font-face\s*\{[^}]*\}/g;
const FONTS_ATTR = "data-cs-fonts";

/**
 * Move a stylesheet's `@font-face` rules into the document's head, under
 * one `<style>` per system, and return the stylesheet without them. A rule
 * already there is not added twice, so a system's fonts are parsed once
 * however many cards and card types share them. Exported for the tests.
 */
export function hoistFontFaces(doc: Document, systemId: string, css: string): string {
  const { fonts, rest } = splitFontFaces(css);
  if (fonts.length === 0) return css;

  let style = doc.head.querySelector<HTMLStyleElement>(
    `style[${FONTS_ATTR}="${systemId}"]`
  );
  if (!style) {
    style = doc.createElement("style");
    style.setAttribute(FONTS_ATTR, systemId);
    doc.head.appendChild(style);
  }
  const held = style.textContent ?? "";
  const missing = fonts.filter((rule) => !held.includes(rule));
  if (missing.length > 0)
    style.textContent = [held, ...missing].filter(Boolean).join("\n");

  return rest;
}

/**
 * A stylesheet's `@font-face` rules, and the stylesheet without them. The
 * export document uses the same split to carry a deck's fonts once however
 * many card-type stylesheets declare them.
 */
export function splitFontFaces(css: string): { fonts: string[]; rest: string } {
  return {
    fonts: css.match(FONT_FACE_RULE) ?? [],
    rest: css.replace(FONT_FACE_RULE, "").replace(/\n{3,}/g, "\n\n"),
  };
}

/**
 * Resolve once the layout in `root` has SETTLED — the first `.card-root`
 * has a height, the web fonts its text is set in have loaded, and every
 * image has decoded — capped at `maxFrames` frames so a font that never
 * arrives or a broken image URL degrades to "measure with what we have"
 * instead of hanging the render.
 *
 * The scaler measures text height to decide how far to shrink a body, so it
 * must run with the final font metrics, and `document.fonts.ready` alone
 * does not give it that. A web font only starts loading once laid-out
 * content requests it, so awaiting `fonts.ready` before the faces have laid
 * out resolves against an empty pending set: the scaler measures with the
 * compact fallback, finds the body fits, commits no transform, and the
 * taller real font overflows once a visible surface renders it. This host is
 * hidden and off-screen, so nothing loads its fonts eagerly. Hence: wait for
 * layout first (which requests the fonts), then poll `fonts.check` for the
 * families the faces actually use, re-awaiting `fonts.ready` between frames.
 *
 * Images are the other half, and the gap is a real defect rather than a
 * theoretical one: an `<img>` that has not decoded yet lays out at its CSS
 * floor instead of its final height, so the scaler measures a body shorter
 * than the one the reader gets and commits a scale a fraction too large — a
 * race, so it is intermittent. `error` counts as decoded: a broken image
 * will not get any taller.
 */
export async function waitForSettledLayout(
  root: ShadowRoot,
  maxFrames = 40
): Promise<void> {
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  if (!win) return;
  const frame = () =>
    new Promise<void>((resolve) => win.requestAnimationFrame(() => resolve()));

  for (let i = 0; i < maxFrames; i++) {
    const probe = root.querySelector<HTMLElement>(".card-root");
    if (probe && probe.clientHeight > 0) {
      if (fontsLoadedFor(root) && imagesLoadedIn(root)) return;
      // Layout kicked off the font and image requests; this now waits for
      // them, capped, then one frame so the reflow is in the box model.
      const waits: Promise<unknown>[] = [doc.fonts.ready];
      const imgs = root.querySelectorAll("img");
      for (let k = 0; k < imgs.length; k++) {
        if (!imgs[k]!.complete) waits.push(imageSettled(imgs[k]!));
      }
      const settled = Promise.all(waits).then(frame);
      const cap = new Promise<void>((resolve) => win.setTimeout(resolve, 3000));
      await Promise.race([settled, cap]);
      if (fontsLoadedFor(root) && imagesLoadedIn(root)) return;
    }
    await frame();
  }
}

/** One image's load, resolving on `error` too. */
function imageSettled(img: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
      resolve();
    };
    img.addEventListener("load", done);
    img.addEventListener("error", done);
  });
}

/** True when every `<img>` in the host has finished loading, or failed. */
function imagesLoadedIn(root: ShadowRoot): boolean {
  const imgs = root.querySelectorAll("img");
  for (let i = 0; i < imgs.length; i++) {
    if (!imgs[i]!.complete) return false;
  }
  return true;
}

/**
 * True when no web font the faces' text is set in is still loading. Every
 * family in each text-bearing element's `font-family` stack is looked up
 * among the document's declared faces, and a face of that family in the
 * `loading` state means the text was measured in a fallback. Faces that
 * are `unloaded` are fine — layout requested nothing from them (a
 * `unicode-range` subset the text never reaches) — and a family with no
 * `@font-face`, a system font, is not asked.
 *
 * The statuses, not `FontFaceSet.check()`: Chromium answers `check()` with
 * true for a face that is loading, so a card measured on that answer is
 * measured in the fallback and prints too wide.
 */
function fontsLoadedFor(root: ShadowRoot): boolean {
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  if (!win) return true;
  const loading = loadingFamilies(doc);
  if (loading.size === 0) return true;
  const els = root.querySelectorAll<HTMLElement>(
    ".card-title, .text-scalable, .card-body-scalable, .card-body-scalable *"
  );
  for (let i = 0; i < els.length; i++) {
    for (const raw of win.getComputedStyle(els[i]!).fontFamily.split(",")) {
      if (loading.has(unquoted(raw))) return false;
    }
  }
  return true;
}

/** The families with a face still loading. */
function loadingFamilies(doc: Document): Set<string> {
  const out = new Set<string>();
  doc.fonts.forEach((face) => {
    if (face.status === "loading") out.add(unquoted(face.family));
  });
  return out;
}

function unquoted(family: string): string {
  return family.trim().replace(/^['"]|['"]$/g, "");
}
