```cardsmith
card:
  system: 5e_2014
  card-type: generic
data:
  # The card's name. Falls back to the file name.
  name: Ember Step

  # A picture — a wikilink to a picture in the vault — on the back. Without one the back shows a d20.
  image: # no sample

  # The label on the back — above the picture or the d20 — `Background`, `Feat`, `NPC`. Without it a creature's type, else the card type's own. A feature's origin or a spell's school follows it.
  back-label: # no sample

  # The italic line under the name — `Rogue feature, 1st level`, `Feat`, `Elf trait`.
  subtitle: Sorcerer feature, 3rd level

  # Where the card comes from, on the back after the label — the class (`Rogue`, `Cleric (Light Domain)`), the race (`Hill Dwarf`), the background (`Soldier`), a feat's prerequisite.
  origin: Sorcerer

  # The card's text as markdown, inline in the cardsmith block. Takes precedence over the note's text. Use the note's text for tables and embedded pictures.
  content: As a bonus action, you can teleport up to 15 feet to an unoccupied space you can see that is within 5 feet of a fire.

  # The section under a `## Front` heading in the note fills the card when the block sets no `content`, in place of the note's text. Fully rendered — tables, headings, lists and embedded pictures included. Under a `## Vorderseite` heading only in a note with no text before its first heading.
  front: # no sample
```
