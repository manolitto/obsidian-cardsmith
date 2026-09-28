# Night Porter

The same character in English, with a picture on the back where the
German one has the logo, and the captions from the `en` table. The deck
prints `de` and leaves it out. Invented for this deck.

```cardsmith
card:
  system: troubleshooters
  card-type: npc
  language: en
data:
  image: "[[Night-Porter.jpg]]"
  name: Night Porter
  initiative: 3
  vitality: 3
  traits: "[[Underling]]"
  attacks:
    - name: "Fist:"
      desc: 35%, 2dX, [[Non-lethal]]
  skills:
    - name: "Basic:"
      desc: 35%
    - name: "Recognising guests:"
      desc: 65%
  description: Sits behind the desk, knows who came in when, and keeps quiet for a tip.
  reference: Rulebook p. 229
```
