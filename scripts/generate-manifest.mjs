/*
 * Embed the bundled systems into the plugin.
 *
 * Obsidian installs exactly `main.js`, `manifest.json` and `styles.css`, so a
 * bundled system's files can only ship inside `main.js`. This script reads the
 * listing in `resources/systems.yaml`, walks the folder holding each listed
 * root document, and writes `src/generated/bundled-systems.ts`: one entry
 * per system naming its document, with a flat `path → file` map, text files
 * as strings and everything else as base64.
 *
 * The pictures a root document lists under `sample-pictures:` are the
 * exception: they are not embedded. *Insert sample card block* is the only
 * thing that reads them, so the plugin downloads one from the repository,
 * at the release tag, when that command needs it — a sample can carry a
 * real illustration without the plugin growing for every user. For each
 * such file the entry records its size and SHA-256, which the download is
 * checked against.
 *
 * A file two systems both carry — the same font, the same parchment — is
 * written once and pointed at twice: the files are emitted as one list of
 * distinct contents, and each system's map refers into it. The plugin ships
 * such a file once, and neither system knows it is shared.
 *
 * It embeds and nothing more. Whether a system is complete — every declared
 * file present, every referenced asset present, no file nobody uses — is the
 * loader's job, and `tests/bundled-systems.test.ts` runs the loader over every
 * entry written here.
 *
 * Usage: node scripts/generate-manifest.mjs
 */

import { createHash } from "crypto";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { basename, dirname, join, relative, resolve } from "path";
import { fileURLToPath } from "url";
import { load } from "js-yaml";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SYSTEMS_DIR = join(ROOT, "resources", "systems");
const LISTING = join(ROOT, "resources", "systems.yaml");
const OUT_FILE = join(ROOT, "src", "generated", "bundled-systems.ts");

/** What the plugin reads as text. Everything else is bytes. */
const TEXT_EXTENSIONS = new Set([
  "yaml",
  "yml",
  "css",
  "hbs",
  "md",
  "txt",
  "svg",
  "json",
]);

function fail(message) {
  console.error(`generate-manifest: ${message}`);
  process.exit(1);
}

function isText(name) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 && TEXT_EXTENSIONS.has(name.slice(dot + 1).toLowerCase());
}

/** Every file under `dir`, as `/`-separated paths relative to it, sorted. */
function walk(dir) {
  const files = [];
  const visit = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue; // .DS_Store and friends
      const full = join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile()) files.push(relative(dir, full).split("\\").join("/"));
    }
  };
  visit(dir);
  return files.sort();
}

function readListing() {
  const doc = load(readFileSync(LISTING, "utf-8"));
  const systems = doc && typeof doc === "object" ? doc.systems : undefined;
  if (!Array.isArray(systems) || systems.length === 0) {
    fail(`${relative(ROOT, LISTING)} must list at least one system under systems:`);
  }
  return systems.map(String);
}

function readSystem(listedPath) {
  const documentPath = join(SYSTEMS_DIR, listedPath);
  let source;
  try {
    source = readFileSync(documentPath, "utf-8");
  } catch {
    fail(`listed system "${listedPath}" does not exist`);
  }
  const doc = load(source);
  const id = doc && typeof doc === "object" ? String(doc.id ?? "").trim() : "";
  if (!id) fail(`${listedPath} declares no id:`);
  const name = String(doc.name ?? "").trim() || id;

  const dir = dirname(documentPath);
  const document = basename(documentPath);
  const onDemand = samplePictures(doc, listedPath);
  const files = {};
  const remote = {};
  let bytes = 0;
  let remoteBytes = 0;
  for (const path of walk(dir)) {
    const full = join(dir, path);
    if (onDemand.has(path)) {
      const content = readFileSync(full);
      remote[path] = {
        size: content.length,
        sha256: createHash("sha256").update(content).digest("hex"),
      };
      remoteBytes += content.length;
      onDemand.delete(path);
      continue;
    }
    bytes += statSync(full).size;
    files[path] = pooled(
      isText(path)
        ? { text: readFileSync(full, "utf-8") }
        : { base64: readFileSync(full).toString("base64") }
    );
  }
  for (const path of onDemand) {
    fail(`${listedPath} lists "${path}" under sample-pictures:, which does not exist`);
  }
  const folder = relative(SYSTEMS_DIR, dir).split("\\").join("/");
  return { id, name, document, dir, folder, files, remote, bytes, remoteBytes };
}

/** The `sample-pictures:` of a root document, as paths relative to its folder. */
function samplePictures(doc, listedPath) {
  const list = doc["sample-pictures"];
  if (list === undefined) return new Set();
  if (!Array.isArray(list)) fail(`${listedPath}: sample-pictures: must be a list`);
  return new Set(list.map((path) => String(path).replace(/^\.\//, "")));
}

/** The distinct files, in first-seen order, and the index of each by its content. */
const distinct = [];
const indexByContent = new Map();

/** The index of this file's content in `distinct`, adding it when it is new. */
function pooled(file) {
  const key = "text" in file ? `text:${file.text}` : `base64:${file.base64}`;
  let index = indexByContent.get(key);
  if (index === undefined) {
    index = distinct.length;
    distinct.push(file);
    indexByContent.set(key, index);
  }
  return index;
}

const listed = readListing();
const systems = listed.map(readSystem);

// A folder nobody lists is not a system — and not silently shipped either.
const listedDirs = new Set(systems.map((s) => s.dir));
for (const entry of readdirSync(SYSTEMS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
  const dir = join(SYSTEMS_DIR, entry.name);
  if (!listedDirs.has(dir)) {
    fail(`resources/systems/${entry.name}/ is not listed in resources/systems.yaml`);
  }
}

const ids = new Set();
for (const system of systems) {
  if (ids.has(system.id)) fail(`two listed systems declare id "${system.id}"`);
  ids.add(system.id);
}

const fileConsts = distinct
  .map((file, index) => `const file${index}: BundledFile = ${JSON.stringify(file)};`)
  .join("\n");

const entries = systems
  .map((system) => {
    const files = Object.entries(system.files)
      .map(([path, index]) => `      ${JSON.stringify(path)}: file${index},`)
      .join("\n");
    const remote = Object.entries(system.remote)
      .map(([path, file]) => `      ${JSON.stringify(path)}: ${JSON.stringify(file)},`)
      .join("\n");
    return `  {\n    id: ${JSON.stringify(system.id)},\n    name: ${JSON.stringify(system.name)},\n    folder: ${JSON.stringify(system.folder)},\n    document: ${JSON.stringify(system.document)},\n    files: {\n${files}\n    },\n    remote: {\n${remote}\n    },\n  }`;
  })
  .join(",\n");

const out = `// Generated by scripts/generate-manifest.mjs from resources/systems.yaml — do not edit.

/** One file of a bundled system: text as written, or bytes as base64. */
export type BundledFile = { text: string } | { base64: string };

/** A file of a bundled system that is downloaded when needed, not embedded. */
export interface RemoteFile {
  size: number;
  /** Lower-case hex. */
  sha256: string;
}

// Every distinct file once; a file two systems share is one of these, pointed at twice.
${fileConsts}

export interface BundledSystem {
  /** From the system's own root document. */
  id: string;
  /** Likewise — what the settings show without loading the system. */
  name: string;
  /** The system's folder under \`resources/systems/\` — where a remote file lies in the repository. */
  folder: string;
  /** The root document's name, at the top of the folder — as the listing names it. */
  document: string;
  /** Every file in the system's folder, keyed by "/"-separated relative path. */
  files: Record<string, BundledFile>;
  /** The files left out of the plugin — the \`sample-pictures:\` — keyed like \`files\`. */
  remote: Record<string, RemoteFile>;
}

/** The bundled systems, in listing order. */
export const BUNDLED_SYSTEMS: readonly BundledSystem[] = [
${entries},
];
`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, out, "utf-8");

const total = systems.reduce((sum, s) => sum + s.bytes, 0);
const count = systems.reduce((n, s) => n + Object.keys(s.files).length, 0);
const remoteCount = systems.reduce((n, s) => n + Object.keys(s.remote).length, 0);
const remoteTotal = systems.reduce((sum, s) => sum + s.remoteBytes, 0);
console.log(
  `bundled-systems.ts: ${systems.map((s) => s.id).join(", ")} — ` +
    `${count} files (${distinct.length} distinct), ` +
    `${(total / 1024).toFixed(0)} KB on disk, ${(Buffer.byteLength(out) / 1024).toFixed(0)} KB embedded; ` +
    `${remoteCount} on demand, ${(remoteTotal / 1024).toFixed(0)} KB`
);
