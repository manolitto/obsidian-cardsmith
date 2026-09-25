/// <reference types="vite/client" />
import type { DeckSource, TaggedNote } from "../../../src/deck/source";
import type { Diagnostics } from "../../../src/definitions/diagnostics";
import type { ImageSource } from "../../../src/render/images";
import { parseNote } from "../../../src/render/note";
import { CardRenderer, type RenderedCard } from "../../../src/render/renderer";
import { TemplateEngine } from "../../../src/templates/engine";
import { renderNote } from "../../helpers/render";

/**
 * The fixture notes under `tests/fixtures/`, as the browser sees them. There
 * is no file system on this side: vite hands every note over as text and
 * every picture beside one as a `data:` URI, both through `import.meta.glob`,
 * and the render itself is the same one the node harness runs.
 */

const notes = import.meta.glob("../../fixtures/*/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

const images = import.meta.glob("../../fixtures/*/*.{png,jpg,jpeg,webp,gif,svg}", {
  query: "?inline",
  import: "default",
}) as Record<string, () => Promise<string>>;

export interface Fixture {
  system: string;
  /** The note's basename without `.md` — which is also the name a card falls back to. */
  name: string;
  /** The note's path as vite keys it, relative to this file. */
  path: string;
}

/** Every fixture note, in path order. A `_` name is the harness's — the deck note — not a card. */
export function listFixtures(): Fixture[] {
  return Object.keys(notes)
    .sort()
    .map((path) => {
      const [system = "", file = ""] = path.split("/").slice(-2);
      return { system, name: file.slice(0, -3), path };
    })
    .filter((fixture) => !fixture.name.startsWith("_"));
}

/** The deck note of a system's fixture folder, `_deck.md`, as text with its path. */
export async function deckNote(system: string): Promise<{ text: string; path: string }> {
  const path = `../../fixtures/${system}/_deck.md`;
  const load = notes[path];
  if (!load) throw new Error(`${path}: no deck note`);
  return { text: await load(), path };
}

/**
 * A deck source over the fixture folders: the card notes under a folder,
 * tagged from their frontmatter. What the vault does with its metadata
 * cache, done from the notes alone. A link resolves by path, with or
 * without `.md`, or by the note's name — the part of Obsidian's link
 * resolution the fixtures need.
 */
export const fixtureDeckSource: DeckSource = {
  async listNotes(folder, recursive, diagnostics) {
    const out: TaggedNote[] = [];
    for (const path of Object.keys(notes).sort()) {
      if (!path.startsWith(`${folder}/`)) continue;
      const rest = path.slice(folder.length + 1);
      if (!recursive && rest.includes("/")) continue;
      // A `_` name is the harness's — the deck note, an insert golden — not a card.
      if (rest.startsWith("_")) continue;
      const tagged = await readFixtureNote(path, diagnostics);
      if (tagged) out.push(tagged);
    }
    return out;
  },

  async resolveNote(target, _fromPath, diagnostics) {
    const file = target.toLowerCase().endsWith(".md") ? target : `${target}.md`;
    const path = Object.keys(notes)
      .sort()
      .find((candidate) => candidate === file || candidate.endsWith(`/${file}`));
    if (!path) return undefined;
    const note = await readFixtureNote(path, diagnostics);
    return note ? { path, note } : { path };
  },
};

async function readFixtureNote(
  path: string,
  diagnostics: Diagnostics
): Promise<TaggedNote | undefined> {
  const load = notes[path];
  if (!load) return undefined;
  const note = parseNote(await load(), path, diagnostics);
  return note ? { note, tags: frontmatterTags(note.frontmatter["tags"]) } : undefined;
}

function frontmatterTags(raw: unknown): string[] {
  const items = Array.isArray(raw) ? raw : raw === undefined ? [] : [raw];
  return items.map((tag) => String(tag).replace(/^#/, ""));
}

/** The renderer the deck tests build with: the real engine over the fixture folder's pictures. */
export function fixtureRenderer(): CardRenderer {
  return new CardRenderer(new TemplateEngine(), fixtureImages);
}

/** The cards a fixture note yields, each with every face its card type declares. */
export async function renderFixture(fixture: Fixture): Promise<RenderedCard[]> {
  const load = notes[fixture.path];
  if (!load) throw new Error(`${fixture.path}: not a fixture`);
  return renderNote(await load(), fixture.path, fixture.system, fixtureImages);
}

/** Pictures come from the fixture folder, by the link's basename. */
const fixtureImages: ImageSource = {
  async resolve(link, fromNotePath) {
    const folder = fromNotePath.slice(0, fromNotePath.lastIndexOf("/"));
    const file = link.replace(/#.*$/, "").split("/").pop() ?? "";
    return images[`${folder}/${file}`]?.();
  },
};
