# Ledge Catch

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
  image: "[[Kantengriff.jpg]]"
  name: Ledge Catch
  actions: r
  skill: Athletics
  training: untrained
  categories:
    - Manipulate
  trigger: You fall past a ledge within your reach.
  requirements: At least one of your hands is not bound.
  description: As you fall, you snatch at the rim you are dropping past to stop the fall. Attempt an Athletics check, usually against the Climb DC.
  critical-success: You catch the ledge even with your hands full and haul yourself up onto it.
  success: With a free hand you catch the ledge and hang from it; you take no falling damage.
  critical-failure: You clutch at nothing, keep falling and land prone.
  callout:
    title: Falling Damage
    body: |
      - **Up to 10 feet** no damage
      - **Each further 10 feet** 1d6 bludgeoning damage
      - **Into water** half
  source: "Campaign Book p. 15"
```
