import type { CardSide } from "../definitions/card-settings";
import type { PaperBackground } from "../definitions/deck-settings";
import { foldSides, type FoldSides } from "../export/compose";
import type { LaidOutCard } from "../layout/engine";
import { hoistFontFaces } from "../layout/host";
import type { CardSize } from "../model/card-size";

/*
 * Settled faces on the screen, at a display height.
 *
 * The layout engine has already done everything that measures: every face
 * arrives with its title fitted, its body scaled, its pictures faded. What
 * is left is to show them — each face in a box of the card's size in CSS
 * pixels, scaled by `transform` to the height the reader asked for, under
 * the card type's stylesheet in a shadow root so the card's CSS and
 * Obsidian's never touch. A shadow root cannot load a font, so the
 * `@font-face` rules are hoisted into the document's head the way the
 * layout host does it; a system's fonts are parsed once per document
 * however many previews show it. Plain paper is the same hook the export
 * stamps on its pages, `cs-paper-plain`, here on the faces' wrapper: the
 * card shows what the printer would print. A card that folds shows as the
 * pieces it prints as — the panels of each side edge to edge, the hinges
 * between them, the front above the back as the reader turns it over.
 *
 * DOM only: no Obsidian, no measurement, no scaling of text.
 */

export interface PreviewMount {
  root: ShadowRoot;
  remove(): void;
}

/** CSS pixels per millimetre at the 96 dpi a browser renders `mm` at. */
const PX_PER_MM = 96 / 25.4;

/** What the preview shows side by side: a face on its own, or a fold's sides. */
export type PreviewItem = string | FoldSides;

/**
 * The faces of a laid-out card as the preview shows them: every face of
 * every physical card in print order, then the ones `side` keeps. `both`
 * keeps everything; a card that spilled onto three fronts under `side:
 * front` shows the three fronts. A card whose `fold` folds it shows its
 * pieces, as the sheet prints them — a fold is never split, so no paper
 * is needed to know them.
 */
export function previewFaces(card: LaidOutCard, side: CardSide = "both"): PreviewItem[] {
  const fold = card.settings.fold ?? "off";
  if (fold === "off" || card.cards.length < 2) {
    const out: string[] = [];
    for (const pair of card.cards) {
      if (pair.front !== undefined && side !== "back") out.push(pair.front);
      if (pair.back !== undefined && side !== "front") out.push(pair.back);
    }
    return out;
  }
  const physical = card.cards.map((pair) => ({
    name: card.name,
    cardTypeId: card.cardTypeId,
    group: 0,
    fold,
    ...(card.settings.hinge === undefined ? {} : { hinge: card.settings.hinge }),
    ...(pair.front === undefined || side === "back" ? {} : { front: pair.front }),
    ...(pair.back === undefined || side === "front" ? {} : { back: pair.back }),
  }));
  return foldSides(physical);
}

/**
 * Put the faces on the screen inside `host`. `stylesheet` is the card's
 * whole cascade as `LoadedSystem.stylesheet` assembles it; `systemId` keys
 * the hoisted fonts; `cardSize` is the size every face was laid out at;
 * `paperBackground` is the reader's, since a note has no say in it.
 */
export function mountPreview(
  host: HTMLElement,
  systemId: string,
  stylesheet: string,
  faces: readonly PreviewItem[],
  cardSize: CardSize,
  displayHeight: number,
  paperBackground: PaperBackground = "textured"
): PreviewMount {
  const doc = host.ownerDocument;
  const css = hoistFontFaces(doc, systemId, stylesheet);

  const scale = displayHeight / (cardSize.height * PX_PER_MM);
  const width = cardSize.width * PX_PER_MM * scale;

  const mount = doc.createElement("div");
  mount.className = "cs-preview";
  host.appendChild(mount);

  const root = mount.attachShadow({ mode: "open" });
  const facesClass =
    paperBackground === "plain" ? "cs-preview-faces cs-paper-plain" : "cs-preview-faces";
  const box = (face: string | undefined) =>
    `<div class="cs-preview-face" style="width:${width.toFixed(2)}px;height:${displayHeight}px">` +
    (face === undefined
      ? ""
      : `<div class="cs-preview-scale" style="transform:scale(${scale.toFixed(5)})">${face}</div>`) +
    `</div>`;
  // A side of a fold: its panels edge to edge, the hinges between them at
  // their width, scaled as the faces are.
  const foldSide = (panels: (string | undefined)[], hinges: number[], color: string) =>
    `<div class="cs-preview-fold-side">` +
    panels
      .map((face, i) => {
        const hinge = hinges[i];
        return (
          box(face) +
          (hinge === undefined || hinge <= 0
            ? ""
            : `<div class="cs-preview-hinge" style="width:${(hinge * PX_PER_MM * scale).toFixed(2)}px;background:${color}"></div>`)
        );
      })
      .join("") +
    `</div>`;
  const item = (face: PreviewItem) => {
    if (typeof face === "string") return box(face);
    // Turned over, the hinges run the other way round.
    const sides: [(string | undefined)[], number[]][] = [
      [face.front, face.hinges],
      [face.back, [...face.hinges].reverse()],
    ];
    return (
      `<div class="cs-preview-fold">` +
      sides
        .filter(([panels]) => panels.some((panel) => panel !== undefined))
        .map(([panels, hinges]) => foldSide(panels, hinges, face.color))
        .join("") +
      `</div>`
    );
  };
  root.innerHTML =
    `<style>${css}\n${MOUNT_CSS}</style>` +
    `<div class="${facesClass}">` +
    faces.map(item).join("") +
    `</div>`;

  return {
    root,
    remove() {
      mount.remove();
    },
  };
}

/**
 * The wrappers' own rules, inside the shadow root because that is where
 * the wrappers are. The face scales from its top-left corner into a box
 * of exactly the scaled size, so the boxes flow like the cards they show.
 */
const MOUNT_CSS = `
.cs-preview-faces { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.cs-preview-face { position: relative; overflow: hidden; flex: none; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.18); }
.cs-preview-scale { transform-origin: top left; }
.cs-preview-fold { display: flex; flex-direction: column; gap: 16px; flex: none; }
.cs-preview-fold-side { display: flex; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.18); }
.cs-preview-fold-side > .cs-preview-face { box-shadow: none; }
.cs-preview-hinge { flex: none; }
`;
