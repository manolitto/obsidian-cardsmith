```cardsmith
card:
  system: daggerheart
  card-type: subclass
  language: en
data:
  # The card's name, shown as the title on the front. Falls back to the note's file name when unset.
  name:

  # The card's text — Markdown; a feature's name in bold, as the cards print it.
  description:

  # A picture for the upper half of the front — a wikilink to an image in the vault. Without one the text moves up.
  image:

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker:

  # The class — Bard, Druid, Guardian, Ranger, Rogue, Seraph, Sorcerer, Warrior or Wizard; German names work too. The word in the ribbon.
  class:

  # Which of the subclass's three cards this is: Foundation, Specialization or Mastery.
  stage:

  # The subclass's spellcast trait — Agility, Strength, Finesse, Instinct, Presence or Knowledge. Leave it out for a subclass without one.
  spellcast-trait:
```
