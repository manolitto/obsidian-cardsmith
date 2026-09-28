```cardsmith
card:
  system: eiserne-zeit
  card-type: generic
  language: en
data:
  # Card title — white inside the black header band. Falls back to the note's file name when unset.
  name: Warding Circle

  # Optional picture as a wikilink (`[[picture.png]]`), embed (`![[picture.png]]`) or file name. Sits below the header band across the full measure. The system is strictly black and white — a hard ink drawing fits, a greyscale photo does not.
  image: '[[Bannkreis.png]]'

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Card body as markdown, inline in the cardsmith block. Takes precedence over the note's text. Use the note's text for tables and embedded pictures.
  content: |-
    A circle of salt and iron filings that nothing unholy may cross.
    - Range: 10 feet
    - Duration: until dawn

  # Source reference. Runs rotated along the right edge, in caps. Convention: book title, comma, page — "The Dog Handler, p. 8".
  reference: House Rules, p. 12

  # Label of the black foot band, in white caps on every face of the card (e.g. "SPELL", "GEAR", "COMPANION"). Falls back to the card type's own label when unset.
  card-type-label: Spell
```
