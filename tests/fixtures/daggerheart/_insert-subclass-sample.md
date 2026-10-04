```cardsmith
card:
  system: daggerheart
  card-type: subclass
  language: en
data:
  # The card's name, shown as the title on the front. Falls back to the note's file name when unset.
  name: Troubadour

  # The card's text — Markdown; a feature's name in bold, as the cards print it.
  description: |-
    **Gifted Performer:** You can play three different types of songs, once each per long rest; describe how you perform for others to gain the listed benefit:
  
    - **Relaxing Song:** You and all allies within Close range clear a Hit Point.
    - **Epic Song:** Make a target within Close range temporarily Vulnerable.
    - **Heartbreaking Song:** You and all allies within Close range gain a Hope.

  # A picture for the upper half of the front — a wikilink to an image in the vault. Without one the text moves up.
  image: # no sample

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # The class — Bard, Druid, Guardian, Ranger, Rogue, Seraph, Sorcerer, Warrior or Wizard; German names work too. The word in the ribbon.
  class: Bard

  # Which of the subclass's three cards this is: Foundation, Specialization or Mastery.
  stage: Foundation

  # The subclass's spellcast trait — Agility, Strength, Finesse, Instinct, Presence or Knowledge. Leave it out for a subclass without one.
  spellcast-trait: Presence
```
