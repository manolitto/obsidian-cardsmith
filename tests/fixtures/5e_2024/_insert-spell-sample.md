```cardsmith
card:
  system: 5e_2024
  card-type: spell
  language: en
data:
  # The card's name. Falls back to the file name.
  name: Ember Lance

  # What the spell does — markdown, paragraphs and lists.
  description: A lance of white-hot ash strikes one creature you can see within range. Make a ranged spell attack. *Hit:* 3d8 Fire damage, and the target sheds dim light until the start of your next turn.

  # A picture for the back — a wikilink to a picture in the vault. Without one the back shows a d20.
  image: '[[Ember-Lance.png]]'

  # The note's text before the first `##` heading, as markdown. Not written in the block — it is the note itself; a card type binds it to a place on the card.
  body: # no sample

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # The label on the back — above the picture or the d20 — `Background`, `Feat`, `NPC`. Without it a creature's type or an item's category, else the card type's own. A feature's origin or a spell's school follows it.
  back-label: # no sample

  # The spell's level, 0 to 9; 0 is a cantrip.
  level: 2

  # The school of magic — `Evocation`; the German name reads the same.
  school: Evocation

  # The classes whose spell lists hold it — a list, or comma-separated — in parentheses after the school.
  classes:
    - Sorcerer
    - Wizard

  # The casting time — `Action`, `Bonus Action`, `1 minute`.
  casting-time: Action

  # The range — `60 feet`, `Self`, `Touch`.
  range: 60 feet

  # The components — `V, S, M (a pinch of ash)`.
  components: V, S

  # The duration — `Instantaneous`, `1 minute`. With `concentration`, the card prints “Concentration, up to” before it.
  duration: Instantaneous

  # `true` for a spell that can be cast as a ritual: “or Ritual” after the casting time.
  ritual: # no sample

  # `true` for a spell that requires concentration.
  concentration: # no sample

  # What a higher spell slot adds, after its lead in bold italics.
  higher-levels: The damage increases by 1d8 for each spell slot level above 2.

  # How a cantrip grows with the caster's level, after its lead in bold italics.
  cantrip-upgrade: # no sample
```
