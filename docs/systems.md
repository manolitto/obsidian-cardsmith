# Bundled systems

A system is a family of cards that share a look and a vocabulary. Fourteen
ship with the plugin; each is a folder under `resources/systems/` that you
can also [copy into your vault](settings.md#copying-a-bundled-system-into-the-vault)
and make your own. What every system bundles of its game is a card design
and a vocabulary, and nothing else — the terms each one comes under are in
[NOTICE.md](../NOTICE.md).

A card's size is the card type's, else the system's, else poker
(63 × 88 mm). *Languages* are the ones the system has captions for; a
note may pick one with `language:`. Every picture is one card of the
type, front and back, rendered from a sample note exactly as the plugin
prints it — invented content, or a reference document the game's
licence makes free to quote, never a rulebook's — in English wherever
the system has English captions.

## simple

A minimal, game-agnostic design: title, body, a source reference, and a
back that names the game and the kind of card — both written by the note,
so one design serves any game. Every word on the card is the author's.
Card type `simple`; poker; `en`, `de`. Original to this project — the
smallest complete system, and the one to copy when starting your own.

<img src="images/cards/simple/simple.webp" alt="simple card, front and back" width="360">

## dragonbane

Cards for *Dragonbane* in the look of the game's own card deck: a parchment
field, ornament strips and plaques, the stat box. German and English, each
with the captions of its rulebook.

| | Card type | |
|---|---|---|
| <img src="images/cards/dragonbane/gear.webp" alt="dragonbane gear card, front and back" width="360"> | `gear` | everything a character carries — weapons, armour, items; a drawn back of its own |
| <img src="images/cards/dragonbane/creature.webp" alt="dragonbane creature card, front and back" width="360"> | `creature` | monsters and NPCs, with a portrait; large (88.9 × 127 mm) |
| <img src="images/cards/dragonbane/rule.webp" alt="dragonbane rule card, front and back" width="360"> | `rule` | skills, talents, spells — a rule with a heading and a text |
| <img src="images/cards/dragonbane/roll-table.webp" alt="dragonbane roll-table card, front and back" width="360"> | `roll-table` | one entry of a dice table, with the roll as a badge |
| <img src="images/cards/dragonbane/generic.webp" alt="dragonbane generic card, front and back" width="360"> | `generic` | a free card: a title and Markdown |

Poker unless said otherwise; `de`, `en`. Not a Supplement under the game's
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

<img src="images/cards/eiserne-zeit/generic.webp" alt="eiserne-zeit generic card, front and back" width="360">

## pf2e

Cards for *Pathfinder Second Edition*: the trait row, the stat lines and
the action glyphs of the rulebook, with the captions of the German or the
English books.

| | Card type | |
|---|---|---|
| <img src="images/cards/pf2e/creature.webp" alt="pf2e creature card, front and back" width="360"> | `creature` | the monster card — the full stat block, a portrait when there is room; large |
| <img src="images/cards/pf2e/item.webp" alt="pf2e item card, front and back" width="360"> | `item` | weapons, armour, shields, magic items, with the picture beside the stats or below the text |
| <img src="images/cards/pf2e/feat.webp" alt="pf2e feat card, front and back" width="360"> | `feat` | a feat: name, action cost and level in the header |
| <img src="images/cards/pf2e/action.webp" alt="pf2e action card, front and back" width="360"> | `action` | basic and skill actions, with the outcomes |
| <img src="images/cards/pf2e/trap.webp" alt="pf2e trap card, front and back" width="360"> | `trap` | a hazard |

Poker unless said otherwise; `de`, `en`. The action glyphs and the "P" mark are
Paizo's, under the Community Use Policy.

## mini-d20

Cards for *MINI D20*: red-and-black typography, the rulebook's icons in
the header. Bundled with the creator's permission.

| | Card type | |
|---|---|---|
| <img src="images/cards/mini-d20/archetype.webp" alt="mini-d20 archetype card, front and back" width="360"> | `archetype` | a character archetype: stats, skill bonuses, gear, abilities |
| <img src="images/cards/mini-d20/ability.webp" alt="mini-d20 ability card, front and back" width="360"> | `ability` | an ability, with its tags and rule text |
| <img src="images/cards/mini-d20/heritage.webp" alt="mini-d20 heritage card, front and back" width="360"> | `heritage` | a heritage: trait and a table of names |
| <img src="images/cards/mini-d20/bestiary.webp" alt="mini-d20 bestiary card, front and back" width="360"> | `bestiary` | a creature: the six-column stat block and its abilities |
| <img src="images/cards/mini-d20/equipment.webp" alt="mini-d20 equipment card, front and back" width="360"> | `equipment` | a piece of equipment, with a picture |
| <img src="images/cards/mini-d20/quirk.webp" alt="mini-d20 quirk card, front and back" width="360"> | `quirk` | a quirk, rolled for — the roll as a badge |
| <img src="images/cards/mini-d20/cover.webp" alt="mini-d20 cover card, front and back" width="360"> | `cover` | the deck's title card and its colophon |
| <img src="images/cards/mini-d20/generic.webp" alt="mini-d20 generic card, front and back" width="360"> | `generic` | a free face with the typed cards' chrome on demand |

Poker; `de`, `en`. The icons are from game-icons.net (CC BY 3.0).

## dcc

Cards for *Dungeon Crawl Classics*: an ink-blue ornament band over paper.
Card types `occupation` (a zero-level occupation with its trained weapon
and trade goods) and `equipment`. Poker; `de`, `en`. Open Game License —
`resources/systems/dcc/OGL.txt`.

<img src="images/cards/dcc/occupation.webp" alt="dcc occupation card, front and back" width="360"> <img src="images/cards/dcc/equipment.webp" alt="dcc equipment card, front and back" width="360">

## dino-island

Cards for *Escape from Dino Island*, in the look of its German edition
*Flucht von Dino Island*: distressed poster capitals, a yellow banner
behind the heading, orange accents on white. Card types `location` (a
place, with a picture), `taxonomy` (an animal family's fields) and
`roll-table` (one entry of a table). Poker; `de`, `en`. Bundled with the
authors' permission.

<img src="images/cards/dino-island/location.webp" alt="dino-island location card, front and back" width="360"> <img src="images/cards/dino-island/taxonomy.webp" alt="dino-island taxonomy card, front and back" width="360"> <img src="images/cards/dino-island/roll-table.webp" alt="dino-island roll-table card, front and back" width="360">

## tor2e

Cards for *The One Ring*, second edition: a dark red frame, Garamond, a
flourish on the back. Card types `gear` and `npc` (an adversary; large).
Poker unless said otherwise; `de`, `en`. The system bundles nothing of
Middle-earth — not a name, not a place — and the samples keep it so.

<img src="images/cards/tor2e/gear.webp" alt="tor2e gear card, front and back" width="360"> <img src="images/cards/tor2e/npc.webp" alt="tor2e npc card, front and back" width="360">

## sw

Cards for *Swords & Wizardry*: Garamond text under a Cinzel title. Card
types `item` (a magic item) and `monster`. Poker; `de`, `en`. Open Game
License — `resources/systems/sw/OGL.txt`.

<img src="images/cards/sw/item.webp" alt="sw item card, front and back" width="360"> <img src="images/cards/sw/monster.webp" alt="sw monster card, front and back" width="360">

## troubleshooters

Cards for *The Troubleshooters*: a comic-book title face and three frames —
`npc` in blue, `mechanic` in orange, `gear` borderless on white. Poker;
`de`, `en`. Fan content under the Helmgast Fan Content Policy.

<img src="images/cards/troubleshooters/npc.webp" alt="troubleshooters npc card, front and back" width="360"> <img src="images/cards/troubleshooters/mechanic.webp" alt="troubleshooters mechanic card, front and back" width="360"> <img src="images/cards/troubleshooters/gear.webp" alt="troubleshooters gear card, front and back" width="360">

## 5e_2014

Cards for fifth-edition play under the 2014 rules, on the SRD 5.1
vocabulary: the stat block with the classic orange bars, parchment and
tapered red rules, a d20 on the back.

| | Card type | |
|---|---|---|
| <img src="images/cards/5e_2014/creature.webp" alt="5e_2014 creature card, front and back" width="360"> | `creature` | monsters and non-player characters alike, the sections a legendary creature adds where they are set; large (88.9 × 127 mm) |
| <img src="images/cards/5e_2014/spell.webp" alt="5e_2014 spell card, front and back" width="360"> | `spell` | "2nd-level evocation (ritual)", the four lines, the text, *At Higher Levels* |
| <img src="images/cards/5e_2014/item.webp" alt="5e_2014 item card, front and back" width="360"> | `item` | equipment and magic items: category, rarity and attunement, a weapon's or an armour's statistics, the text |
| <img src="images/cards/5e_2014/generic.webp" alt="5e_2014 generic card, front and back" width="360"> | `generic` | a free card: a name, an italic line under it, Markdown — a class feature, a trait, a feat |

Poker unless said otherwise; `en`, `de`, the German captions those of
the German Player's Handbook (*Spielerhandbuch*) of these rules — "Hervorrufung
des 3. Grades", *Auf höheren Graden*, "Herausforderung 1 (200 EP)".
The back reads the kind of card above the picture and its name below.
The kind is the note's `back-label` (`Background`, `Feat`), else a
creature's type or an item's category (*Wondrous item*), else the card
type's — *Spell*, *Item*, *Feature* —
then a slash and where the card comes from: a feature's `origin`
(*Feature / Rogue*), a spell's school (*Spell /
Evocation*). The same holds for 5e_2024.

## 5e_2024

Cards for fifth-edition play under the 2024 rules, on the SRD 5.2.1
vocabulary: the stat block as those books print it — AC and Initiative
on one line, the abilities in a table of two halves with MOD and SAVE,
CR with XP and PB — on cream paper, each card type in a colour of its
own. English and German, the German captions those of the German SRD.

| | Card type | |
|---|---|---|
| <img src="images/cards/5e_2024/creature.webp" alt="5e_2024 creature card, front and back" width="360"> | `creature` | monsters and non-player characters, wine red; large (88.9 × 127 mm) |
| <img src="images/cards/5e_2024/spell.webp" alt="5e_2024 spell card, front and back" width="360"> | `spell` | "Level 2 Evocation (Sorcerer, Wizard)" — "Hervorrufungszauber 2. Grades" — the four lines, the text, the higher slot and the cantrip upgrade; indigo |
| <img src="images/cards/5e_2024/item.webp" alt="5e_2024 item card, front and back" width="360"> | `item` | category, rarity and attunement, a weapon's damage, properties and mastery or an armour's statistics, the text; forest green |
| <img src="images/cards/5e_2024/generic.webp" alt="5e_2024 generic card, front and back" width="360"> | `generic` | a free card: a name, an italic line under it, Markdown — a class feature, a trait, a feat; slate |

Poker unless said otherwise; `en`, `de`. What the note leaves out and the
rules derive, the card derives: a score's modifier (`15` and `15 (+2)`
read alike), a saving throw from the modifier, the initiative from
Dexterity, the proficiency bonus from the challenge rating. A value the
note sets prints as it is.

### Switching editions

The two fifth-edition systems share one vocabulary: the same card types,
the same properties, the same aliases, the same value formats. A card
moves to the other edition by changing `system:` and nothing else. What
one edition does not print — the initiative, the habitat, the treasure,
the gear, the class lists and the weapon mastery under the 2014 rules —
it leaves unprinted and keeps; the wording inside the actions and the
spell text stays the author's. The ids take an underscore because YAML
reads `5e-2014` as a number.

## dftq

Cards for games *Descended from the Queen*: one card type, `prompt`, for a
question card — the text in the middle of a tarot-sized face, the game's
name on the back. Tarot (70 × 120 mm); `en`, `de`.

<img src="images/cards/dftq/prompt.webp" alt="dftq prompt card, front and back" width="360">

## daggerheart

Daggerheart™ compatible cards, on the Daggerheart System Reference
Document 1.0 under the Darrington Press Community Gaming License. The
character cards share one front: a pennant at the top left in the
card's colour, a badge at the right, the picture across the top — or,
without one, a narrow tinted strip — the kind of card on a ribbon, the
title, the text, and at the foot the compatibility line the licence
asks every card to carry. The back is the card's colour with its word
in the middle: a domain card's domain, else the card type. The design
is this project's own; no artwork, glyph or typography of the
publisher's is used. The sample cards quote the SRD, which the licence
makes free to reproduce; the German ones are translated from it.

| | Card type | |
|---|---|---|
| <img src="images/cards/daggerheart/domain.webp" alt="daggerheart domain card, front and back" width="360"> | `domain` | a spell, an ability or a grimoire: the level and the domain in the pennant, the recall cost in the badge, the kind on the ribbon; a colour per domain |
| <img src="images/cards/daggerheart/ancestry.webp" alt="daggerheart ancestry card, front and back" width="360"> | `ancestry` | the name, an italic line on the people, the ancestry features |
| <img src="images/cards/daggerheart/community.webp" alt="daggerheart community card, front and back" width="360"> | `community` | the name, an italic line on where one grew up, the community feature |
| <img src="images/cards/daggerheart/subclass.webp" alt="daggerheart subclass card, front and back" width="360"> | `subclass` | the class on the ribbon, the subclass as the title, foundation, specialization or mastery under it, the spellcast trait |
| <img src="images/cards/daggerheart/adversary.webp" alt="daggerheart adversary card, front and back" width="360"> | `adversary` | the stat block for the GM: tier and role, the description, motives and tactics, Difficulty, thresholds, HP and Stress in a box, the standard attack, the experience, the features; a long block spills onto the back first |

Poker; `en`, `de`, the German captions the terms of the official German
edition — *Zauber*, *Fähigkeit*, *Zauberbuch*, *Rückruf*, *Basis*,
*Zauber-Attribut*, the domains *Arkana* … *Mut*. A note may write a
domain, a kind of card, a class, a subclass stage or a trait in English
or in German; the card prints it in its own language. A long character
card spills onto further cards, never onto the back; an adversary uses
its back first, and from its second face on shows the name and the
features only. The German role names and "Motive & Taktiken" on the
adversary are provisional.
