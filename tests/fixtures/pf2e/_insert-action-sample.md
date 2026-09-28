```cardsmith
card:
  system: pf2e
  card-type: action
  language: en
data:
  # The card's name — creature, item, feat, action or hazard. Falls back to the note's file name.
  name: Ledge Catch

  # The action's effect as markdown — the main body of the card.
  description: As you fall, you snatch at the rim you are dropping past. Attempt an Acrobatics check, usually against the Climb DC.

  # The card's picture as a wikilink (`[[Basilisk.png]]`), embed (`![[Basilisk.png]]`) or file name. Shown large on the card back; creatures and items also show it on the front when there is room.
  image: '[[Kantengriff.png]]'

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Source reference — book title and page number, optionally a wikilink (`[[…]]`). Set small at the bottom right of the card.
  source: House Rules p. 8

  # English original name. Set small at the bottom left of the card, prefixed "engl."; hidden on English cards.
  original-name: Ledge Catch

  # Action cost, printed as a glyph beside the name: `1`, `2`, `3`, `r` (reaction), `f` (free) or the glyph itself.
  actions: r

  # Skill the action belongs to (e.g. `Akrobatik`, `Athletik`). Shown as the badge at the right of the header; a list for several skills, joined with "/". Basic actions omit it.
  skill: Acrobatics

  # Required proficiency rank in the skill (`ungeübt`, `geübt`, `Experte`, `Meister`, `Legende`), under the skill in the badge.
  training: trained

  # List of the action's traits (`Bewegung`, `Offensiv`, `Handhaben`, `Konzentration`, `Verdeckt`, `Erkundung`, …). Each entry becomes a dark-red pill under the title.
  categories:
    - Move

  # Frequency (e.g. `1/day`, `once per hour`).
  frequency: ''

  # Trigger of the action, for reactions and free actions.
  trigger: You fall past a ledge within your reach.

  # Requirements for performing the action.
  requirements: At least one of your hands is not bound.

  # Outcome on a critical success.
  critical-success: You catch the ledge even with your hands full and haul yourself up onto it.

  # Outcome on a success.
  success: With a free hand you catch the ledge and hang from it; you take no falling damage.

  # Outcome on a failure.
  failure: ''

  # Outcome on a critical failure.
  critical-failure: You clutch at nothing, keep falling and land prone.

  # Box at the end of the card — an example list or a named sub-rule. An object with `title` (optional) and `body` (markdown); without `title` the text stands alone in the tinted box.
  # 
  callout:
    title: Hanging On
    body: While you hang from the ledge, all you can do is climb or let go.
```
