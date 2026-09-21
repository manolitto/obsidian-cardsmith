# Grab an Edge

The same skill action in English: the reaction glyph, the skill and
rank badge, the Core Rulebook's Trigger and Requirements lines and its
four degrees of success. The deck prints `de` and leaves it out.
Invented for this deck.

```cardsmith
card:
  system: pf2e
  card-type: action
  language: en
data:
  name: Grab an Edge
  actions: r
  skill: Athletics
  training: untrained
  categories:
    - Manipulate
  trigger: You fall from or past an edge or handhold.
  requirements: Your hands are not tied.
  description: When you fall off an edge, you can try to grab it and stop the fall. You must succeed at a Reflex save, usually at the Climb DC.
  critical-success: You grab the edge whether or not you have a hand free, and treat the fall as 30 feet shorter.
  success: With at least one hand free you grab the edge and treat the fall as 20 feet shorter.
  critical-failure: You continue to fall and take an additional 10 bludgeoning damage for every 20 feet already fallen.
  callout:
    title: Falling Damage
    body: |
      - **Up to 10 feet** no damage
      - **Each further 10 feet** 1d6 bludgeoning damage
      - **Into water** half
  source: "Campaign Book p. 15"
```
