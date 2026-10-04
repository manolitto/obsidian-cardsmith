```cardsmith
card:
  system: daggerheart
  card-type: item
  language: en
data:
  # The card's name, shown as the title on the front. Falls back to the note's file name when unset.
  name: Broadsword

  # The card's text — Markdown; a feature's name in bold, as the cards print it.
  description: '**Reliable:** +1 to attack rolls.'

  # A picture for the upper half of the front — a wikilink to an image in the vault. Without one the text moves up.
  image: # no sample

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Die-roll result (range or single value) under which this card appears in the source table. Display form — e.g. "01", "23–24", "98–100". For numeric queries and sorting see `roll-min` and `roll-max`.
  roll: '01'

  # Primary Weapon, Secondary Weapon, Armor, Loot or Consumable — the word in the ribbon.
  category: Primary Weapon

  # The tier, 1 to 4 — the number in the pennant.
  tier: 1

  # A weapon's trait — Agility, Strength, Finesse, Instinct, Presence, Knowledge or Spellcast.
  trait: Agility

  # A weapon's range — Melee, Very Close, Close, Far or Very Far.
  range: Melee

  # A weapon's damage — "d8 phy", "d10+3 mag".
  damage: d8 phy

  # A weapon's burden — One-Handed or Two-Handed.
  burden: One-Handed

  # An armor's base thresholds, major / severe — "5 / 11".
  thresholds: # no sample

  # An armor's base score — the number in the badge.
  armor-score: # no sample

  # Loot's rarity — Common, Uncommon, Rare or Legendary; in italics under the name.
  rarity: # no sample
```
