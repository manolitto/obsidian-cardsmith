```cardsmith
card:
  system: troubleshooters
  card-type: npc
  language: en
data:
  # The card's name. Falls back to the file name.
  name:

  # Who the character is and what they do — a short paragraph under the numbers.
  description:

  # The card's picture — a wikilink to a picture in the vault.
  image:

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker:

  # Source reference — rulebook page or wikilink, small at the foot.
  reference:

  # Initiative in combat — underlings and lieutenants usually 7, mooks 5.
  initiative:

  # Vitality points — underlings around 5, bosses 7 and up.
  vitality:

  # Defence in percent — only lieutenants and bosses have one.
  defense:

  # The character's traits on one line — "Underling", "Mook", wikilinks welcome.
  traits:

  # The attacks — a list of `name` and `desc`: the weapon, then the skill in percent, the damage and the traits.
  attacks:

  # The skills — a list of `name` and `desc` with the percentage; basic and special usually first.
  skills:

  # Spoken languages, the fluency in parentheses.
  languages:
```
