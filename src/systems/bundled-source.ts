import type { SystemPath } from "../definitions/game-system";
import type {
  BundledFile,
  BundledSystem,
  RemoteFile,
} from "../generated/bundled-systems";
import { MissingFileError, RemoteFileError, type SystemSource } from "./source";

/**
 * Fetches a file of a bundled system that the plugin does not carry, by its
 * path under `resources/systems/` — `dragonbane/assets/samples/Glutgriff.jpg`.
 * Rejects when it cannot.
 */
export type Download = (path: string) => Promise<Uint8Array>;

/**
 * The download the plugin uses: the file from the public repository, at
 * the tag of this release, so the bytes are the ones the build hashed.
 * `get` is the transport — Obsidian's `requestUrl`, which works on mobile
 * and is not bound by CORS — passed in so this stays testable.
 */
export function repositoryDownload(
  version: string,
  get: (url: string) => Promise<ArrayBuffer>
): Download {
  const base = `https://raw.githubusercontent.com/manolitto/obsidian-cardsmith/${encodeURIComponent(version)}/resources/systems`;
  return async (path) => {
    const url = `${base}/${path.split("/").map(encodeURIComponent).join("/")}`;
    return new Uint8Array(await get(url));
  };
}

/**
 * A system embedded in the plugin, read out of the generated manifest.
 *
 * Most of its files are in the manifest. The ones listed under `remote` —
 * the sample pictures, which only *Insert sample card block* reads — are
 * not: they are downloaded on first read, checked against the size and
 * SHA-256 the build recorded, and kept for the session.
 */
export class BundledSystemSource implements SystemSource {
  readonly kind = "bundled";
  readonly root: string;
  readonly document: SystemPath;
  private readonly downloads = new Map<string, Promise<Uint8Array>>();

  constructor(
    private readonly system: BundledSystem,
    private readonly download: Download
  ) {
    this.root = `bundled:${system.id}`;
    // Listed by the build, so it is a name at the top of the folder.
    this.document = system.document as SystemPath;
  }

  async listFiles(): Promise<SystemPath[]> {
    // The manifest's keys were produced by walking the folder, so each is
    // inside it by construction — the promise the brand makes.
    return [
      ...Object.keys(this.system.files),
      ...Object.keys(this.system.remote),
    ] as SystemPath[];
  }

  async readText(path: SystemPath): Promise<string> {
    if (path in this.system.remote) {
      return new TextDecoder().decode(await this.fetchRemote(path));
    }
    const file = this.file(path);
    return "text" in file ? file.text : decodeText(file.base64);
  }

  async readBinary(path: SystemPath): Promise<Uint8Array> {
    if (path in this.system.remote) return (await this.fetchRemote(path)).slice();
    const file = this.file(path);
    return "text" in file
      ? new TextEncoder().encode(file.text)
      : decodeBytes(file.base64);
  }

  private file(path: SystemPath): BundledFile {
    const file = this.system.files[path];
    if (!file) throw new MissingFileError(this.root, path);
    return file;
  }

  /** One download per path and session; a failed one is tried again next time. */
  private fetchRemote(path: SystemPath): Promise<Uint8Array> {
    let pending = this.downloads.get(path);
    if (!pending) {
      pending = this.downloadChecked(path, this.system.remote[path]!);
      this.downloads.set(path, pending);
      pending.catch(() => this.downloads.delete(path));
    }
    return pending;
  }

  private async downloadChecked(
    path: SystemPath,
    expected: RemoteFile
  ): Promise<Uint8Array> {
    let bytes: Uint8Array;
    try {
      bytes = await this.download(`${this.system.folder}/${path}`);
    } catch (error) {
      throw new RemoteFileError(
        this.root,
        path,
        error instanceof Error ? error.message : String(error)
      );
    }
    if (bytes.length !== expected.size) {
      throw new RemoteFileError(
        this.root,
        path,
        `${bytes.length} bytes where ${expected.size} were expected`
      );
    }
    if ((await sha256(bytes)) !== expected.sha256) {
      throw new RemoteFileError(this.root, path, "the content is not the expected one");
    }
    return bytes;
  }
}

async function sha256(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes.slice().buffer);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function decodeBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function decodeText(base64: string): string {
  return new TextDecoder().decode(decodeBytes(base64));
}
