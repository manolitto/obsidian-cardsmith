# Kantengriff

A skill action: the reaction glyph beside the name, the skill and the
required rank as the two-line badge, the trigger, the effect, the four
degrees of success, and a callout with a named sub-rule at the end.
Invented for this deck.

```cardsmith
card:
  system: pf2e
  card-type: action
data:
  name: Kantengriff
  english: Ledge Catch
  actions: r
  skill: Athletik
  training: ungeübt
  categories:
    - Handhaben
  trigger: Du stürzt an einem Rand in deiner Reichweite vorbei.
  requirements: Mindestens eine deiner Hände ist nicht gebunden.
  description: Im Fallen schnappst du nach dem Rand, an dem du vorbeistürzt, um den Sturz aufzuhalten. Lege einen Athletikwurf ab, meist gegen den Klettern-SG.
  critical-success: Du bekommst den Rand selbst mit vollen Händen zu fassen und ziehst dich hinauf.
  success: Mit einer freien Hand bekommst du den Rand zu fassen und hängst daran; du nimmst keinen Fallschaden.
  critical-failure: Du greifst ins Leere, stürzt weiter und landest liegend.
  callout:
    title: Sturzschaden
    body: |
      - **Bis 3 m** kein Schaden
      - **Je weitere 3 m** 1W6 Wuchtschaden
      - **Ins Wasser** die Hälfte
  source: "Kampagnenbuch S. 15"
```
