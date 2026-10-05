# Hearthward

A ritual: "or Ritual" after the casting time, a material component
with a price, and a list in the description. Invented for this deck.

```cardsmith
card:
  system: 5e_2024
  card-type: spell
data:
  name: Hearthward
  level: 1
  school: Abjuration
  classes: [Cleric, Druid, Ranger]
  casting-time: 10 minutes
  ritual: true
  range: 30 feet
  components: V, S, M (a coal from a hearth fire)
  duration: 8 hours
  description: |
    You set a ring of warding embers around a campsite, a room or a cave no larger than a 30-foot Cube. Until the spell ends:

    - The area stays comfortably warm, whatever the weather outside.
    - You know when a Tiny or larger creature enters the area.
    - Fire you light inside it can't spread beyond the ring.
```
