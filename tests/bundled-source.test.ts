import { createHash } from "crypto";
import { describe, expect, it } from "vitest";
import type { SystemPath } from "../src/definitions/game-system";
import type { BundledSystem } from "../src/generated/bundled-systems";
import {
  BundledSystemSource,
  repositoryDownload,
  type Download,
} from "../src/systems/bundled-source";
import { MissingFileError, RemoteFileError } from "../src/systems/source";

const PICTURE = new Uint8Array([137, 80, 78, 71, 1, 2, 3]);
const PATH = "assets/samples/Crow.png" as SystemPath;

const SYSTEM: BundledSystem = {
  id: "demo",
  name: "Demo",
  folder: "demo-folder",
  document: "demo.yaml",
  files: { "demo.yaml": { text: "id: demo\n" } },
  remote: {
    [PATH]: {
      size: PICTURE.length,
      sha256: createHash("sha256").update(PICTURE).digest("hex"),
    },
  },
};

/** A download that answers from a map and counts what it was asked for. */
function fakeDownload(answers: Record<string, Uint8Array | Error>): {
  download: Download;
  asked: string[];
} {
  const asked: string[] = [];
  const download: Download = async (path) => {
    asked.push(path);
    const answer = answers[path];
    if (answer === undefined) throw new Error("404");
    if (answer instanceof Error) throw answer;
    return answer.slice();
  };
  return { download, asked };
}

describe("a bundled system's remote file", () => {
  it("is listed like any other file", async () => {
    const source = new BundledSystemSource(SYSTEM, fakeDownload({}).download);
    expect(await source.listFiles()).toEqual(["demo.yaml", PATH]);
  });

  it("is downloaded by its path under the system's folder, once per session", async () => {
    const { download, asked } = fakeDownload({ [`demo-folder/${PATH}`]: PICTURE });
    const source = new BundledSystemSource(SYSTEM, download);
    expect([...(await source.readBinary(PATH))]).toEqual([...PICTURE]);
    const again = await source.readBinary(PATH);
    again[0] = 0; // a caller's copy, not the cache
    expect([...(await source.readBinary(PATH))]).toEqual([...PICTURE]);
    expect(asked).toEqual([`demo-folder/${PATH}`]);
  });

  it("fails naming the path when the download fails, and is tried again next time", async () => {
    const answers: Record<string, Uint8Array | Error> = {
      [`demo-folder/${PATH}`]: new Error("offline"),
    };
    const { download, asked } = fakeDownload(answers);
    const source = new BundledSystemSource(SYSTEM, download);
    const error = await source.readBinary(PATH).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(RemoteFileError);
    expect((error as RemoteFileError).message).toBe(
      `bundled:demo: could not download "${PATH}": offline`
    );
    answers[`demo-folder/${PATH}`] = PICTURE;
    expect([...(await source.readBinary(PATH))]).toEqual([...PICTURE]);
    expect(asked).toHaveLength(2);
  });

  it("is refused when its size is not the one the build recorded", async () => {
    const { download } = fakeDownload({ [`demo-folder/${PATH}`]: PICTURE.slice(1) });
    const source = new BundledSystemSource(SYSTEM, download);
    await expect(source.readBinary(PATH)).rejects.toThrow(/6 bytes where 7/);
  });

  it("is refused when its content is not the one the build hashed", async () => {
    const tampered = PICTURE.slice();
    tampered[6] = 99;
    const { download } = fakeDownload({ [`demo-folder/${PATH}`]: tampered });
    const source = new BundledSystemSource(SYSTEM, download);
    await expect(source.readBinary(PATH)).rejects.toThrow(RemoteFileError);
  });

  it("does not make a path the system lacks downloadable", async () => {
    const { download, asked } = fakeDownload({});
    const source = new BundledSystemSource(SYSTEM, download);
    await expect(
      source.readBinary("assets/samples/Other.png" as SystemPath)
    ).rejects.toThrow(MissingFileError);
    expect(asked).toEqual([]);
  });
});

describe("the repository download", () => {
  it("asks for the file at this release's tag, every segment escaped", async () => {
    const urls: string[] = [];
    const download = repositoryDownload("1.2.3", async (url) => {
      urls.push(url);
      return new Uint8Array([1, 2]).buffer;
    });
    expect([...(await download("5e_2014/assets/samples/Ember Lance.png"))]).toEqual([
      1, 2,
    ]);
    expect(urls).toEqual([
      "https://raw.githubusercontent.com/manolitto/obsidian-cardsmith/1.2.3/resources/systems/5e_2014/assets/samples/Ember%20Lance.png",
    ]);
  });
});
