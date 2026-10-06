```cardsmith
card:
  system: dragonbane
  card-type: rule
  language: en
data:
  # Name of the skill, ability or spell. Also on the plaque of the back.
  name: Ember Grip

  # Description or rule text of the card — the paragraph below the stat block.
  description: Your hand glows like a coal from the hearth. Whatever you touch begins to smoulder.

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Card-back image as a wikilink. Without it the back shows what the card type provides (a creature's portrait), else the deck's emblem. `front-image` does not feed this — it is front-only.
  back-image: '[[Medaillon.png]]'

  # Card family — the large green title at the top of the back. Without it the card type's own label appears there ("Ausrüstung", "Waffe"). For roll tables put the table's name here ("Demon Roll in Melee", "Fear", "Hunting"); it then doubles as the title fallback when the table row has no name of its own. In a table note, set once in the frontmatter for all rows.
  category: Magic

  # Finer grouping within the card family — set in smaller type under the back's large title (e.g. "Elementalism", "Heroic ability"). Without it the line is omitted; if the value equals `category` it is omitted as well.
  subcategory: Elementalism

  # Source reference — book title with page number, or a wikilink into the vault. Set upright along the card's right edge; falls back to "DRAGONBANE".
  book-reference: House Rules p. 9

  # English original name, set small and upright along the card's left edge — the counterpart to the source reference on the right. Omitted when unset.
  english-original: Ember Grip

  # Picture as a wikilink. Rendered on the card front.
  front-image: '[[Glutgriff.jpg]]'

  # Attribute a skill is rolled against: STR, CON, AGL, INT, WIL or CHA.
  attribute: # no sample

  # Rank of the spell (1–5) or "Magic trick". Quote it so "Magic trick" can stand alongside the numbers.
  rank: '1'

  # What the character must already have: for abilities a skill at 12 ("Evade 12") or a profession, for spells the school of magic or the prerequisite spell. "–" for none.
  prerequisite: '[[Ash Breath]]'

  # Willpower Points to use it. Abilities: a fixed number, "–" for permanent ones, "variable" when the cost depends on the use. Spells: "1" for magic tricks, "2 per power level" for scaling ones, "2" for spells without power levels (Rules p. 58).
  wp-cost: '3'

  # Requirement — what casting demands: word, gesture, focus (…) or ingredient (…).
  casting-requirement: Word, gesture

  # Casting time — action, reaction, stretch or shift.
  casting-time: Action

  # Range of the spell in metres, or "Touch" / "Self".
  range: 10 meters

  # Duration — instant, stretch, shift or permanent.
  duration: Instant

  # Mechanical effect — what the card does when it triggers.
  effect: 'Touch attack: d6 fire damage, +d6 per power level.'

  # Free-form note rendered unobtrusively on the card.
  note: 'Optional: only in daylight.'
```
