# Grave Burrower

The same creature in English: the Bestiary's captions, the rarity pill
matched through the English pattern, no English original in the footer.
The deck prints `de` and leaves it out. Invented for this deck.

```cardsmith
card:
  system: pf2e
  card-type: creature
  language: en
data:
  name: Grave Burrower
  level: Creature 5
  alignment: NE
  size: Large
  traits:
    - Uncommon
    - Undead
    - Mindless
  perception: 12
  senses: darkvision, lifesense 60 feet
  skills:
    - { Athletics: 14 }
    - { Stealth: 9 }
  attributes:
    - { Str: 5 }
    - { Dex: 0 }
    - { Con: 4 }
    - { Int: -5 }
    - { Wis: 2 }
    - { Cha: 0 }
  items: rusty grave goods
  armor-class: 20
  saves:
    - { Fort: 14 }
    - { Ref: 8 }
    - { Will: 11 }
  hit-points: 70
  immunities: death effects, frightened, mental, poison, unconscious
  resistances: slashing 5, piercing 5
  weaknesses: positive 5, fire 5
  speed: 20 feet, burrow 30 feet
  attacks:
    - name: __Melee__ ⬻ claw
      bonus: 15
      damage: 2d6+7 slashing plus grave grip
    - name: __Melee__ ⬻ jaws
      bonus: 13
      damage: 2d8+5 piercing
    - name: __Grave Grip__
      desc: A creature hit by the claw must succeed at a DC 21 Fortitude save or become grabbed until it escapes.
    - name: __From the Earth__ ⬺
      desc: "**Requirements** The grave burrower is burrowed. **Effect** It bursts from the ground and Strikes each adjacent creature with its claw; each creature hit is also knocked prone."
    - name: __Grave Dust__ ⬲
      desc: "**Trigger** An adjacent creature hits the grave burrower. **Effect** The attacker breathes in the dust and must succeed at a DC 21 Fortitude save or become sickened 1."
    - name: __Ferocity__ ⬲
      desc: When reduced to 0 HP, the grave burrower stays at 1 HP and becomes wounded 1.
  description: "What the gravediggers left behind has gathered itself into a body beneath the churchyard. It burrows under fresh graves and drags the mourners down."
  image: "[[Sumpfschleicher.png]]"
  source: "Campaign Book p. 44"
```
