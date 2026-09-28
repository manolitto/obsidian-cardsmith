```cardsmith
card:
  system: pf2e
  card-type: action
  language: en
data:
  # The card's name — creature, item, feat, action or hazard. Falls back to the note's file name.
  name: Grab an Edge

  # The action's effect as markdown — the main body of the card.
  description: When you fall off an edge, you can try to grab it. Attempt an Acrobatics check, usually against the Climb DC.

  # The card's picture as a wikilink (`[[Basilisk.png]]`), embed (`![[Basilisk.png]]`) or file name. Shown large on the card back; creatures and items also show it on the front when there is room.
  image: '[[Kantengriff.png]]'

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Source reference — book title and page number, optionally a wikilink (`[[…]]`). Set small at the bottom right of the card.
  source: Core Rulebook p. 472

  # English original name. Set small at the bottom left of the card, prefixed "engl."; hidden on English cards.
  original-name: Grab an Edge

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
  trigger: You fall from or past an edge or handhold.

  # Requirements for performing the action.
  requirements: Your hands are not tied.

  # Outcome on a critical success.
  critical-success: You grab the edge whether or not you have a hand free, and treat the fall as 30 feet shorter.

  # Outcome on a success.
  success: With at least one hand free you grab the edge and treat the fall as 20 feet shorter.

  # Outcome on a failure.
  failure: ''

  # Outcome on a critical failure.
  critical-failure: You continue to fall and take an additional 10 bludgeoning damage for every 20 feet already fallen.

  # Box at the end of the card — an example list or a named sub-rule. An object with `title` (optional) and `body` (markdown); without `title` the text stands alone in the tinted box.
  # 
  callout:
    title: Forced Movement
    body: When an effect moves a creature, the effect sets the distance, not its Speed; the movement triggers no reactions.
```
