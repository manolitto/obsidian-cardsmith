```cardsmith
card:
  system: 5e_2024
  card-type: creature
data:
  # The card's name. Falls back to the file name.
  name:

  # The creature's picture — a wikilink to a picture in the vault — on the back under the label. Without one the back shows a d20.
  image:

  # The label on the back — above the picture or the d20 — `Background`, `Feat`, `NPC`. Without it a creature's type, else the card type's own. A feature's origin or a spell's school follows it.
  back-label:

  # The size — Tiny, Small, Medium, Large, Huge, Gargantuan — first in the italic line under the name.
  size:

  # The creature type, with its tags in parentheses — `Humanoid (Goblinoid)`, `Beast`, `Undead`. Also the label on the back, unless the note sets `back-label`.
  type:

  # The alignment — `Neutral Evil`, `Unaligned` — after the type, comma-separated.
  alignment:

  # Armor Class — `17`, or with its source for 5E (2014) — `15 (leather armor, shield)`.
  ac:

  # The initiative modifier — `+7`; the passive initiative follows. Without it, the Dexterity modifier.
  initiative:

  # Hit Points, the average with the dice in parentheses — `22 (4d8 + 4)`.
  hp:

  # The speeds, comma-separated — `10 ft., Swim 40 ft.`.
  speed:

  # Strength — the score, `15`; `15 (+2)` reads the same.
  str:

  # Dexterity — the score. Its modifier is the initiative where `initiative` is not set.
  dex:

  # Constitution — the score.
  con:

  # Intelligence — the score.
  int:

  # Wisdom — the score.
  wis:

  # Charisma — the score.
  cha:

  # The Strength saving throw — `+5`. Without it, the modifier.
  str-save:

  # The Dexterity saving throw — `+5`. Without it, the modifier.
  dex-save:

  # The Constitution saving throw — `+5`. Without it, the modifier.
  con-save:

  # The Intelligence saving throw — `+5`. Without it, the modifier.
  int-save:

  # The Wisdom saving throw — `+5`. Without it, the modifier.
  wis-save:

  # The Charisma saving throw — `+5`. Without it, the modifier.
  cha-save:

  # Skill bonuses, comma-separated — `Perception +3, Stealth +4`.
  skills:

  # Damage vulnerabilities, comma-separated.
  vulnerabilities:

  # Damage resistances, comma-separated.
  resistances:

  # Damage immunities, comma-separated — the first half of the Immunities line.
  immunities:

  # Condition immunities, comma-separated — after the damage immunities, behind a semicolon.
  condition-immunities:

  # The gear carried, comma-separated — `Longsword, Shield`.
  gear:

  # The senses — `Darkvision 60 ft.; Passive Perception 13`.
  senses:

  # The languages, or `None`.
  languages:

  # The challenge rating — `10`, `1/2`. The proficiency bonus follows from it where `proficiency-bonus` is not set.
  cr:

  # The experience points, in the parentheses after the challenge rating — `5,900`, `5,900, or 7,200 in lair`.
  xp:

  # The proficiency bonus — `+4`. Without it, the one of the challenge rating.
  proficiency-bonus:

  # The habitat — `Forest, Grassland`. A line under the block, where it is set.
  habitat:

  # The treasure — `Individual`, `Hoard`, `None`. A line under the block, where it is set.
  treasure:

  # The traits — a list of `name` and `desc`; the description takes markdown and wikilinks.
  traits:

  # The actions — a list of `name` and `desc`; `*Melee Attack Roll:*` and the like as markdown.
  actions:

  # The bonus actions — the same shape as `actions`.
  bonus-actions:

  # The reactions — the same shape as `actions`; each states its trigger.
  reactions:

  # The legendary actions — the same shape as `actions`; the preamble (`Legendary Action Uses: 3`) is a first entry with only a `desc`.
  legendary-actions:

  # The lair actions of the 2014 rules — the same shape as `legendary-actions`, the preamble first.
  lair-actions:

  # The regional effects of the 2014 rules — the same shape as `legendary-actions`, the preamble first.
  regional-effects:
```
