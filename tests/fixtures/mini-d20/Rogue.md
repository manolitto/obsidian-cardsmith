# Rogue

The same archetype in English: its name picks the hood through the
English pattern, the level-1 stats and the skill bonuses under the `en`
captions. Out of the German deck. Invented for this deck.

```cardsmith
card:
  system: mini-d20
  card-type: archetype
  language: en
data:
  name: Rogue
  tagline: There is always a way
  hit-points: 12
  armor-class: 10
  saving-throw: 11
  skill-bonuses:
    - { Stealth: "+4" }
    - { Sleight of Hand: "+4" }
    - { Acrobatics: "+3" }
    - { Perception: "+3" }
    - { Ranged Combat: "+2" }
    - { Melee: "+2" }
  allowed-armor: [Light]
  allowed-weapons: [Light, Medium]
  initial-abilities:
    - You start with two abilities.
  level-up-rules:
    - "+ 4 HP per level."
    - "- 1 ST per level."
    - "On each level-up through level 4 you gain 5 skill points and one more ability."
  reference: Rules p. 10
```
