# Bundled systems

A system is a family of cards that share a look and a vocabulary. Twelve
ship with the plugin; each is a folder under `resources/systems/` that you
can also [copy into your vault](settings.md#copying-a-bundled-system-into-the-vault)
and make your own. What every system bundles of its game is a card design
and a vocabulary, and nothing else — the terms each one comes under are in
[NOTICE.md](../NOTICE.md).

A card's size is the card type's, else the system's, else poker
(63 × 88 mm). *Languages* are the ones the system has captions for; a
note may pick one with `language:`. Every picture is one card of the
type, front and back, rendered from a sample note exactly as the plugin
prints it — invented content, never a rulebook's — in English wherever
the system has English captions.

## simple

A minimal, game-agnostic design: title, body, a source reference, and a
back that names the game and the kind of card — both written by the note,
so one design serves any game. Every word on the card is the author's.
Card type `simple`; poker; `en`, `de`. Original to this project — the
smallest complete system, and the one to copy when starting your own.

<img src="../images/cards/simple/simple.webp" alt="simple card, front and back" width="360">

## dragonbane

Cards for *Dragonbane* in the look of the game's own card deck: a parchment
field, ornament strips and plaques, the stat box. German.

| | Card type | |
|---|---|---|
| <img src="../images/cards/dragonbane/gear.webp" alt="dragonbane gear card, front and back" width="360"> | `gear` | everything a character carries — weapons, armour, items; a drawn back of its own |
| <img src="../images/cards/dragonbane/creature.webp" alt="dragonbane creature card, front and back" width="360"> | `creature` | monsters and NPCs, with a portrait; large (88.9 × 127 mm) |
| <img src="../images/cards/dragonbane/rule.webp" alt="dragonbane rule card, front and back" width="360"> | `rule` | skills, talents, spells — a rule with a heading and a text |
| <img src="../images/cards/dragonbane/roll-table.webp" alt="dragonbane roll-table card, front and back" width="360"> | `roll-table` | one entry of a dice table, with the roll as a badge |
| <img src="../images/cards/dragonbane/generic.webp" alt="dragonbane generic card, front and back" width="360"> | `generic` | a free card: a title and Markdown |

Poker unless said otherwise; `de`. Not a Supplement under the game's
third-party licence — the system bundles no Dragonbane text — and anyone
who publishes one made with it carries that licence's obligations. The
parchment and the scroll ornaments come through the Dragonbrew template
by Sibling Dex, from public-domain and CC BY 3.0 textures; the
attribution travels with the cards.

## eiserne-zeit

Cards for *Eiserne Zeit*: a torn-edged band under a grotesque headline,
Garamond text, the publisher's logo on the back — bundled with the
publisher's permission. One card type, `generic`, for whatever the note
holds; poker; `de`, `en`.

<img src="../images/cards/eiserne-zeit/generic.webp" alt="eiserne-zeit generic card, front and back" width="360">

## pf2e

Cards for *Pathfinder Second Edition*, German: the trait row, the stat
lines and the action glyphs of the rulebook.

| | Card type | |
|---|---|---|
| <img src="../images/cards/pf2e/creature.webp" alt="pf2e creature card, front and back" width="360"> | `creature` | the monster card — the full stat block, a portrait when there is room; large |
| <img src="../images/cards/pf2e/item.webp" alt="pf2e item card, front and back" width="360"> | `item` | weapons, armour, shields, magic items, with the picture beside the stats or below the text |
| <img src="../images/cards/pf2e/feat.webp" alt="pf2e feat card, front and back" width="360"> | `feat` | a feat: name, action cost and level in the header |
| <img src="../images/cards/pf2e/action.webp" alt="pf2e action card, front and back" width="360"> | `action` | basic and skill actions, with the outcomes |
| <img src="../images/cards/pf2e/trap.webp" alt="pf2e trap card, front and back" width="360"> | `trap` | a hazard |

Poker unless said otherwise; `de`. The action glyphs and the "P" mark are
Paizo's, under the Community Use Policy.

## mini-d20

Cards for *MINI D20*: red-and-black typography, the rulebook's icons in
the header. Bundled with the creator's permission.

| | Card type | |
|---|---|---|
| <img src="../images/cards/mini-d20/archetype.webp" alt="mini-d20 archetype card, front and back" width="360"> | `archetype` | a character archetype: stats, skill bonuses, gear, abilities |
| <img src="../images/cards/mini-d20/ability.webp" alt="mini-d20 ability card, front and back" width="360"> | `ability` | an ability, with its tags and rule text |
| <img src="../images/cards/mini-d20/heritage.webp" alt="mini-d20 heritage card, front and back" width="360"> | `heritage` | a heritage: trait and a table of names |
| <img src="../images/cards/mini-d20/bestiary.webp" alt="mini-d20 bestiary card, front and back" width="360"> | `bestiary` | a creature: the six-column stat block and its abilities |
| <img src="../images/cards/mini-d20/equipment.webp" alt="mini-d20 equipment card, front and back" width="360"> | `equipment` | a piece of equipment, with a picture |
| <img src="../images/cards/mini-d20/quirk.webp" alt="mini-d20 quirk card, front and back" width="360"> | `quirk` | a quirk, rolled for — the roll as a badge |
| <img src="../images/cards/mini-d20/cover.webp" alt="mini-d20 cover card, front and back" width="360"> | `cover` | the deck's title card and its colophon |
| <img src="../images/cards/mini-d20/generic.webp" alt="mini-d20 generic card, front and back" width="360"> | `generic` | a free face with the typed cards' chrome on demand |

Poker; `de`, `en`. The icons are from game-icons.net (CC BY 3.0).

## dcc

Cards for *Dungeon Crawl Classics*: an ink-blue ornament band over paper.
Card types `occupation` (a zero-level occupation with its trained weapon
and trade goods) and `equipment`. Poker; `de`, `en`. Open Game License —
`resources/systems/dcc/OGL.txt`.

<img src="../images/cards/dcc/occupation.webp" alt="dcc occupation card, front and back" width="360"> <img src="../images/cards/dcc/equipment.webp" alt="dcc equipment card, front and back" width="360">

## dino-island

Cards for *Flucht von Dino Island*: distressed poster capitals, a yellow banner behind the heading, orange accents on white.
Card types `location` (a place, with a picture), `taxonomy` (an animal
family's fields) and `roll-table` (one entry of a table). Poker; `de`.
Bundled with the authors' permission.

<img src="../images/cards/dino-island/location.webp" alt="dino-island location card, front and back" width="360"> <img src="../images/cards/dino-island/taxonomy.webp" alt="dino-island taxonomy card, front and back" width="360"> <img src="../images/cards/dino-island/roll-table.webp" alt="dino-island roll-table card, front and back" width="360">

## tor2e

Cards for *The One Ring*, second edition: a dark red frame, Garamond, a
flourish on the back. Card types `gear` and `npc` (an adversary; large).
Poker unless said otherwise; `de`, `en`. The system bundles nothing of
Middle-earth — not a name, not a place — and the samples keep it so.

<img src="../images/cards/tor2e/gear.webp" alt="tor2e gear card, front and back" width="360"> <img src="../images/cards/tor2e/npc.webp" alt="tor2e npc card, front and back" width="360">

## sw

Cards for *Swords & Wizardry*: Garamond text under a Cinzel title. Card
types `item` (a magic item) and `monster`. Poker; `de`, `en`. Open Game
License — `resources/systems/sw/OGL.txt`.

<img src="../images/cards/sw/item.webp" alt="sw item card, front and back" width="360"> <img src="../images/cards/sw/monster.webp" alt="sw monster card, front and back" width="360">

## troubleshooters

Cards for *The Troubleshooters*: a comic-book title face and three frames —
`npc` in blue, `mechanic` in orange, `gear` borderless on white. Poker;
`de`, `en`. Fan content under the Helmgast Fan Content Policy.

<img src="../images/cards/troubleshooters/npc.webp" alt="troubleshooters npc card, front and back" width="360"> <img src="../images/cards/troubleshooters/mechanic.webp" alt="troubleshooters mechanic card, front and back" width="360"> <img src="../images/cards/troubleshooters/gear.webp" alt="troubleshooters gear card, front and back" width="360">

## 5e

Cards for fifth-edition play, on the SRD 5.1 vocabulary: a stat block with
the classic bar and a d20 on the back. Card types `monster` (the block,
then the sections a legendary creature adds) and `npc`. Large; `en`.

<img src="../images/cards/5e/monster.webp" alt="5e monster card, front and back" width="360"> <img src="../images/cards/5e/npc.webp" alt="5e npc card, front and back" width="360">

## dftq

Cards for games *Descended from the Queen*: one card type, `prompt`, for a
question card — the text in the middle of a tarot-sized face, the game's
name on the back. Tarot (70 × 120 mm); `en`, `de`.

<img src="../images/cards/dftq/prompt.webp" alt="dftq prompt card, front and back" width="360">
