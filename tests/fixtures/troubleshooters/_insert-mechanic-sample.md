```cardsmith
card:
  system: troubleshooters
  card-type: mechanic
  language: en
data:
  # The card's name. Falls back to the file name.
  name: Taking cover

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Source reference — rulebook page or wikilink, small at the foot.
  reference: Rulebook p. 88

  # What the mechanic requires or what triggers it — an action type, a minimum initiative, a successful check.
  requires: Move action

  # The rule's text — markdown, paragraphs welcome.
  content: Whoever ducks behind something solid is harder to hit at range for as long as the cover holds.

  # The mechanic's bullet points — a list of `name` and `desc`, orange bullets before them.
  points:
    - name: 'Light cover:'
      desc: Attacks against you are at −1 pip.
    - name: 'Heavy cover:'
      desc: Attacks against you are at −2 pips; a fumble hits the cover instead.
```
