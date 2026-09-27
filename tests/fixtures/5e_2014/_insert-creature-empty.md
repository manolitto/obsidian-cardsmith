```cardsmith
card:
  system: 5e_2014
  card-type: creature
data:
  # The card's name. Falls back to the file name.
  name:

  # The creature's picture — a wikilink to a picture in the vault — large on the back between the orange bars. Without one the back shows a d20 and the back label.
  image:

  # The label on the back — above the picture or the d20 — `Background`, `Feat`, `NPC`. Without it a creature's type or an item's category, else the card type's own. A feature's origin or a spell's school follows it.
  back-label:

  # The size category — Tiny, Small, Medium, Large, Huge, Gargantuan — first in the italic line under the name.
  size:

  # The creature type, with its tags in parentheses — `humanoid (goblinoid)`, `beast`, `undead`. Also the label on the back, unless the note sets `back-label`.
  type:

  # The alignment — `neutral evil`, `chaotic good`, `unaligned` — after the type, comma-separated.
  alignment:

  # Armor Class, usually a number with its source in parentheses — `15 (leather armor, shield)`.
  ac:

  # Hit Points, usually the average with the hit-die formula in parentheses — `7 (2d6)`.
  hp:

  # The speeds, comma-separated where there are several — `40 ft., climb 40 ft., fly 80 ft.`.
  speed:

  # Strength — `score (modifier)`, e.g. `8 (-1)`.
  str:

  # Dexterity — `score (modifier)`.
  dex:

  # Constitution — `score (modifier)`.
  con:

  # Intelligence — `score (modifier)`.
  int:

  # Wisdom — `score (modifier)`.
  wis:

  # Charisma — `score (modifier)`.
  cha:

  # The Strength saving throw bonus — `+5`. Set it where the creature is proficient; the Saving Throws line names the ones set.
  str-save:

  # The Dexterity saving throw bonus — `+5`.
  dex-save:

  # The Constitution saving throw bonus — `+5`.
  con-save:

  # The Intelligence saving throw bonus — `+5`.
  int-save:

  # The Wisdom saving throw bonus — `+5`.
  wis-save:

  # The Charisma saving throw bonus — `+5`.
  cha-save:

  # Skill bonuses, comma-separated — `Perception +3, Stealth +4`. The line prints when it is set.
  skills:

  # Damage vulnerabilities, comma-separated. The line prints when it is set.
  vulnerabilities:

  # Damage resistances, comma-separated. The line prints when it is set.
  resistances:

  # Damage immunities, comma-separated. The line prints when it is set.
  immunities:

  # Condition immunities, comma-separated — `charmed, frightened`. The line prints when it is set.
  condition-immunities:

  # The senses — `darkvision 60 ft., passive Perception 13`.
  senses:

  # The languages, or `—` for a creature that has none.
  languages:

  # The challenge rating — a number, a fraction (`1/8`, `1/2`) — with the experience points from `xp` in parentheses after it.
  cr:

  # The experience points for the creature, printed after the challenge rating — `1 (200 XP)`.
  xp:

  # The proficiency bonus, on the challenge line — `+2`. Prints when it is set.
  proficiency-bonus:

  # The traits above the actions — a list of `name` and `desc`; the description takes markdown and wikilinks.
  traits:

  # The actions, under their head — a list of `name` and `desc`; `*Melee Weapon Attack:*` and the like as markdown.
  actions:

  # The bonus actions, under their own head — the same shape as `actions`.
  bonus-actions:

  # The reactions, under their own head — the same shape as `actions`; each states its trigger in the description.
  reactions:

  # The legendary actions — the same shape as `actions`; the preamble is a first entry with only a `desc`, a cost belongs in the name — `Wing Attack (Costs 2 Actions)`.
  legendary-actions:

  # The lair actions — the same shape as `legendary-actions`, the preamble first.
  lair-actions:

  # The regional effects — the same shape as `legendary-actions`, the preamble first.
  regional-effects:
```
