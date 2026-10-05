# Cinder Shield

A first-level reaction: the casting time carries its trigger, and the
spell ends on its own at the start of the caster's next turn. Invented
for this deck.

```cardsmith
card:
  system: 5e_2024
  card-type: spell
data:
  name: Cinder Shield
  level: 1
  school: Abjuration
  classes: [Sorcerer, Warlock, Wizard]
  casting-time: Reaction, which you take when you are hit by an attack roll
  range: Self
  components: V, S
  duration: 1 round
  description: |
    A swirl of glowing cinders wraps around you. Until the start of your next turn, you have a +4 bonus to AC, including against the triggering attack.

    The first creature that hits you with a melee attack in that time takes 1d6 Fire damage.
  higher-levels: The Fire damage increases by 1d6 for each spell slot level above 1.
```
