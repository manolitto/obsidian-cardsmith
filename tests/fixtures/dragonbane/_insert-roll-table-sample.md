| Roll | Roll min | Roll max | Name        | Requirements       | Rations | Description                                  |
| ---- | -------- | -------- | ----------- | ------------------ | ------- | -------------------------------------------- |
| 1    | 1        | 1        | Mist perch  | Fishing rod or net | d6      | A fat perch with milky eyes; tastes of moss. |
| 2–3  | 2        | 3        | Mud eel     | Fish trap          | d4      | Slippery, tough and surprisingly filling.    |
| 4–6  | 4        | 6        | River trout | Fishing rod        | d8      | Silver and quick; bites only at dusk.        |

```cardsmith
card:
  system: dragonbane
  card-type: roll-table
  language: en
table:
  # Die-roll result (range or single value) under which this card appears in the source table. Display form — e.g. "01", "23–24", "98–100". For numeric queries and sorting see `roll-min` and `roll-max`.
  roll: Roll

  # Lower bound of the roll range as an integer. For single-value rolls, `roll-min == roll-max`.
  roll-min: Roll min

  # Upper bound of the roll range as an integer.
  roll-max: Roll max

  # Title of the table row (e.g. "Oar snapped", "Mist perch"). When absent, `category` takes its place — for tables whose rows carry no names.
  name: Name

  # Free label/value pairs for table-specific values — "Rations: 2d6", "Requirements: weapon or trap", "Healing time: d6 days of rest".
  stats:
    - Requirements
    - Rations

  # The narrative half of the table entry — what happens.
  description: Description
data:
  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # Card-back image as a wikilink. Without it the back shows what the card type provides (a creature's portrait), else the deck's emblem. `front-image` does not feed this — it is front-only.
  back-image: '[[Medaillon.png]]'

  # Card family — the large green title at the top of the back. Without it the card type's own label appears there ("Ausrüstung", "Waffe"). For roll tables put the table's name here ("Demon Roll in Melee", "Fear", "Hunting"); it then doubles as the title fallback when the table row has no name of its own. In a table note, set once in the frontmatter for all rows.
  category: Fishing

  # Finer grouping within the card family — rendered as the small parchment plaque under the back's illustration (e.g. "Clothing", "Tool", "Trade good"). Without it the plaque is omitted; if the value equals `category` it is suppressed as well.
  subcategory: Wilderness

  # Source reference — book title with page number, or a wikilink into the vault. Set upright along the card's right edge; falls back to "DRAGONBANE".
  book-reference: House Rules p. 15

  # English original name, set small and upright along the card's left edge — the counterpart to the source reference on the right. Omitted when unset.
  english-original: Fishing

  # Name of the table this row belongs to — rendered as the small parchment tag on the title plaque, and as the title when the row carries no name of its own. Reads the same value as `category`.
  table-name: Fishing

  # Picture as a wikilink. Rendered on the card front.
  front-image: '[[Nebelbarsch.png]]'

  # Mechanical effect — what the card does when it triggers.
  effect: One ration feeds one person for a day.

  # Free-form note rendered unobtrusively on the card.
  note: 'Optional: roll only in mist.'
```
