```cardsmith
card:
  system: mini-d20
  card-type: archetype
  language: en
data:
  # The archetype's name — Rogue, Fighter, Cleric, Mage. Picks the right icon as well.
  name: Rogue

  # Flavour or a short description — an italic line at the foot of the card.
  description: Quiet feet, quick fingers and always a way out.

  # The card's picture as a wikilink (`[[image.png]]`), embed (`![[image.png]]`) or file name. Sits between the stats and the flavour and takes the room that is left.
  image: '[[Schurke.jpg]]'

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Source reference — rulebook page or wikilink, small under the red line at the foot.
  reference: House Rules p. 16

  # The card type's icon, top left and large on the back — a path under the system. Preset.
  icon: assets/icons/character.svg

  # A short characterisation — one sentence or a motto under the name.
  tagline: There is always a way

  # Hit Points (HP) at level 1.
  hit-points: 12

  # Armor Class (AC) at level 1, without armor.
  armor-class: 10

  # Saving Throw (ST) — the target at level 1.
  saving-throw: 11

  # Starting skill bonuses as a list of single-key pairs (`{ Skill: bonus }`), set in two columns.
  skill-bonuses:
    - Stealth: '+4'
    - Sleight of Hand: '+4'
    - Acrobatics: '+3'
    - Perception: '+3'
    - Ranged Combat: '+2'
    - Melee: '+2'

  # Allowed armor (Light / Medium / Heavy / All), a list.
  allowed-armor:
    - Medium

  # Allowed weapons (Light / Medium / Heavy / All), a list.
  allowed-weapons:
    - Medium

  # The starting-abilities rule as a list of lines — how many at level 1, and what applies to this archetype.
  initial-abilities:
    - You start with two abilities.

  # The level-up rule as a list of lines — HP and ST per level, skill points and abilities.
  level-up-rules:
    - + 4 HP per level.
    - '- 1 ST per level.'
    - On each level-up through level 4 you gain 5 skill points and one more ability.
```
