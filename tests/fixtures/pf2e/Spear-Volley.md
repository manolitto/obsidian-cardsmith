# Spear Volley

The same hazard in English: the Core Rulebook's hazard block, whose
Stealth line stands without a caption, then Disable, the defences, the
effects and the reset clause. The deck prints `de` and leaves it out.
Invented for this deck.

```cardsmith
card:
  system: pf2e
  card-type: trap
  language: en
data:
  name: Spear Volley
  level: Hazard 2
  traits:
    - Mechanical
    - Trap
  description: A pressure plate in the floor triggers a volley of spears from the west wall.
  notice: Stealth DC 18 (trained)
  disarm: DC 16 Thievery (trained) to jam the pressure plate
  armor-class: 16
  saves:
    - { Fort: 9 }
    - { Ref: 5 }
  hardness: 8
  hit-points: 30 (BT 15)
  immunities: critical hits, object immunities, precision damage
  effects:
    - name: __Spear Volley__ ⬲
      desc: "**Trigger** A creature enters one of the marked squares. **Effect** Three spears shoot from the west wall; the trap makes a ranged Strike against each creature in the corridor."
    - name: __Ranged__ spear
      bonus: 11
      damage: 1d8+4 piercing
  reset: The spears are reloaded by hand; the trap is armed again after 10 minutes.
  source: "Campaign Book p. 88"
```
