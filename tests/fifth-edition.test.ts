import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { fixtureImages, listFixtures } from "./helpers/render-fixture";
import { loadedSystem, renderNote } from "./helpers/render";
import type { LoadedSystem } from "../src/systems/loader";

/**
 * The two fifth-edition systems, 5E (2014) and 5E (2024), print the same
 * game in two editions' dress. A card note moves between them by changing
 * `system:` and nothing else, in either direction: same card types, same
 * property names, same aliases, same value formats. Each system prints what
 * its edition's book prints and leaves the rest of the note unprinted.
 *
 * Two systems are two folders, so the vocabulary is written out in both.
 * This file is the reference both are held to — the property names and
 * aliases below, per card type — and it renders every fixture of each
 * system with the other.
 */

const EDITIONS = ["5e_2014", "5e_2024"] as const;

/** On every card type: the label above the picture or the d20. */
const BACK = {
  "back-label": ["back-caption", "rückseite", "rueckseite"],
};

const CREATURE = {
  ...BACK,
  size: ["größe", "groesse"],
  type: ["art", "kreaturentyp"],
  alignment: ["gesinnung"],
  ac: ["armor-class", "armorclass", "rüstungsklasse", "ruestungsklasse", "rk"],
  initiative: ["ini"],
  hp: ["hit-points", "hitpoints", "trefferpunkte", "tp"],
  speed: ["bewegungsrate", "bewegung"],
  str: ["strength", "stärke", "staerke"],
  dex: ["dexterity", "geschicklichkeit", "ges"],
  con: ["constitution", "konstitution", "kon"],
  int: ["intelligence", "intelligenz"],
  wis: ["wisdom", "weisheit", "wei"],
  cha: ["charisma"],
  "str-save": ["strength-save", "stärke-rettungswurf", "staerke-rettungswurf"],
  "dex-save": ["dexterity-save", "geschicklichkeit-rettungswurf", "ges-rettungswurf"],
  "con-save": ["constitution-save", "konstitution-rettungswurf", "kon-rettungswurf"],
  "int-save": ["intelligence-save", "intelligenz-rettungswurf"],
  "wis-save": ["wisdom-save", "weisheit-rettungswurf", "wei-rettungswurf"],
  "cha-save": ["charisma-save", "charisma-rettungswurf"],
  skills: ["fertigkeiten"],
  vulnerabilities: [
    "damage-vulnerabilities",
    "schadensanfälligkeiten",
    "schadensanfaelligkeiten",
  ],
  resistances: ["damage-resistances", "schadensresistenzen"],
  immunities: ["damage-immunities", "schadensimmunitäten", "schadensimmunitaeten"],
  "condition-immunities": [
    "conditionimmunities",
    "zustandsimmunitäten",
    "zustandsimmunitaeten",
  ],
  gear: ["equipment", "ausrüstung", "ausruestung"],
  senses: ["sinne"],
  languages: ["sprachen"],
  cr: ["challenge", "challenge-rating", "challengerating", "herausforderungsgrad", "hg"],
  xp: ["experience", "exp", "ep", "erfahrungspunkte"],
  "proficiency-bonus": ["pb", "prof", "prof-bonus", "übungsbonus", "uebungsbonus"],
  habitat: ["environment", "lebensraum"],
  treasure: ["hoard", "schatz"],
  traits: ["merkmale", "eigenschaften"],
  actions: ["aktionen"],
  "bonus-actions": ["bonusactions", "bonusaktionen"],
  reactions: ["reaktionen"],
  "legendary-actions": ["legendaryactions", "legendäre-aktionen", "legendaere-aktionen"],
  "lair-actions": ["lairactions", "hort-aktionen"],
  "regional-effects": ["regionaleffects", "regionale-effekte"],
};

const SPELL = {
  ...BACK,
  level: ["spell-level", "grad", "stufe"],
  school: ["school-of-magic", "schule"],
  classes: ["spell-lists", "klassen"],
  "casting-time": ["castingtime", "zeitaufwand"],
  range: ["reichweite"],
  components: ["komponenten"],
  duration: ["wirkungsdauer", "dauer"],
  ritual: [],
  concentration: ["konzentration"],
  "higher-levels": [
    "at-higher-levels",
    "higher-level-slot",
    "höhere-grade",
    "hoehere-grade",
  ],
  "cantrip-upgrade": ["cantrip-scaling", "zaubertrick-verbesserung"],
};

const ITEM = {
  ...BACK,
  category: ["item-type", "kategorie", "gegenstandsart"],
  rarity: ["seltenheit"],
  attunement: ["requires-attunement", "einstimmung"],
  weight: ["gewicht"],
  cost: ["price", "preis", "kosten"],
  damage: ["schaden"],
  properties: ["weapon-properties", "waffeneigenschaften"],
  mastery: ["weapon-mastery", "meisterschaft", "waffenmeisterschaft"],
  ac: ["armor-class", "armorclass", "rüstungsklasse", "ruestungsklasse", "rk"],
  strength: ["strength-requirement", "stärke", "staerke"],
  stealth: ["heimlichkeit"],
};

const GENERIC = {
  ...BACK,
  subtitle: ["untertitel"],
  origin: ["herkunft", "klasse", "volk", "hintergrund"],
  content: ["text", "inhalt", "kartentext", "body"],
  front: ["vorderseite", "front-side"],
};

/**
 * The shared card types and what each declares on top of the baseline
 * (`name`, `description`, `image` and the rest come from there, the same
 * in both). A property one edition does not print is declared anyway: the
 * insert commands and the property reference offer the same fields in both.
 */
const VOCABULARY: Record<string, Record<string, string[]>> = {
  creature: CREATURE,
  spell: SPELL,
  item: ITEM,
  generic: GENERIC,
};

describe.each(EDITIONS)("%s", (id) => {
  it("has exactly the shared card types", async () => {
    const system = await loadedSystem(id);
    expect(Object.keys(system.cardTypes).sort()).toEqual(Object.keys(VOCABULARY).sort());
  });

  describe.each(Object.entries(VOCABULARY))("card type %s", (cardTypeId, vocabulary) => {
    it("declares every property of the vocabulary with its aliases", async () => {
      const system = await loadedSystem(id);
      const properties = system.cardTypes[cardTypeId]?.properties ?? {};
      const declared = Object.fromEntries(
        Object.keys(vocabulary).map((key) => [
          key,
          [...(properties[key]?.aliases ?? [])].sort(),
        ])
      );
      const expected = Object.fromEntries(
        Object.entries(vocabulary).map(([key, aliases]) => [key, [...aliases].sort()])
      );
      expect(declared).toEqual(expected);
    });
  });
});

describe.each(Object.keys(VOCABULARY))("card type %s", (cardTypeId) => {
  it("declares the same properties in both editions, nothing more in either", async () => {
    const [older, newer] = await Promise.all(EDITIONS.map((id) => loadedSystem(id)));
    const shape = (system: LoadedSystem | undefined) =>
      Object.fromEntries(
        Object.entries(system?.cardTypes[cardTypeId]?.properties ?? {})
          .map(([key, def]) => [key, [...(def.aliases ?? [])].sort()] as const)
          .sort(([a], [b]) => a.localeCompare(b))
      );
    expect(shape(newer)).toEqual(shape(older));
  });
});

/** Every fixture note of one edition, its `system:` switched to the other. */
const SWITCHES = EDITIONS.flatMap((from) => {
  const to = EDITIONS.find((id) => id !== from)!;
  return listFixtures()
    .filter((fixture) => fixture.system === from)
    .map((fixture) => [`${from}/${fixture.name} → ${to}`, fixture, from, to] as const);
});

it("has fixtures in both editions to switch", () => {
  for (const id of EDITIONS) {
    expect(
      SWITCHES.some(([, , from]) => from === id),
      id
    ).toBe(true);
  }
});

describe.each(SWITCHES)("%s", (_label, fixture, from, to) => {
  it("renders with the other edition and nothing to report", async () => {
    const text = readFileSync(fixture.path, "utf-8").replace(
      new RegExp(`^(\\s*system:\\s*)${from}\\s*$`, "m"),
      `$1${to}`
    );
    expect(text, "the fixture names its system on a line of its own").toContain(
      `system: ${to}`
    );
    const cards = await renderNote(text, fixture.path, to, fixtureImages);
    expect(cards.length).toBeGreaterThan(0);
  });
});
