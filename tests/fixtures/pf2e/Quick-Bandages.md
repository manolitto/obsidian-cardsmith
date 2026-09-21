# Quick Bandages

The same feat in English: every labelled line the Core Rulebook's feat
block has, then the rules text and the trailing "Special" note. The deck
prints `de` and leaves it out. Invented for this deck.

```cardsmith
card:
  system: pf2e
  card-type: feat
  language: en
data:
  name: Quick Bandages
  level: Feat 2
  action-cost: 1
  traits:
    - General
    - Skill
    - Healing
    - Manipulate
  prerequisites: trained in Medicine
  frequency: once per hour
  requirements: You are holding healer's tools, or you are wearing them and have a hand free.
  description: |
    You dress a wound without troubling over the finer points. Attempt a DC 15 Medicine check.

    **Critical Success** The target regains 2d8 Hit Points. **Success** The target regains 1d8 Hit Points. **Critical Failure** The target takes 1d4 damage.
  special: You can select this feat multiple times. Each time, choose a different proficiency rank at which the check succeeds.
  source: "Campaign Book p. 22"
```
