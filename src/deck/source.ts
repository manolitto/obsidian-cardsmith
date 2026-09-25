import type { Diagnostics } from "../definitions/diagnostics";
import type { CardNote } from "../render/note";
import type { DeckSelection } from "./block";

/**
 * Where a deck's candidate notes come from. The vault answers this in the
 * plugin — its files under a folder or behind a link, each parsed as a
 * card note, with the tags the metadata cache knows it by; a test answers
 * from a fixture folder. The deck pipeline asks nothing else of the
 * outside world.
 */
export interface DeckSource {
  /**
   * Every card note under `folder` (`""` is the vault root), in path order;
   * with `recursive`, its subfolders too. A note without a `cardsmith`
   * block is not a card note and is not listed. A note whose block cannot
   * be read is reported to `diagnostics` and not listed either.
   */
  listNotes(
    folder: string,
    recursive: boolean,
    diagnostics: Diagnostics
  ): Promise<TaggedNote[]>;

  /**
   * The file a link to `target` from the note at `fromPath` reaches, as a
   * link in that note would: `undefined` when it reaches none, the path
   * alone when the file is not a card note, else the note. A note whose
   * block cannot be read is reported to `diagnostics`.
   */
  resolveNote(
    target: string,
    fromPath: string,
    diagnostics: Diagnostics
  ): Promise<{ path: string; note?: TaggedNote } | undefined>;
}

/** A candidate note of a deck, marked when the block names it under `notes:`. */
export interface DeckCandidate extends TaggedNote {
  /** Named under `notes:` — a note someone asked for, so the filter says why it drops one. */
  listed?: boolean;
}

/**
 * A deck's candidate notes: the card notes under each of its folders, in
 * the order the folders are named and path order within one, then the
 * notes it names, in the order written — each note once. A folder named
 * beside a parent listed recursively, or a note named that a folder
 * already holds, would otherwise contribute a note twice; a note that is
 * both is marked as named. A name that reaches no note, or a note that is
 * not a card note, is reported.
 */
export async function listDeckNotes(
  source: DeckSource,
  selection: Pick<DeckSelection, "folders" | "notes">,
  deckPath: string,
  recursive: boolean,
  diagnostics: Diagnostics
): Promise<DeckCandidate[]> {
  const byPath = new Map<string, DeckCandidate>();
  for (const folder of selection.folders) {
    for (const tagged of await source.listNotes(folder, recursive, diagnostics)) {
      if (!byPath.has(tagged.note.path)) byPath.set(tagged.note.path, { ...tagged });
    }
  }
  for (const target of selection.notes) {
    const found = await source.resolveNote(target, deckPath, diagnostics);
    if (!found) {
      diagnostics.warn(`${deckPath}: notes: "${target}" — no such note`);
      continue;
    }
    if (!found.note) {
      diagnostics.warn(
        `${deckPath}: notes: "${target}" — ${found.path} is not a card note`
      );
      continue;
    }
    const known = byPath.get(found.path);
    if (known) known.listed = true;
    else byPath.set(found.path, { ...found.note, listed: true });
  }
  return [...byPath.values()];
}

/** A card note as the vault lists it — with the tags the vault knows it by. */
export interface TaggedNote {
  note: CardNote;
  /** Frontmatter and inline tags, without the `#`. */
  tags: readonly string[];
}
