# Sprache im Block

The block's `language: en` is the note's layer of the card-settings chain
and wins over the system's German: the root carries `lang="en"` and the
captions come from the `en` table, over values the note wrote in German.

```cardsmith
card:
  system: dragonbane
  card-type: rule
  language: en
data:
  name: Seilkunst
  Attribut: GEW
  Kategorie: Fertigkeit
  Art: Grundfertigkeit
  Beschreibung: "Knoten, Takelage und alles, was an einem Seil hängt."
```
