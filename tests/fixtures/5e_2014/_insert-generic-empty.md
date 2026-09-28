```cardsmith
card:
  system: 5e_2014
  card-type: generic
  language: en
data:
  # The card's name. Falls back to the file name.
  name:

  # A picture — a wikilink to a picture in the vault — on the back. Without one the back shows a d20.
  image:

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker:

  # The label on the back — above the picture or the d20 — `Background`, `Feat`, `NPC`. Without it a creature's type or an item's category, else the card type's own. A feature's origin or a spell's school follows it.
  back-label:

  # The italic line under the name — `Rogue feature, 1st level`, `Feat`, `Elf trait`.
  subtitle:

  # Where the card comes from, on the back after the label — the class (`Rogue`, `Cleric (Light Domain)`), the race (`Hill Dwarf`), the background (`Soldier`), a feat's prerequisite.
  origin:

  # The card's text as markdown, inline in the cardsmith block. Takes precedence over the note's text. Use the note's text for tables and embedded pictures.
  content:

  # The section under a `## Front` heading in the note fills the card when the block sets no `content`, in place of the note's text. Fully rendered — tables, headings, lists and embedded pictures included. Under a `## Vorderseite` heading only in a note with no text before its first heading.
  front:
```
