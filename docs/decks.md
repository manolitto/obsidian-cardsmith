# Decks

A deck is a set of card notes — a folder of them, or notes named one by
one — and a note that carries a `cardsmith-deck` block. The block says which notes are in, how they are
ordered and how they go onto paper; the plugin lays the cards out, puts
them on pages and writes a PDF or an HTML file.

````yaml from=tests/fixtures/simple/_deck.md
```cardsmith-deck
system: simple
```
````

That is a complete deck: every card note of the `simple` system in the
deck note's own folder, on A4 in whichever orientation holds more cards.
Everything else has a default. *Insert deck block at cursor* in the
command palette writes a block with every key as a comment, each with its
explanation.

## Which notes

| Key | Meaning |
|---|---|
| `system` | Required. Notes of another system are left out. |
| `card-type` | One id or a list. Only notes of these card types; the list is also the print order of the groups. Default: every card type. |
| `folder` | The folder whose card notes are the deck — one, or a list: `folder: [Karten/Waffen, Karten/Rüstung]` collects both, and a note under two of them is in the deck once. Default: the deck note's own, unless `notes` names the notes; `""` is the vault root. |
| `notes` | Card notes named one by one — one, or a list. Beside `folder`, they join its notes; without it, they are the deck. |
| `folder-recursive` | `true` includes the subfolders of every folder named. |
| `include-tags-all`, `include-tags-any`, `exclude-tags-any`, `exclude-tags-all` | Tag filters on the notes' tags, written as Obsidian shows them (`#Waffe` or `Waffe`, either). |
| `card-languages` | Only the cards that print in one of these languages. |

A note is in the deck when its block's `system` is the deck's, its card
type is listed (or none is), the tag filters agree and its language is
listed (or none is).

### Naming the notes

A deck that is a handful of cards from several folders names them:

```cardsmith-deck
system: dragonbane
notes:
  - Wolf
  - Karten/Waffen/Langschwert
  - [[Heiltrank]]
```

An entry is a note's name, its path (with or without `.md`) or a
wikilink, quoted or not, and it finds the note the way a link written in
the deck note would — a bare name wherever the note sits. A `|alias` or `#heading` in a
link is ignored: a deck takes whole notes. A note named twice — in any
spelling — is printed twice, and its `copies` apply to each: named twice
with `copies: 3` is six cards. A note that is named and also in a `folder`
counts as named, not once more. The order of the list is not the print
order; the cards sort as every deck's do.

A named note passes the same filters as any other. Where a folder's note
that fails them simply stays out, a named one is reported, with the
reason — another system, a card type not listed, a tag, a language — and
so is an entry that finds no note. The reports are listed under the
deck block's summary.

Obsidian does not read links inside a code block, so a note named here
does not show the deck as a backlink, and renaming the note does not
update the entry: the deck reports it as not found until the entry is
changed.

## Order, and copies

Cards print grouped by card type — in the order of the block's
`card-type:` list, else the system's order. Within a group, cards with a
roll range come first, ascending; then by name, numerically aware, so
`Wolf 2` precedes `Wolf 10`.

A card prints once unless its own `copies` says otherwise — times how
often `notes` names it — and the deck can override the `copies` by name:

```yaml
card-copies:
  - { name: Wolf, copies: 3 }
```

A card that spilled onto three faces printed twice is six physical cards,
consecutively.

## The paper

| Key | Meaning |
|---|---|
| `paper-size` | A sheet (`A3`, `A4`, `A5`, `Letter`, `Legal`), a card size (`poker`, `tarot`, … — one card per page) or `210 x 297 mm`. A preset alone lets the deck pick the orientation that holds more cards; `A4 portrait` fixes it. |
| `page-margin` | Blank space around the card grid, in millimetres. The margin yields where the paper is too small for it — the card never does. |
| `cut-marks` | `{enabled: true, length: 3, margin: 0, color: '#aaaaaa', weight: 0.25}` — a cross at every card corner, its arms along the cuts and `margin` mm clear of the corner, printed over the cards. An arm on a card is `length` mm long; an arm that leaves the block of cards runs on to the paper's edge, so a guillotine can be set against it. The fields merge, so one can change alone. A page that holds a single card gets none. |
| `duplex-flip` | Which edge is the binding when printing duplex, `long-edge` or `short-edge`, so a back lands behind its front. |
| `fold` | `off` (default), `strip`, `cover` or `booklet`: a note's cards printed side by side, uncut, and folded instead of cut apart — see *Folded cards*. |
| `fold-gap` | Millimetres between the cards of a folding deck, so that a folded card can be laminated with a hinge — see *Laminating a folded card*. Default `0`, a crease. |
| `paper-background` | `textured` prints the system's background pictures, `plain` leaves them out. Default: the plugin setting. |

The cards are packed without gaps on one grid and centred inside the
margin, every card at its own size whatever the paper. A paper the size of
the card — `paper-size: poker` for a poker deck — prints one borderless
card per page, without cut marks: a PDF for a screen.

## The cards' settings

Every card setting a note may write, a deck block may write too:
`card-size`, `overflow-mode`, `side`, `language`, `copies` and the rest
(see [Cards](cards.md)). A deck's value beats the card type's; a note's
own value beats the deck's — with one exception. **A deck is one grid,
so it is one card size:** a deck block that names `card-size` prints
every card at it and reports each note it overrode. A deck of two sizes
without the key refuses to export, naming both.

`side: front` on the deck prints fronts only, and the deck has no back
pages then.

## Pages

Pages come in print order: a sheet's front, then its back — when any card
in the deck has one. On the back page every card sits where its front
lands after the flip, so a duplex print aligns from the first sheet to the
last. A deck without backs prints no blank sheets. A folding deck places
folds side by side in a row, and the same holds for each of their panels.

## Folded cards

A note whose text runs onto several cards can print them as one strip of
paper instead, folded rather than cut apart: `fold: strip`, `cover` or
`booklet`. The faces are numbered in reading order: the first card's
front is 1, its back 2, the second card's front 3, and on. Each row below
is one side of the paper as you look at it, the back after turning it
over like a page.

```
              fold: strip              fold: cover              fold: booklet

2 cards       front  1 2               front  4 1               the same as cover
              back   3 4               back   2 3

3 cards       front  1 2 3             front  5 6 1             sheet 1  front 8 1
              back   4 5 6             back   2 3 4                      back  2 7
                                                                sheet 2  front 6 3
4 cards       front  1 2 3 4           front  6 7 8 1                    back  4 5
              back   5 6 7 8           back   2 3 4 5           (pages 7, 8 blank)
```

- **`strip`** — page 1 on the left, its fold on the right. Unfolded, the
  card is a strip with a front and a back: read across the front, turn
  it over, read on across the back.
- **`cover`** — page 1 on the right, its fold on the left, like a book's
  spine. Fold the panels inwards and page 1 is the cover, with the last
  page behind it; open it and the rest reads in order. Two cards make a
  greeting card.
- **`booklet`** works like a printer's booklet setting: sheets of two
  cards, laid inside one another and folded down the middle, so the pages
  read like a little book. The pages are padded with blank ones to a
  multiple of four — three cards are six faces, so pages 7 and 8 are
  blank.

`strip` and `cover` fold a note as far as one row of the grid
reaches — two poker cards on A4 make a card that opens, three a leaflet
— and go on in a further piece when the note has more cards than a row
holds. A note on one card prints as a card under every fold, and copies
of a note are separate folds.

Folds go into the rows in deck order, beside single cards. A fold that
does not fit what is left of a row starts the next one; the gap stays
empty, so the print order is the deck's order. A folding deck needs at
least two cards across; when `paper-size` leaves the orientation free, it
picks the one that holds more cards in pairs — poker cards on A4 go
landscape, four across, rather than three across with every third place
left over.

The cut marks go round each piece of paper — a fold's panels together —
and never along a crease. Each end of a crease gets a dashed fold mark
instead, on, off, coloured and weighted with the cut marks.

A folded card is two or more layers of paper, back to back, so the front
and back of a duplex print have to meet more exactly than for a card
that is cut out: print a test sheet first.

### Laminating a folded card

Laminated along a crease, paper and film fold stiffly and the card springs
open. A **hinge** folds instead: with `fold-gap: 3`, the cards stand 3 mm
apart and the gap between two panels of one fold is printed as a grey
strip.

1. Cut the grey strips out with a craft knife, along the cut marks either
   side. Cut nothing else — the sheet stays in one piece.
2. Laminate the whole sheet. Where a strip was, the film seals to itself.
3. Cut the cards out. Each fold now bends along its film hinge, lies flat
   when closed and stays closed.

3 mm suits most cards; give a panel that folds inside another — the inner
panel of a three-card `cover` — 4 mm. Thin film (80 µm) folds more easily
than thick. The gap stands between every two cards across, not only
inside a fold, so a row may hold one card fewer: three poker cards no
longer fit across A4 portrait inside a 10 mm margin. The grey strips are
printed even with the cut marks off, and only on the front of the sheet.

## The block in reading view

The deck block shows a summary — system, card types, folders and named
notes, how many notes it found and of which types, paper, card size —
with whatever the block gets wrong listed beneath it, in the words of the
report: a key it does not know, a named note it could not find or had to
leave out. Then three buttons:

- **Preview** builds the deck — the button counts the cards as they
  render and lay out — and opens it in a pane of its own, the pages
  scaled to the pane's width, with *Rebuild* in the toolbar.
- **Export PDF** builds the deck and prints it: fronts and backs on
  alternating pages, the paper the block says. The file lands beside the
  deck note under its name (or at `output-path`) and opens in a new pane.
  Desktop only.
- **Export HTML** writes the same pages as one self-contained file,
  fonts and pictures included, and opens it in whatever the system opens
  HTML with — the browser, with its print dialog, on the desktop and on a
  phone alike. Obsidian itself shows no HTML; its file explorer lists the
  file only with *Detect all file extensions* switched on under *Files
  and links*.

The same three are commands in the palette, for the deck note that is
open: *Preview deck*, *Export deck as PDF*, *Export deck as HTML*.

Whatever the build had to report — a note it overrode, a card cut at the
type floor, a picture it did not find — is counted in a notice and listed
in the developer console.

## Printing

**Print at 100 % — never *Fit to page* or *Scale to fit*.** Most print
dialogs default to shrinking the page a few per cent so that nothing
lands in the strip an inkjet cannot reach; on macOS and Windows alike
the option is often on without saying so. A shrunk page keeps its shape,
so it looks right — but a poker card comes out 61 × 85 mm instead of
63.5 × 88.9 mm, no longer fits its sleeve, and the fronts and backs of a
duplex print drift apart from sheet to sheet. Set the scale to *100 %*
(or *Actual size*), and let `page-margin` handle the unprintable strip:
the deck already keeps its cards clear of the paper's edge.

Duplex is the printer's job, not the deck's: choose double-sided in the
dialog, with the flip on the edge `duplex-flip` names — `long-edge` for
a portrait sheet bound like a book, `short-edge` for one bound like a
notepad. If a back lands beside its front instead of behind it, the two
disagree; change either.

Check the first sheet against a ruler before printing the rest.
