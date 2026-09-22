# Nebelweberei

A Fertigkeit whose prose runs past one face: the stat box is two short rows
and the text below it is longer than the card holds at the type floor, so the
card paginates onto further fronts. The one fixture that exercises the split
on a card built around `cs-fill-*` spacers — the stat box parks a third of
the way down, and what is left pools at the foot. Invented for this deck.

```cardsmith
card:
  system: dragonbane
  card-type: rule
data:
  name: Nebelweberei
  Kategorie: Fertigkeit
  Art: Magieschule
  Attribut: INT
  Voraussetzung: "Beruf [[Nebelweber]] oder [[Magiebegabung]]"
  Beschreibung: "Nebelweber lesen das Wetter wie andere Leute eine Landkarte und ziehen ihre Kraft aus der Feuchte, die über Mooren und Flussläufen steht. Sie lernen ihr Handwerk am Ufer, nicht in einer Bibliothek, und geben es weiter, indem sie es vormachen: ein Schüler steht so lange im Schilf, bis er den Unterschied zwischen ziehendem und stehendem Dunst am Geruch erkennt. Eisen stört sie nicht, trockene Luft dagegen sehr. Wer die Schule verlässt, verliert die Gabe nicht, wohl aber die Übung: ohne den täglichen Gang ans Wasser wird der Dunst störrisch und antwortet erst beim zweiten oder dritten Versuch."
  Effekt: "Du kannst die Zauber und Zaubertricks der Nebelweberei sowie die allgemein verfügbaren Zauber erlernen, vorbereiten und wirken. Zauber: Probe gegen Nebelweberei, 2 WP je Kraftstufe. Zaubertricks gelingen automatisch, kosten 1 WP und gelten immer als vorbereitet. Bei Spielstart erhältst du statt eines Heroischen Talents deine magische Begabung und wählst drei Zauber mit Rang 1 und drei Zaubertricks. In trockener Luft — eine Wüste, ein Hochofen, ein Tag ohne eine Wolke am Himmel — steigen die Kosten jedes Zaubers um 1 WP. Steht dir offenes Wasser bis an die Knöchel, sinken sie um 1 WP, mindestens aber auf 1. Ein Nebelweber erkennt an einer Wasserfläche, wie lange sie schon steht, und an einer Wolke, ob sie Regen trägt; beides gelingt ohne Probe und ohne Kosten. Dein Weberstab, ein Stück Treibholz aus einem stehenden Gewässer, dient als Fokus."
```
