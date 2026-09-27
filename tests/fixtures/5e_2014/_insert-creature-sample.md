```cardsmith
card:
  system: 5e_2014
  card-type: creature
data:
  # The card's name. Falls back to the file name.
  name: Cinder Hound

  # The creature's picture — a wikilink to a picture in the vault — large on the back between the orange bars. Without one the back shows a d20 and the back label.
  image: '[[Cinder-Hound.png]]'

  # The label on the back — above the picture or the d20 — `Background`, `Feat`, `NPC`. Without it a creature's type, else the card type's own. A feature's origin or a spell's school follows it.
  back-label: # no sample

  # The size category — Tiny, Small, Medium, Large, Huge, Gargantuan — first in the italic line under the name.
  size: Medium

  # The creature type, with its tags in parentheses — `humanoid (goblinoid)`, `beast`, `undead`. Also the label on the back, unless the note sets `back-label`.
  type: beast

  # The alignment — `neutral evil`, `chaotic good`, `unaligned` — after the type, comma-separated.
  alignment: unaligned

  # Armor Class, usually a number with its source in parentheses — `15 (leather armor, shield)`.
  ac: 13 (natural armor)

  # Hit Points, usually the average with the hit-die formula in parentheses — `7 (2d6)`.
  hp: 22 (4d8 + 4)

  # The speeds, comma-separated where there are several — `40 ft., climb 40 ft., fly 80 ft.`.
  speed: 40 ft.

  # Strength — `score (modifier)`, e.g. `8 (-1)`.
  str: 15 (+2)

  # Dexterity — `score (modifier)`.
  dex: 14 (+2)

  # Constitution — `score (modifier)`.
  con: 13 (+1)

  # Intelligence — `score (modifier)`.
  int: 3 (-4)

  # Wisdom — `score (modifier)`.
  wis: 12 (+1)

  # Charisma — `score (modifier)`.
  cha: 6 (-2)

  # The Strength saving throw bonus — `+5`. Set it where the creature is proficient; the Saving Throws line names the ones set.
  str-save: # no sample

  # The Dexterity saving throw bonus — `+5`.
  dex-save: # no sample

  # The Constitution saving throw bonus — `+5`.
  con-save: # no sample

  # The Intelligence saving throw bonus — `+5`.
  int-save: # no sample

  # The Wisdom saving throw bonus — `+5`.
  wis-save: # no sample

  # The Charisma saving throw bonus — `+5`.
  cha-save: # no sample

  # Skill bonuses, comma-separated — `Perception +3, Stealth +4`. The line prints when it is set.
  skills: Perception +3, Stealth +4

  # Damage vulnerabilities, comma-separated. The line prints when it is set.
  vulnerabilities: # no sample

  # Damage resistances, comma-separated. The line prints when it is set.
  resistances: # no sample

  # Damage immunities, comma-separated. The line prints when it is set.
  immunities: fire

  # Condition immunities, comma-separated — `charmed, frightened`. The line prints when it is set.
  condition-immunities: # no sample

  # The senses — `darkvision 60 ft., passive Perception 13`.
  senses: darkvision 60 ft., passive Perception 13

  # The languages, or `—` for a creature that has none.
  languages: —

  # The challenge rating — a number, a fraction (`1/8`, `1/2`) — with the experience points from `xp` in parentheses after it.
  cr: '1'

  # The experience points for the creature, printed after the challenge rating — `1 (200 XP)`.
  xp: 200

  # The proficiency bonus, on the challenge line — `+2`. Prints when it is set.
  proficiency-bonus: # no sample

  # The traits above the actions — a list of `name` and `desc`; the description takes markdown and wikilinks.
  traits:
    - name: Keen Smell
      desc: The hound has advantage on Wisdom (Perception) checks that rely on smell.

  # The actions, under their head — a list of `name` and `desc`; `*Melee Weapon Attack:*` and the like as markdown.
  actions:
    - name: Bite
      desc: '*Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d4 + 2) piercing damage plus 3 (1d6) fire damage.'

  # The bonus actions, under their own head — the same shape as `actions`.
  bonus-actions: # no sample

  # The reactions, under their own head — the same shape as `actions`; each states its trigger in the description.
  reactions: # no sample

  # The legendary actions — the same shape as `actions`; the preamble is a first entry with only a `desc`, a cost belongs in the name — `Wing Attack (Costs 2 Actions)`.
  legendary-actions: # no sample

  # The lair actions — the same shape as `legendary-actions`, the preamble first.
  lair-actions: # no sample

  # The regional effects — the same shape as `legendary-actions`, the preamble first.
  regional-effects: # no sample
```
