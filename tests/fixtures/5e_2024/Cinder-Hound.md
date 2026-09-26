# Cinder Hound

A creature with a picture on the back, and everything the card derives:
the modifiers and saving throws from the scores, the initiative from
Dexterity, the proficiency bonus from the challenge rating. Invented for
this deck.

```cardsmith
card:
  system: 5e_2024
  card-type: creature
data:
  name: Cinder Hound
  size: Medium
  type: Monstrosity
  alignment: Unaligned
  ac: 13
  hp: 22 (4d8 + 4)
  speed: 40 ft.
  str: 15
  dex: 14
  con: 13
  int: 3
  wis: 12
  cha: 6
  skills: Perception +3, Stealth +4
  immunities: Fire
  senses: Darkvision 60 ft.; Passive Perception 13
  languages: None
  cr: "1"
  xp: 200
  image: "[[Cinder-Hound.png]]"
  traits:
    - name: Keen Smell
      desc: The hound has Advantage on Wisdom (Perception) checks that rely on smell.
  actions:
    - name: Bite
      desc: "*Melee Attack Roll:* +4, reach 5 ft. *Hit:* 7 (2d4 + 2) Piercing damage plus 3 (1d6) Fire damage."
    - name: Ember Breath (Recharge 5–6)
      desc: "*Dexterity Saving Throw:* DC 11, each creature in a 15-foot Cone. *Failure:* 10 (3d6) Fire damage. *Success:* Half damage."
```
