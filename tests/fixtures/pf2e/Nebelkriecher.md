# Nebelkriecher

A creature whose values live in a `statblock` block, the way a note kept
for a stat-block plugin carries them: plain YAML keys under the plugin's
vocabulary (`hp`, `ac`, `sourcebook`), `Key::` lines beside them — one of
them continued as a list — and the plugin's own `layout:` key, which no
property reads. The `cardsmith` block names the card and overrides one
value, so the card prints the block's name over the statblock's. Invented
for this deck — no creature of any published bestiary.

```statblock
layout: Pathfinder 2e Creature Layout
name: Nebelkriecher (Kampagnenbuch)
level: Kreatur 2

alignment: NB
size: mittelgroß
traits:
  - Untot
  - Nebel

modifier: 8
senses: Dunkelsicht, Lebenssinn 9 m

Fertigkeiten::
  - Heimlichkeit: 9
  - Athletik: 6

attributes:
  - ST: 2
  - GE: 3
  - KO: 1
  - IN: -2
  - WE: 2
  - CH: 0

ac: 16
saves:
  - ZÄH: 7
  - REF: 9
  - WIL: 8

hp: 30
immunities: Gift, Krankheit
weaknesses: Feuer 5

stride: 6 m, Fliegen 6 m

attacks:
  - name: __Nahkampfangriff__ ⬻ Klaue
    bonus: 9
    damage: 1W6+2 Hieb plus Kälteschaden 1W4
  - name: __Nebelleib__
    desc: Der Nebelkriecher kann durch jede Öffnung gleiten, durch die Rauch dringt.

Beschreibung:: "Ein Schemen aus feuchtem Dunst, der nachts über das Moor zieht und dessen Klauen erst zu spüren sind, wenn die Kälte schon im Knochen sitzt."

sourcebook: [[Kampagnenbuch S. 44]]
```

```cardsmith
card:
  system: pf2e
  card-type: creature
data:
  name: Nebelkriecher
```
