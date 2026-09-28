| Card | Prompt                                                              |
| ---- | ------------------------------------------------------------------- |
| 1    | What did you leave behind to join the Queen's journey?              |
| 2    | Which of the Queen's orders did you follow without believing in it? |
| 3    | Who among the company do you trust the least, and why?              |

```cardsmith
card:
  system: dftq
  card-type: prompt
table:
  # The heading at the top of the front — the card's number, as written ("17", "Q2", "Instructions 2").
  heading: Card

  # The prompt — the card's text, markdown.
  description: Prompt
data:
  # Empty boxes to tick off with a pen. A number (`20`), a labelled row (`{ count: 20, label: Arrows }`) or a list of such rows. `group` (default 5) sets how many boxes stand together.
  tracker: # no sample

  # The game's or the deck's name, centred on the back. Without one the back is white.
  game-name: For the Court
```
