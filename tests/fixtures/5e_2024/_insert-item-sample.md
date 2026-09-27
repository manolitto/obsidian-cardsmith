```cardsmith
card:
  system: 5e_2024
  card-type: item
data:
  # The card's name. Falls back to the file name.
  name: Lantern of Ash

  # What the item is and does — markdown, paragraphs and lists.
  description: While lit, this brass lantern sheds dim grey light in a 20-foot radius. Invisible creatures in that light leave faint trails of ash.

  # The item's picture — a wikilink to a picture in the vault — on the back. Without one the back shows a d20.
  image: # no sample

  # The note's text before the first `##` heading, as markdown. Not written in the block — it is the note itself; a card type binds it to a place on the card.
  body: # no sample

  # The label on the back — above the picture or the d20 — `Background`, `Feat`, `NPC`. Without it a creature's type or an item's category, else the card type's own. A feature's origin or a spell's school follows it.
  back-label: # no sample

  # The category, with the base item in parentheses — `Wondrous Item`, `Weapon (Longsword)`, `Armor (Shield)`. Also the label on the back, unless the note sets `back-label`.
  category: Wondrous Item

  # The rarity — `Common`, `Uncommon`, `Rare`, `Very Rare`, `Legendary`, `Artifact` — after the category.
  rarity: Uncommon

  # `true` for an item that requires attunement, or who may attune — `by a Wizard` — printed after “Requires Attunement”.
  attunement: true

  # The weight — `3 lb.`.
  weight: 2 lb.

  # The cost — `15 GP`.
  cost: 400 GP

  # A weapon's damage — `1d8 Slashing`.
  damage: # no sample

  # A weapon's properties, comma-separated — `Versatile (1d10)`.
  properties: # no sample

  # A weapon's mastery property — `Sap`.
  mastery: # no sample

  # An armour's Armor Class — `14 + Dex modifier (max 2)`, `+2`.
  ac: # no sample

  # The Strength an armour needs — `Str 13`.
  strength: # no sample

  # What an armour does to Stealth — `Disadvantage`.
  stealth: # no sample
```
