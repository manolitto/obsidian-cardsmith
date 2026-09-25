import { getAllTags, type App, type TFile } from "obsidian";
import type { Diagnostics } from "../definitions/diagnostics";
import { parseNote } from "../render/note";
import type { DeckSource, TaggedNote } from "./source";

/**
 * The vault as a deck source: the markdown files under a folder, or the
 * one a link reaches, each read and parsed as a card note, tagged from the
 * metadata cache — frontmatter and inline tags alike, as Obsidian itself
 * knows them.
 */
export class VaultDeckSource implements DeckSource {
  constructor(private readonly app: App) {}

  async listNotes(
    folder: string,
    recursive: boolean,
    diagnostics: Diagnostics
  ): Promise<TaggedNote[]> {
    const out: TaggedNote[] = [];
    const files = this.app.vault
      .getMarkdownFiles()
      .filter((file) => isUnder(file, folder, recursive))
      .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
    for (const file of files) {
      const tagged = await this.read(file, diagnostics);
      if (tagged) out.push(tagged);
    }
    return out;
  }

  async resolveNote(
    target: string,
    fromPath: string,
    diagnostics: Diagnostics
  ): Promise<{ path: string; note?: TaggedNote } | undefined> {
    const file = this.app.metadataCache.getFirstLinkpathDest(target, fromPath);
    if (!file) return undefined;
    const note = file.extension === "md" ? await this.read(file, diagnostics) : undefined;
    return note ? { path: file.path, note } : { path: file.path };
  }

  private async read(
    file: TFile,
    diagnostics: Diagnostics
  ): Promise<TaggedNote | undefined> {
    const note = parseNote(await this.app.vault.cachedRead(file), file.path, diagnostics);
    if (!note) return undefined;
    const cache = this.app.metadataCache.getFileCache(file);
    const tags = (cache ? getAllTags(cache) : null) ?? [];
    return { note, tags: tags.map((tag) => tag.replace(/^#/, "")) };
  }
}

/** Obsidian names the root's folder `/`; a deck names it `""`. */
function isUnder(file: TFile, folder: string, recursive: boolean): boolean {
  const parent = file.parent?.path === "/" ? "" : (file.parent?.path ?? "");
  if (parent === folder) return true;
  return recursive && (folder === "" || parent.startsWith(`${folder}/`));
}
