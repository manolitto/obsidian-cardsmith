```cardsmith
card:
  system: 5e_2014
  card-type: spell
data:
  # The card's name. Falls back to the file name.
  name:

  # What the spell does — markdown, paragraphs and lists.
  description:

  # A picture for the back — a wikilink to a picture in the vault. Without one the back shows a d20.
  image:

  # The note's text before the first `##` heading, as markdown. Not written in the block — it is the note itself; a card type binds it to a place on the card.
  body:

  # The label on the back — above the picture or the d20 — `Background`, `Feat`, `NPC`. Without it a creature's type, else the card type's own. A feature's origin or a spell's school follows it.
  back-label:

  # The spell's level, 0 to 9; 0 is a cantrip.
  level:

  # The school of magic — `Evocation`; the German name reads the same.
  school:

  # The casting time — `1 action`, `1 bonus action`, `1 minute`.
  casting-time:

  # The range — `60 feet`, `Self`, `Touch`.
  range:

  # The components — `V, S, M (a pinch of ash)`.
  components:

  # The duration — `Instantaneous`, `1 minute`. With `concentration`, the card prints “Concentration, up to” before it.
  duration:

  # `true` for a spell that can be cast as a ritual: “(ritual)” after the school.
  ritual:

  # `true` for a spell that requires concentration.
  concentration:

  # What a higher spell slot adds, after “At Higher Levels.” in bold italics.
  higher-levels:

  # How a cantrip grows with the caster's level — a paragraph after the text.
  cantrip-upgrade:
```
