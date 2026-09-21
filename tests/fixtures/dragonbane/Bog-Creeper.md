# Bog Creeper

The same creature in English: the captions from the `en` table, the
attack table headed the way the Rules head it. The deck prints `de` and
leaves it out. Invented for this deck — not a creature of any published
bestiary.

```cardsmith
card:
  system: dragonbane
  card-type: creature
  language: en
data:
  name: Bog Creeper
  category: Monster
  description: "A flat, mud-coloured body with too many eyes, noticed only once the water moves."
  artwork: "[[Moorschleicher.png]]"
  hit-points: 28
  ferocity: 2
  size: Normal
  movement: 8 m, swimming 12 m
  armor: Mud hide (D4)
  traits:
    - name: Bog camouflage
      desc: "In water or reeds, AWARENESS to notice it is rolled with a **bane**."
    - name: Tough
      desc: "The first hit each round inflicts only half damage."
  monster-attacks:
    - roll: "1–2"
      name: Tongue Lash
      desc: "Damage D10. The target is dragged towards the water and is [[Prone]]."
    - roll: "3–4"
      name: Bite
      desc: "Damage 2D6."
    - roll: "5–6"
      name: Mud Throw
      desc: "One target within 10 meters is blinded until the end of the round."
  gm-notes: "Lures prey to the shore with a soft gurgling. Retreats at once from fire."
  book-reference: "Campaign Book p. 40"
```
