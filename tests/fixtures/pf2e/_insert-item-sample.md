```cardsmith
card:
  system: pf2e
  card-type: item
  language: en
data:
  # The card's name — creature, item, feat, action or hazard. Falls back to the note's file name.
  name: Fog-Rune Armor

  # Item description as markdown — the main body of the card.
  description: Runes on the inside of this armor keep the wearer warm and shed mist and drizzle. Its item bonus to AC is 1 higher.

  # The card's picture as a wikilink (`[[Basilisk.png]]`), embed (`![[Basilisk.png]]`) or file name. Shown large on the card back; creatures and items also show it on the front when there is room.
  image: '[[Nebelruestung.jpg]]'

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Source reference — book title and page number, optionally a wikilink (`[[…]]`). Set small at the bottom right of the card.
  source: House Rules p. 27

  # English original name. Set small at the bottom left of the card, prefixed "engl."; hidden on English cards.
  original-name: Fog-Rune Armor

  # Hit points of a shield or item as a number (`20`).
  hit-points: # no sample

  # Hardness of a shield or item (`3`, `5`, …). Damage the item takes is reduced by it.
  hardness: # no sample

  # Level or category as free text: `Item N` for magic items, the word for mundane gear without a level (`Weapon`, `Armor`, `Shield`). Shown as the badge at the right of the header.
  level: Item 5

  # List of traits — school, tradition, category, damage type, rarity. Each entry becomes a pill; the rarities `ungewöhnlich`, `selten` and `einzigartig` take the rarity colour.
  traits:
    - Abjuration
    - Magical
    - Flexible

  # Price as free text, conventionally in gold pieces (`160 gp`).
  price: 160 gp

  # Weapon damage as a dice expression with its type: `1d8 P` (piercing), `1d6 B` (bludgeoning), `1d6 S` (slashing).
  damage: # no sample

  # Range of a ranged weapon as free text (e.g. `120 ft.`).
  range: # no sample

  # Reload value of a ranged weapon (`0`, `1`, `2`, `1+`, `—`).
  reload: # no sample

  # Armor's AC bonus as free text (`+0`, `+1`, `+2`, …).
  ac-bonus: '+3'

  # Armor's Dex cap as free text (`+5`, `+3`, `+0`, `—`).
  dex-cap: '+2'

  # Armor's check penalty as free text (`—`, `–1`, `–2`, `–3`).
  check-penalty: –2

  # Armor's speed penalty as free text (`—`, `–5 ft.`, `–10 ft.`).
  speed-penalty: –5 ft.

  # Armor's strength threshold (`10`, `12`, `14`, `16`, `18`, `—`). At or above it the check penalty no longer applies.
  strength: '14'

  # Bulk as free text (`L` for light, `1`, `2`, `—`).
  bulk: '2'

  # Broken threshold of a shield or item as a number (`10`). At this HP value it counts as broken.
  broken-threshold: # no sample

  # Usage (`Held in 1 hand`, `Held in 2 hands`, `Worn`, `Worn (belt)`).
  usage: Worn armor

  # Explanations of the traits as a list of objects with `name` (set bold) and `desc` (markdown). Printed after the description as its own list, each entry led by `*`.
  # 
  trait-descriptions:
    - name: Flexible
      desc: The check penalty doesn't apply to Acrobatics and Athletics checks.

  # Activated abilities of the item as a list. Each entry is an object of optional fields; the card prints what is set:
  # 
  # | Field          | Meaning                                                                  |
  # | -------------- | ------------------------------------------------------------------------ |
  # | `name`         | Ability name or the word `Activate` (set bold)                           |
  # | `actions`      | Action cost — `1`, `2`, `3`, `r` (reaction), `f` (free) or the glyph     |
  # | `components`   | Activation components without parentheses, e.g. `concentrate`           |
  # | `frequency`    | Frequency, e.g. `1/day`                                                  |
  # | `trigger`      | Trigger of a reaction                                                    |
  # | `requirements` | Requirements of the activation                                           |
  # | `effect`       | Effect                                                                   |
  # | `desc`         | Trailing free text                                                       |
  # 
  activations:
    - name: Activate
      actions: '1'
      components: concentrate
      frequency: once per hour
      effect: The runes wrap you in mist. You're concealed until the start of your next turn.
```
