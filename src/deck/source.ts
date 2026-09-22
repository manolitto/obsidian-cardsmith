import type { Diagnostics } from "../definitions/diagnostics";
import type { CardNote } from "../render/note";

/**
 * Where a deck's candidate notes come from. The vault answers this in the
 * plugin — its files under a folder, each parsed as a card note, with the
 * tags the metadata cache knows it by; a test answers from a fixture
 * folder. The deck pipeline asks nothing else of the outside world.
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
}

/**
 * A deck's candidate notes: the card notes under each of its folders, in
 * the order the folders are named and path order within one, each note
 * once — a folder named beside a parent that is listed recursively would
 * otherwise contribute its notes twice.
 */
export async function listDeckNotes(
  source: DeckSource,
  folders: readonly string[],
  recursive: boolean,
  diagnostics: Diagnostics
): Promise<TaggedNote[]> {
  const seen = new Set<string>();
  const out: TaggedNote[] = [];
  for (const folder of folders) {
    for (const tagged of await source.listNotes(folder, recursive, diagnostics)) {
      if (seen.has(tagged.note.path)) continue;
      seen.add(tagged.note.path);
      out.push(tagged);
    }
  }
  return out;
}

/** A card note as the vault lists it — with the tags the vault knows it by. */
export interface TaggedNote {
  note: CardNote;
  /** Frontmatter and inline tags, without the `#`. */
  tags: readonly string[];
}
