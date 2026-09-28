```cardsmith
card:
  system: pf2e
  card-type: feat
  language: en
data:
  # The card's name — creature, item, feat, action or hazard. Falls back to the note's file name.
  name: Hasty Antidote

  # The feat's rule as markdown — the main body of the card. Degrees of success may stand bold inside the text (`**Success** You notice …`).
  description: With a few deft motions you mix an antidote and pour it down your ally's throat. The ally gains resistance 5 to the triggering damage type until the start of your next turn.

  # The card's picture as a wikilink (`[[Basilisk.png]]`), embed (`![[Basilisk.png]]`) or file name. Shown large on the card back; creatures and items also show it on the front when there is room.
  image: '[[Alchemie.png]]'

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Source reference — book title and page number, optionally a wikilink (`[[…]]`). Set small at the bottom right of the card.
  source: House Rules p. 14

  # English original name. Set small at the bottom left of the card, prefixed "engl."; hidden on English cards.
  original-name: Hasty Antidote

  # Feat level as free text, conventionally `Feat N` (e.g. `Feat 1`). Shown as the badge at the right of the header.
  level: Feat 2

  # The feat's action cost, printed as a glyph beside the name: `1`, `2`, `3`, `r` (reaction), `f` (free) or the glyph itself. Passive feats omit it.
  action-cost: r

  # List of traits — rarity, feat category (`Allgemein`, `Fertigkeit`, class, ancestry) and mechanical traits (`Konzentration`, `Manipulation`, `Heilung`). Each entry becomes a pill; the rarities take the rarity colour.
  traits:
    - General
    - Skill

  # Prerequisites for taking the feat — proficiency ranks, ability scores, other feats.
  prerequisites: expert in Crafting

  # How often the feat may be used (e.g. `once per round`, `once per day`).
  frequency: once per hour

  # Trigger of reactions and some free actions.
  trigger: An ally within your reach takes poison or acid damage.

  # Requirements at the time of use — the state or item that must apply then (as opposed to the prerequisites for taking the feat).
  requirements: You're holding or wearing alchemist's tools.

  # Trailing note, usually the multiple-selection clause (`You can select this feat more than once.`).
  special: If you're a master in Crafting, the resistance increases to 10.
```
