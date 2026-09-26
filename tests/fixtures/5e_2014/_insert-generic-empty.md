```cardsmith
card:
  system: 5e_2014
  card-type: generic
data:
  # The card's name. Falls back to the file name.
  name:

  # A picture — a wikilink to a picture in the vault — on the back. Without one the back shows a d20.
  image:

  # The label on the back — above the picture, or under the d20 — `Bestiary`, `NPC`. Without it the card type's own.
  back-label:

  # The italic line under the name — `Rogue feature, 1st level`, `Feat`, `Elf trait`.
  subtitle:

  # Where the card comes from, on the back under the label — the class (`Rogue`, `Cleric (Light Domain)`), the race (`Hill Dwarf`), the background (`Soldier`), a feat's prerequisite.
  origin:

  # The card's text as markdown, inline in the cardsmith block. Takes precedence over the note's text. Use the note's text for tables and embedded pictures.
  content:

  # The section under a `## Front` heading in the note fills the card when the block sets no `content`, in place of the note's text. Fully rendered — tables, headings, lists and embedded pictures included. Under a `## Vorderseite` heading only in a note with no text before its first heading.
  front:
```
