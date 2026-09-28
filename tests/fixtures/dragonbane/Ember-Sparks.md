# Ember Sparks

The same spell in English: the captions from the `en` table — the Rules'
spell block, Rank to Duration — and no English original on the left
edge, because the card is the original. The deck prints `de` and leaves
it out. Invented for this deck.

```cardsmith
card:
  system: dragonbane
  card-type: rule
  language: en
data:
  back-image: "[[Drachensiegel.png]]"
  name: Ember Sparks
  category: Spell
  subcategory: Spell
  rank: "2"
  prerequisite: "[[Ember Grip]]"
  wp-cost: 2 per power level
  casting-requirement: Word, gesture
  casting-time: Action
  range: 10 meters
  duration: Instant
  front-image: "[[Glutfunken.jpg]]"
  description: "A shower of glowing sparks leaps from your fingers to a target and sets everything dry on it alight. The target takes *D8 damage*."
  effect: "For each power level beyond the first: one more target within range."
```
