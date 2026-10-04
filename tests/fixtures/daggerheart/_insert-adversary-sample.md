```cardsmith
card:
  system: daggerheart
  card-type: adversary
  language: en
data:
  # The card's name, shown as the title on the front. Falls back to the note's file name when unset.
  name: Dire Wolf

  # The card's text — Markdown; a feature's name in bold, as the cards print it.
  description: |-
    **Pack Tactics – Passive:** If the Wolf makes a successful standard attack and another Dire Wolf is within Melee range of the target, deal 1d6+5 physical damage instead of their standard damage and you gain a Fear.
  
    **Hobbling Strike – Action:** Mark a Stress to make an attack against a target within Melee range. On a success, deal 3d4+10 direct physical damage and make them Vulnerable until they clear at least 1 HP.

  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # The tier, 1 to 4.
  tier: 1

  # The role — Bruiser, Horde, Leader, Minion, Ranged, Skulk, Social, Solo, Standard or Support; a Horde may add its HP rule in brackets.
  role: Skulk

  # The one-line description, in italics under the head.
  blurb: A large wolf with menacing teeth, seldom encountered alone.

  # Motives and tactics — a comma-separated list of verbs.
  motives: Defend territory, harry, protect pack, surround, trail

  # The Difficulty to hit and to beat.
  difficulty: 12

  # The damage thresholds, major/severe — "5/9" — or "None".
  thresholds: 5/9

  # Hit Points.
  hp: 4

  # Stress.
  stress: 3

  # The attack modifier — +2 or -4; a plain 2 prints as +2.
  atk: 2

  # The standard attack's name — Claws, Daggers.
  attack: Claws

  # The attack's range — Melee, Very Close, Close, Far or Very Far.
  range: Melee

  # The attack's damage — "1d6+2 phy".
  damage: 1d6+2 phy

  # The experience — "Keen Senses +3"; several separated by commas.
  experience: Keen Senses +3
```
