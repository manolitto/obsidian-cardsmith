| Roll | Rumor                                                           |
| ---- | --------------------------------------------------------------- |
| 1    | Compasses don't work on the island the way they should.         |
| 2    | At night there's music from the complex — always the same song. |
| 3    | The pterosaurs avoid the eastern cliffs. Nobody knows why.      |

```cardsmith
card:
  system: dino-island
  card-type: roll-table
  language: en
table:
  # The entry's roll — the orange die at the top left.
  roll: Roll

  # The entry's text — the card's text (markdown).
  description: Rumor
data:
  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Source reference — rulebook page or wikilink, small at the foot.
  reference: House Rules p. 9

  # The table's title — in the front's banner and as the back's caption ("Rumour", "Where are you?"). In a table note, once in the frontmatter for every row.
  heading: Rumour
```
