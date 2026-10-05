# Wildfire Storm

A third-level spell too long for one card: the note asks for extra
cards, and the description runs onto a second one. Invented for this
deck.

```cardsmith
card:
  system: 5e_2024
  card-type: spell
  overflow-mode: extra-cards
data:
  name: Wildfire Storm
  level: 3
  school: Evocation
  classes: [Druid, Sorcerer]
  casting-time: Action
  range: 120 feet
  components: V, S, M (a burnt oak leaf)
  duration: 1 minute
  concentration: true
  description: |
    A roaring storm of embers fills a 20-foot-radius, 40-foot-high Cylinder centred on a point you can see within range. Each creature in the Cylinder when it appears makes a Dexterity saving throw. On a failed save, a creature takes 4d6 Fire damage and has the Burning condition until the start of your next turn. On a successful save, it takes half as much damage.

    Until the spell ends, the Cylinder is Lightly Obscured, and its area is Difficult Terrain for creatures other than you.

    **Spreading Flames.** At the end of each of your turns, you can move the Cylinder up to 30 feet in a direction of your choice. Each creature the Cylinder moves into for the first time on a turn makes the saving throw against it.

    **Fanning the Fire.** As a Bonus Action, you can choose one creature in the Cylinder. It makes a Constitution saving throw, taking 2d6 Fire damage on a failed save.

    **Smoke and Heat.** A creature that starts its turn within 10 feet of the Cylinder, but outside it, has Disadvantage on Constitution saving throws to maintain Concentration. Nonmagical flames within 30 feet of the Cylinder grow to twice their size and can't be put out by mundane means until the spell ends.

    **Feeding the Storm.** When a creature in the Cylinder casts a spell that deals Fire damage, you can take a Reaction to absorb some of its heat. The Cylinder's radius grows by 5 feet, to a maximum of 40 feet, and its damage increases by 1d6 until the start of your next turn.

    **Calling the Storm Down.** As a Magic action, you can end the spell early and let the storm break. Each creature in the Cylinder makes a Dexterity saving throw, taking 6d6 Fire damage on a failed save or half as much damage on a successful one, and every object in it that isn't being worn or carried catches fire.

    **Sheltering.** A creature that has Total Cover from the point the storm is centred on, such as one behind a stone wall or underwater, takes no damage from it and doesn't make its saving throws.

    **Embers on the Wind.** Whenever a creature fails a saving throw against the storm by 5 or more, a burning ember lodges in its clothing or fur. At the start of each of its turns, it takes 1d4 Fire damage until it or a creature within 5 feet of it takes an action to brush the ember off.

    **Rain.** Heavy rain or a body of water the Cylinder moves over halves its damage, and steam rising from it makes the area within 10 feet of the Cylinder Lightly Obscured as well.

    **Ashfall.** When the spell ends, the Cylinder collapses into drifting ash. For 1 hour, the ground it covered is scorched black:

    - Plants there are burnt away and don't grow back until the next spring.
    - Flammable objects there that aren't being worn or carried are destroyed.
    - Creatures there have Advantage on Wisdom (Survival) checks to follow tracks.
  higher-levels: The damage of the saving throw increases by 1d6 for each spell slot level above 3.
```
