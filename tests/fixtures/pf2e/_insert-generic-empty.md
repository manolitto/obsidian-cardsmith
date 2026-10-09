```cardsmith
card:
  system: pf2e
  card-type: generic
  language: en
data:
  # The card's name — creature, item, feat, action or hazard. Falls back to the note's file name.
  name:

  # The card's picture as a wikilink (`[[Basilisk.png]]`), embed (`![[Basilisk.png]]`) or file name. Shown large on the card back; creatures and items also show it on the front when there is room.
  image:

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker:

  # Source reference — book title and page number, optionally a wikilink (`[[…]]`). Set small at the bottom right of the card.
  source:

  # English original name. Set small at the bottom left of the card, prefixed "engl."; hidden on English cards.
  original-name:

  # Card body as markdown, inline in the cardsmith block. Takes precedence over the note's text. Use the note's text for tables and embedded pictures.
  content:

  # The section under a `## Vorderseite` or `## Front` heading in the note fills the card when the block sets no `content`. Fully rendered — tables, headings, lists and embedded pictures included.
  vorderseite:

  # Second line under the back's banner, in smaller type. Omitted when empty.
  back-subtitle:
```
