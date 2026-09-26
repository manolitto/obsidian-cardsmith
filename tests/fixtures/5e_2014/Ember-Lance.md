# Ember Lance

A spell of the second level: the italic line spelt out from the level
and the school, the four lines, concentration before the duration, the
text and what a higher slot adds. Invented for this deck.

```cardsmith
card:
  system: 5e_2014
  card-type: spell
data:
  name: Ember Lance
  level: 2
  school: evocation
  classes: [Sorcerer, Wizard]
  casting-time: 1 action
  range: 60 feet
  components: V, S, M (a pinch of ash)
  duration: 1 minute
  concentration: true
  description: |
    A lance of white-hot ash strikes one creature you can see within range. Make a ranged spell attack. On a hit, the target takes 3d8 fire damage.

    Until the spell ends, the target sheds dim light in a 10-foot radius and can't benefit from being invisible.
  higher-levels: When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.
```
