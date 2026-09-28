```cardsmith
card:
  system: mini-d20
  card-type: ability
  language: en
data:
  # The card's name. Falls back to the file name.
  name: Multishot

  # Flavour or a short description — an italic line at the foot of the card.
  description: One breath, one twang of the string — and three arrows find their mark.

  # The card's picture as a wikilink (`[[image.png]]`), embed (`![[image.png]]`) or file name. Sits between the stats and the flavour and takes the room that is left.
  image: '[[Mehrfachschuss.png]]'

  # Tags as pills — "Active", "Passive", "Melee", "Ranged Combat", "Spell", "Projectile". One to three are usual.
  tags:
    - Active
    - Ranged Combat

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Source reference — rulebook page or wikilink, small under the red line at the foot.
  reference: Rules p. 16

  # The card type's icon, top left and large on the back — a path under the system. Preset; set it only for another bundled icon.
  icon: assets/icons/skills.svg

  # Archetype the ability belongs to — Rogue, Fighter, Cleric or Mage, a wikilink if you like. Stands under the right icon and picks it.
  archetype: '[[Rogue]]'

  # The ability's rule — what it does (markdown).
  effect: With a ranged weapon you can attack up to three targets with one action.

  # Explanations of single tags as a list of single-key pairs (`{ Active: … }`) — how often "Active" triggers for a cleric, say. Set small under the effect.
  tag-description:
    - Active: Twice per day per character level.
```
