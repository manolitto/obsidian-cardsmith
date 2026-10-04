```cardsmith
card:
  system: daggerheart
  card-type: item
  language: en
data:
  # The card's name, shown as the title on the front. Falls back to the note's file name when unset.
  name:

  # The card's text — Markdown; a feature's name in bold, as the cards print it.
  description:

  # A picture for the upper half of the front — a wikilink to an image in the vault. Without one the text moves up.
  image:

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker:

  # Die-roll result (range or single value) under which this card appears in the source table. Display form — e.g. "01", "23–24", "98–100". For numeric queries and sorting see `roll-min` and `roll-max`.
  roll:

  # Primary Weapon, Secondary Weapon, Armor, Loot or Consumable — the word in the ribbon.
  category:

  # The tier, 1 to 4 — the number in the pennant.
  tier:

  # A weapon's trait — Agility, Strength, Finesse, Instinct, Presence, Knowledge or Spellcast.
  trait:

  # A weapon's range — Melee, Very Close, Close, Far or Very Far.
  range:

  # A weapon's damage — "d8 phy", "d10+3 mag".
  damage:

  # A weapon's burden — One-Handed or Two-Handed.
  burden:

  # An armor's base thresholds, major / severe — "5 / 11".
  thresholds:

  # An armor's base score — the number in the badge.
  armor-score:

  # Loot's rarity — Common, Uncommon, Rare or Legendary; in italics under the name.
  rarity:
```
