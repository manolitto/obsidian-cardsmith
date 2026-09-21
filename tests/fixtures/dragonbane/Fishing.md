---
category: Fishing
book-reference: "Campaign Book p. 58"
---
# Fishing

The same table in English, one card per row: the `table:` map names the
English columns, the two list columns fold into the stat box under their
own captions. The deck prints `de` and leaves it out. Invented for this
deck, not a table of any rulebook.

| Roll | Name | Requirements | Rations | Description |
|---|---|---|---|---|
| 1 | Mist Perch | Rod or net | D6 | A fat perch with milky eyes; tastes of moss. |
| 2–3 | Silt Eel | Fish trap | D4 | Slippery, tough and surprisingly nourishing. |
| 9–10 | | Net | 2D6 | Something large tugs at the net and will not come ashore. |

```cardsmith
card:
  system: dragonbane
  card-type: roll-table
  language: en
table:
  roll: Roll
  name: Name
  stats: [Requirements, Rations]
  description: Description
data:
  note: "The catch takes one shift of time."
```
