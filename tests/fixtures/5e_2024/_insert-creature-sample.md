```cardsmith
card:
  system: 5e_2024
  card-type: creature
data:
  # The card's name. Falls back to the file name.
  name: Cinder Hound

  # The creature's picture — a wikilink to a picture in the vault — on the back under the label. Without one the back shows a d20.
  image: '[[Cinder-Hound.png]]'

  # The label on the back — above the picture or the d20 — `Bestiary`, `NPC`. Without it the card type's own.
  back-label: # no sample

  # The size — Tiny, Small, Medium, Large, Huge, Gargantuan — first in the italic line under the name.
  size: Medium

  # The creature type, with its tags in parentheses — `Humanoid (Goblinoid)`, `Beast`, `Undead`.
  type: Monstrosity

  # The alignment — `Neutral Evil`, `Unaligned` — after the type, comma-separated.
  alignment: Unaligned

  # Armor Class — `17`, or with its source for 5E (2014) — `15 (leather armor, shield)`.
  ac: 13

  # The initiative modifier — `+7`; the passive initiative follows. Without it, the Dexterity modifier.
  initiative: # no sample

  # Hit Points, the average with the dice in parentheses — `22 (4d8 + 4)`.
  hp: 22 (4d8 + 4)

  # The speeds, comma-separated — `10 ft., Swim 40 ft.`.
  speed: 40 ft.

  # Strength — the score, `15`; `15 (+2)` reads the same.
  str: 15

  # Dexterity — the score. Its modifier is the initiative where `initiative` is not set.
  dex: 14

  # Constitution — the score.
  con: 13

  # Intelligence — the score.
  int: 3

  # Wisdom — the score.
  wis: 12

  # Charisma — the score.
  cha: 6

  # The Strength saving throw — `+5`. Without it, the modifier.
  str-save: # no sample

  # The Dexterity saving throw — `+5`. Without it, the modifier.
  dex-save: # no sample

  # The Constitution saving throw — `+5`. Without it, the modifier.
  con-save: # no sample

  # The Intelligence saving throw — `+5`. Without it, the modifier.
  int-save: # no sample

  # The Wisdom saving throw — `+5`. Without it, the modifier.
  wis-save: # no sample

  # The Charisma saving throw — `+5`. Without it, the modifier.
  cha-save: # no sample

  # Skill bonuses, comma-separated — `Perception +3, Stealth +4`.
  skills: Perception +3, Stealth +4

  # Damage vulnerabilities, comma-separated.
  vulnerabilities: # no sample

  # Damage resistances, comma-separated.
  resistances: # no sample

  # Damage immunities, comma-separated — the first half of the Immunities line.
  immunities: Fire

  # Condition immunities, comma-separated — after the damage immunities, behind a semicolon.
  condition-immunities: # no sample

  # The gear carried, comma-separated — `Longsword, Shield`.
  gear: # no sample

  # The senses — `Darkvision 60 ft.; Passive Perception 13`.
  senses: Darkvision 60 ft.; Passive Perception 13

  # The languages, or `None`.
  languages: None

  # The challenge rating — `10`, `1/2`. The proficiency bonus follows from it where `proficiency-bonus` is not set.
  cr: '1'

  # The experience points, in the parentheses after the challenge rating — `5,900`, `5,900, or 7,200 in lair`.
  xp: 200

  # The proficiency bonus — `+4`. Without it, the one of the challenge rating.
  proficiency-bonus: # no sample

  # The habitat — `Forest, Grassland`. A line under the block, where it is set.
  habitat: # no sample

  # The treasure — `Individual`, `Hoard`, `None`. A line under the block, where it is set.
  treasure: # no sample

  # The traits — a list of `name` and `desc`; the description takes markdown and wikilinks.
  traits:
    - name: Keen Smell
      desc: The hound has Advantage on Wisdom (Perception) checks that rely on smell.

  # The actions — a list of `name` and `desc`; `*Melee Attack Roll:*` and the like as markdown.
  actions:
    - name: Bite
      desc: '*Melee Attack Roll:* +4, reach 5 ft. *Hit:* 7 (2d4 + 2) Piercing damage plus 3 (1d6) Fire damage.'

  # The bonus actions — the same shape as `actions`.
  bonus-actions: # no sample

  # The reactions — the same shape as `actions`; each states its trigger.
  reactions: # no sample

  # The legendary actions — the same shape as `actions`; the preamble (`Legendary Action Uses: 3`) is a first entry with only a `desc`.
  legendary-actions: # no sample

  # The lair actions of the 2014 rules — the same shape as `legendary-actions`, the preamble first.
  lair-actions: # no sample

  # The regional effects of the 2014 rules — the same shape as `legendary-actions`, the preamble first.
  regional-effects: # no sample
```
