# Ember Lance

A spell of the second level: "Level 2 Evocation" with its classes,
concentration before the duration, the text and what a higher slot
adds. Invented for this deck.

```cardsmith
card:
  system: 5e_2024
  card-type: spell
data:
  name: Ember Lance
  level: 2
  school: Evocation
  classes: [Sorcerer, Wizard]
  casting-time: Action
  range: 60 feet
  components: V, S, M (a pinch of ash)
  duration: 1 minute
  concentration: true
  description: |
    A lance of white-hot ash strikes one creature you can see within range. Make a ranged spell attack against it. *Hit:* 3d8 Fire damage.

    Until the spell ends, the target sheds Dim Light in a 10-foot radius and can't benefit from the Invisible condition.
  higher-levels: The damage increases by 1d8 for each spell slot level above 2.
```
