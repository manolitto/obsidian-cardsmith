# Bog Lurker

The same monster in English: the captions from the `en` table. The deck
prints `de` and leaves it out. Invented for this deck.

```cardsmith
card:
  system: sw
  card-type: monster
  language: en
data:
  name: Bog Lurker
  description: A sinewy newt the colour of the peat it lurks in.
  image: "[[Moorschleicher.png]]"
  hit-dice: 3 + 1
  armor-class: 6 [13]
  attacks: Bite (1d6)
  saving-throw: 14
  specials: Camouflage, Paralysing slime
  movement: 9 (swimming 12)
  alignment: Neutral
  challenge-level: 5
  xp: 240
  abilities:
    - name: Camouflage
      desc: In the bog the lurker is noticed only on a 1 on 1d6.
    - name: Paralysing slime
      desc: Anyone bitten who fails the saving throw is paralysed for 1d4 rounds.
  reference: Complete Rules p. 172
```
