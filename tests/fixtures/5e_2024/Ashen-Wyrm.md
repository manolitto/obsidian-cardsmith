# Ashen Wyrm

A legendary creature without a picture: the scores written with their
modifiers as 5E (2014) writes them, four saving throws set, the
initiative set, damage and condition immunities on one line, gear,
the legendary actions opened by their preamble, habitat and treasure
under the block. The block shrinks to fit. Invented for this deck.

```cardsmith
card:
  system: 5e_2024
  card-type: creature
data:
  name: Ashen Wyrm
  size: Huge
  type: Dragon
  alignment: Neutral Evil
  ac: 18
  initiative: +4
  hp: 184 (16d12 + 80)
  speed: 40 ft., Burrow 30 ft., Fly 80 ft.
  str: 25 (+7)
  dex: 10 (+0)
  con: 21 (+5)
  int: 14 (+2)
  wis: 13 (+1)
  cha: 17 (+3)
  dex-save: +5
  con-save: +10
  wis-save: +6
  cha-save: +8
  skills: Perception +11, Stealth +5
  resistances: Bludgeoning
  immunities: Fire
  condition-immunities: Exhaustion
  gear: Crown of Cinders
  senses: Blindsight 60 ft., Darkvision 120 ft.; Passive Perception 21
  languages: Common, Draconic
  cr: "14"
  xp: 11,500, or 13,000 in lair
  habitat: Mountain, Underdark
  treasure: Hoard
  traits:
    - name: Legendary Resistance (3/Day, or 4/Day in Lair)
      desc: If the wyrm fails a saving throw, it can choose to succeed instead.
    - name: Ash Cloak
      desc: While in ash or smoke, the wyrm has the Invisible condition to creatures that rely on sight.
  actions:
    - name: Multiattack
      desc: The wyrm makes three Rend attacks.
    - name: Rend
      desc: "*Melee Attack Roll:* +12, reach 10 ft. *Hit:* 18 (2d10 + 7) Slashing damage plus 5 (1d10) Fire damage."
    - name: Ash Breath (Recharge 5–6)
      desc: "*Dexterity Saving Throw:* DC 18, each creature in a 60-foot Cone. *Failure:* 49 (14d6) Fire damage, and the target has the Blinded condition until the end of its next turn. *Success:* Half damage only."
  bonus-actions:
    - name: Smoulder
      desc: The wyrm's scales flare. Until the start of its next turn, a creature that hits it with a melee attack takes 5 (1d10) Fire damage.
  legendary-actions:
    - desc: "*Legendary Action Uses:* 3 (4 in Lair). Immediately after another creature's turn, the wyrm can expend a use to take one of the following actions. The wyrm regains all expended uses at the start of each of its turns."
    - name: Tail Sweep
      desc: "*Melee Attack Roll:* +12, reach 15 ft. *Hit:* 16 (2d8 + 7) Bludgeoning damage."
    - name: Smother
      desc: "*Constitution Saving Throw:* DC 18, each creature in a 20-foot Sphere the wyrm can see within 90 feet. *Failure:* The target can't breathe until the end of its next turn."
```
