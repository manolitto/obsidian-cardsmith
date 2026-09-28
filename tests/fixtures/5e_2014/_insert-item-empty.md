```cardsmith
card:
  system: 5e_2014
  card-type: item
  language: en
data:
  # The card's name. Falls back to the file name.
  name:

  # What the item is and does — markdown, paragraphs and lists.
  description:

  # The item's picture — a wikilink to a picture in the vault — on the back. Without one the back shows a d20.
  image:

  # The note's text before the first `##` heading, as markdown. Not written in the block — it is the note itself; a card type binds it to a place on the card.
  body:

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker:

  # The label on the back — above the picture or the d20 — `Background`, `Feat`, `NPC`. Without it a creature's type or an item's category, else the card type's own. A feature's origin or a spell's school follows it.
  back-label:

  # The category, with the base item in parentheses — `Wondrous item`, `Weapon (longsword)`, `Armor (shield)`. Also the label on the back, unless the note sets `back-label`.
  category:

  # The rarity — `common`, `uncommon`, `rare`, `very rare`, `legendary`, `artifact` — after the category.
  rarity:

  # `true` for an item that requires attunement, or who may attune — `by a wizard` — printed after “requires attunement”.
  attunement:

  # The weight — `3 lb.`.
  weight:

  # The cost — `15 gp`.
  cost:

  # A weapon's damage — `1d8 slashing`.
  damage:

  # A weapon's properties, comma-separated — `Versatile (1d10)`.
  properties:

  # An armour's Armor Class — `14 + Dex modifier (max 2)`, `+2`.
  ac:

  # The Strength an armour needs — `Str 13`.
  strength:

  # What an armour does to Stealth — `Disadvantage`.
  stealth:
```
