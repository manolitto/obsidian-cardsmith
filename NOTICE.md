# Third-party notices

Cardsmith's own code, templates and stylesheets are licensed under the
[MIT License](LICENSE). This file documents the **bundled third-party
material** that carries terms of its own: the fonts, the icons, the
decorative art, and the games whose cards the bundled systems are drawn
for.

> **Cardsmith is an unofficial, fan-made tool.** It is not published,
> endorsed, sponsored by or affiliated with any of the publishers named
> below. All trademarks and copyrights are the property of their respective
> owners. A bundled system is a card *design* — layouts, field names, a
> vocabulary — and no system bundles a rulebook's text, artwork or logo
> unless its row below says so and names the permission. What a printed
> card shows comes from the note it is printed from; whoever prints and
> shares cards decides what those notes carry.

## Fonts

Every bundled font is redistributable under an open licence, and the
licence text travels beside the font files in its system's `fonts/`
folder. The files are WOFF2 — the plugin embeds every font in `main.js` —
and most are the `latin` / `latin-ext` subsets as Google Fonts serves them.
No glyph, metric or name-table data was altered.

| Font | Systems | Licence | Licence file |
|---|---|---|---|
| Alegreya, Alegreya SC (bold) | 5e_2024 | SIL OFL 1.1 | `5e_2024/fonts/alegreya-OFL.txt` — one licence text, the same for both families; the `latin` subsets only |
| Alegreya Sans | dragonbane, 5e_2014 | SIL OFL 1.1 | `*/fonts/alegreya-sans-OFL.txt` |
| Alegreya Sans SC | 5e_2014 | SIL OFL 1.1 | `5e_2014/fonts/alegreya-sans-sc-OFL.txt` |
| Archivo Black | eiserne-zeit | SIL OFL 1.1 | `eiserne-zeit/fonts/archivo-black-OFL.txt` |
| Bangers | troubleshooters | SIL OFL 1.1 | `troubleshooters/fonts/bangers-OFL.txt` |
| Barlow Condensed | pf2e | SIL OFL 1.1 | `pf2e/fonts/barlow-OFL.txt` |
| Cinzel | dcc, pf2e, sw | SIL OFL 1.1 | `*/fonts/cinzel-OFL.txt` |
| Colus | dragonbane | SIL OFL 1.1 | `dragonbane/fonts/colus-OFL.txt` |
| Cormorant Garamond | dftq | SIL OFL 1.1 | `dftq/fonts/cormorant-garamond-OFL.txt` |
| EB Garamond | eiserne-zeit, sw, tor2e | SIL OFL 1.1 | `*/fonts/eb-garamond-OFL.txt` |
| Grenze | 5e_2014 | SIL OFL 1.1 | `5e_2014/fonts/grenze-OFL.txt` |
| Lora | troubleshooters | SIL OFL 1.1 | `troubleshooters/fonts/lora-OFL.txt` |
| Merriweather | mini-d20 | SIL OFL 1.1 | `mini-d20/fonts/merriweather-OFL.txt` |
| Nunito Sans | dino-island | SIL OFL 1.1 | `dino-island/fonts/nunito-sans-OFL.txt` |
| Pathfinder 2e action glyphs (five symbols) | pf2e | Paizo Community Use Policy | `pf2e/fonts/pathfinder-2e-actions-LICENSE.txt` — see the Paizo notice below |
| Rubik Distressed | dino-island | SIL OFL 1.1 | `dino-island/fonts/rubik-distressed-OFL.txt` |
| Source Sans 3 | daggerheart, pf2e, simple, tor2e | SIL OFL 1.1 | `*/fonts/source-sans-3-OFL.txt` |
| TeX Gyre Bonum | 5e_2014 | GUST Font License | `5e_2014/fonts/tex-gyre-bonum-LICENSE.txt` — the whole font, recompressed into WOFF2 |
| TeX Gyre Pagella | dcc | GUST Font License | `dcc/fonts/pagella-LICENSE.txt` |
| Wellfleet | mini-d20 | SIL OFL 1.1 | `mini-d20/fonts/wellfleet-OFL.txt` |

Paths are under `resources/systems/`.

## Icons

The MINI D20 system bundles 25 icons from [game-icons.net](https://game-icons.net/),
licensed **CC BY 3.0**. `resources/systems/mini-d20/assets/icons/NOTICE.md`
names every file and its artist. CC BY 3.0 requires that attribution to
travel with the icons: anyone who publishes or shares cards rendered with
them must keep it.

## Images and decorative art

| File | System | What it is |
|---|---|---|
| `5e_2014/assets/d20-mark.svg`, `5e_2024/assets/d20-mark.svg` | 5e_2014, 5e_2024 | A twenty-sided die as a flat silhouette, drawn for this project (MIT). It resembles no publisher's mark. |
| `eiserne-zeit/assets/eiserne-zeit-logo.png`, and the torn paper edge and the cross fleury drawn as inline SVG in the system's stylesheet | eiserne-zeit | The publisher's logo and two elements of the publisher's own graphic design. **Bundled with the explicit permission of Markus Schauta (Gazer Press, Vienna).** The permission covers their use in this plugin; it does not transfer to anyone extracting them for other use. |
| `pf2e/assets/p-mark.webp` | pf2e | Paizo's Pathfinder "P" mark, from Paizo's Community Use Package, re-encoded to WebP without any change to colour, typography, design or proportions. Paizo property, used under the Community Use Policy — see the notice below. |
| `dragonbane/assets/parchment_light.webp`, `tor2e/assets/parchment_light.webp` | dragonbane, tor2e | The parchment behind the cards: *Parchment Paper Background* by Andrea Stöckel, released into the public domain on publicdomainpictures.net, in the lightened version Sibling Dex made for the Dragonbrew template (below); re-encoded to WebP and downscaled for the bundle. |
| `dragonbane/assets/scroll-n.webp`, `dragonbane/assets/banner-n.webp` | dragonbane | The stat box and the plaques: cut by Sibling Dex for the Dragonbrew template from *Old Scroll Texture II* by Esther Sanz (https://www.deviantart.com/esther-sanz/art/Old-Scroll-Texture-II-114214631), licensed **CC BY 3.0** (https://creativecommons.org/licenses/by/3.0/); re-encoded to WebP. Anyone who shares cards printed with this system keeps this attribution. |
| The gear back of `dragonbane` and the emblem on its picture-less backs; the flourish on `tor2e`'s picture-less backs | dragonbane, tor2e | Inline SVG drawn for this project (MIT), in each system's stylesheet. |
| `*/assets/samples/*` | 5e_2014, 5e_2024, dino-island, dragonbane, eiserne-zeit, mini-d20, pf2e, sw, tor2e, troubleshooters | The pictures the sample cards link — public-domain drawings, prints and paintings; see *Sample pictures* below. |
| `tests/fixtures/*/*.jpg`, `tests/fixtures/dragonbane/Drachensiegel.png`, `tests/fixtures/eiserne-zeit/hawk-hood.png` | — | The pictures of the test fixtures, which the documentation pictures show. Most are copies of the sample pictures (see *Sample pictures* below), some under the name of the fixture that links them: `Ashen-Wyrm.jpg` is `Deckblatt.jpg`, `Ash-Spark.jpg` and `Glutfunken.jpg` are `Glutgriff.jpg`, `Fishing-Spear.jpg` is `Jagdspeer.jpg`, `Drachensiegel.png` is `Medaillon.png`, `dragonbane/Moorschleicher.jpg` is the sw newt, `Wardens-Brand.jpg` is `Schattenklinge.jpg`. The others, all public domain: `Heiltrank.jpg`, the raised cup of the *Habit d'Apoticaire* engraving of `Alchemie.jpg`; `Schattenklinge.jpg`, a sword, wood engraving after Eugène Viollet-le-Duc (d. 1879), *Dictionnaire raisonné du mobilier français*, vol. 5, 1874; `hawk-hood.png`, a falconer with two hooded falcons from Hans Burgkmair's woodcuts for the *Triumph of Maximilian I*, c. 1516–19, Rijksmuseum (CC0), set in pure black and white; `Vial-of-Mist.jpg`, *Flask*, watercolour by Eugene La Foret for the Index of American Design, 1935–42, National Gallery of Art (CC0); `Buckler.jpg`, a fencer with sword and buckler from the Tower Fechtbuch (Royal Armouries MS I.33), c. 1300, photographed by the Royal Armouries; `Night-Porter.jpg`, a concierge from *Les fils de Cerbère*, Moloch (A. H. Colomb, d. 1909), Paris Musées (CC0). |
| `docs/images/**` | — | Renders of the plugin's own test fixtures — invented cards, one of every card type of every bundled system — made for the README and the documentation. What shows on them of the material above shows under the same terms: the game-icons.net icons on the MINI D20 cards, the parchment and ornaments on the Dragonbane and The One Ring cards, the Paizo mark on the Pathfinder cards, the Eiserne Zeit logo, and the public-domain pictures of the fixtures. |

The three textures above reached this project through the *Dragonbrew*
template for the Homebrewery by Sibling Dex
(https://github.com/sibling-dex/homebrewery-templates), a template made
for Dragonbane material, whose own credits name these sources and ask that
material made with it say so: this deck design was made using the
Dragonbrew template by Sibling Dex.

### Sample pictures

The pictures the sample cards link — `<system>/assets/samples/*` — are
not part of `main.js`: *Insert sample card block* downloads the ones a
sample needs and writes them into the vault. Every one is a reproduction
of a drawing, print or painting that is in the **public domain** worldwide:
its artist died more than seventy years ago, or, for an anonymous work, it
was published more than seventy years ago, and it was published before
1931. Reproductions of public-domain artwork carry no rights of their own
in the EU (Directive 2019/790, Art. 14); the three that a museum released
itself are also marked CC0 there. They reached this project through
Wikimedia Commons, the holding institution named, or the Internet Archive,
and were cropped and downscaled for the cards.

| File | System | The work | Crop |
|---|---|---|---|
| `Cinder-Hound.jpg` | 5e_2014, 5e_2024 | *Cerberus* (Dante, *Inferno*, canto 6), wood engraving after Gustave Doré (d. 1883), 1861; National Library of Poland | a crop around the heads and the body, lightened |
| `Ember-Step.jpg` | 5e_2014, 5e_2024 | *Loge! Loge! Appear!*, Arthur Rackham (d. 1939), from *The Rhinegold & the Valkyrie*, 1910 | the fire spirit, without Wotan |
| `Lantern-of-Ash.jpg` | 5e_2014, 5e_2024 | *Youth with a lantern and basket*, circle of Rembrandt, 17th century; British Museum | — |
| `Ember-Lance.jpg` | 5e_2014, 5e_2024 | *Comet of March 1843*, lithograph by Mary Morton Allport (d. 1895), c. 1843 | without the caption |
| `Panzerlaeufer.jpg` | dino-island | *Polacanthus*, Alice B. Woodward (d. 1951), from H. R. Knipe, *Evolution in the Past*, 1912; Biodiversity Heritage Library | inside the plate's frame |
| `Bootshaken.jpg` | dragonbane | A foot soldier with a hooked polearm, wood engraving after Eugène Viollet-le-Duc (d. 1879), *Dictionnaire raisonné du mobilier français*, vol. 5, 1874 | — |
| `Glutgriff.jpg` | dragonbane | *A Boy Blowing on a Firebrand*, Gerrit van Honthorst, 1621–22; Art Institute of Chicago (CC0) | — |
| `Medaillon.png` | dragonbane | The dragon biting its tail from the *Book of Lambspring*, engraving by Lucas Jennis, 1625 | cut out as a roundel with a drawn rim |
| `Nebelbarsch.jpg` | dragonbane | *Perca fluviatilis*, plate 52 of Marcus Elieser Bloch's *Oeconomische Naturgeschichte der Fische Deutschlands*, drawn by Krüger, engraved by A. F. Schmidt, 1783–85; Biodiversity Heritage Library | the plate's caption and signatures retouched away with the plate's own paper |
| `Nebelkraehe.jpg` | dragonbane | *Crow and Reeds by a Stream*, Kawanabe Kyōsai, 1887; Metropolitan Museum of Art (CC0) | without the seal and inscription |
| `Bannkreis.png` | eiserne-zeit | The woodcut from the title page of *The Tragicall History of the Life and Death of Doctor Faustus*, anonymous, 1628 | set in pure black and white |
| `Deckblatt.jpg` | mini-d20 | *In dragon's form Fafner now watches the hoard*, Arthur Rackham (d. 1939), from *Siegfried & The Twilight of the Gods*, 1911 | — |
| `Eigenart.jpg` | mini-d20 | Baron Munchausen as a bust of himself, wood engraving after Gustave Doré (d. 1883), from *Aventures du baron de Münchhausen*, 1862; National Library of Poland | the head, above the library stamp |
| `Goblin.jpg` | mini-d20 | A goblin, John Dickson Batten (d. 1932), from Joseph Jacobs, *English Fairy Tales*, 1890 | — |
| `Kurzschwert.jpg` | mini-d20 | A short sword, wood engraving after Eugène Viollet-le-Duc (d. 1879), *Dictionnaire raisonné du mobilier français*, vol. 5, 1874 | the sword without its scabbard |
| `Mehrfachschuss.jpg` | mini-d20 | *Robin Wins the Queen's Prize*, Louis Rhead (d. 1926), from *Bold Robin Hood and His Outlaw Band*, 1912; Internet Archive | the archers |
| `Schurke.jpg` | mini-d20 | *Guy of Gisbourne*, Louis Rhead (d. 1926), from *Bold Robin Hood and His Outlaw Band*, 1912; Internet Archive | without the name banner |
| `Zwerg.jpg` | mini-d20 | *Mime at the anvil*, Arthur Rackham (d. 1939), from *Siegfried & The Twilight of the Gods*, 1911 | — |
| `Alchemie.jpg` | pf2e | *Habit d'Apoticaire*, engraving published by Nicolas de Larmessin, c. 1695; Bibliothèque nationale de France | without the caption |
| `Kantengriff.jpg` | pf2e | A climber hanging below a crag, wood engraving by Edward Whymper (d. 1911), from *Scrambles amongst the Alps*, 1871 | — |
| `Nebelruestung.jpg` | pf2e | A breastplate with applied scrollwork, wood engraving after Eugène Viollet-le-Duc (d. 1879), *Dictionnaire raisonné du mobilier français*, vol. 6, 1874 | — |
| `Speerfalle.jpg` | pf2e | *Winkelried at Sempach*, Konrad Grob (d. 1904), 1878 | the hedge of spears |
| `Sumpfschleicher.jpg` | pf2e | The hydra of plate 102 of Albertus Seba's *Thesaurus*, vol. 1, hand-coloured engraving, 1734 | without the birds |
| `Mondsichelklinge.jpg` | sw | *Sir Bedivere throwing Excalibur into the lake*, Walter Crane (d. 1915), from Henry Gilbert, *King Arthur's Knights*, 1911 | the upper half |
| `Moorschleicher.jpg` | sw | *Triturus cristatus*, J. W. Palmstruch (d. 1811), from *Svensk Zoologi*, vol. 1, 1806 | — |
| `Jagdspeer.jpg` | tor2e | *Seated hunter with fur cap, spear and game bag*, pen and watercolour by Abraham van Strij I (d. 1826); Rijksmuseum (CC0) | — |
| `Moorschlurfer.jpg` | tor2e | *Nøkken* (The Water Sprite), Theodor Kittelsen (d. 1914), 1887–92; Nasjonalmuseet Oslo | a portrait crop around the creature; the same picture is `tests/fixtures/tor2e/Moorschlurfer.jpg` |
| `Feldstecher.jpg` | troubleshooters | Field glasses from a Carl Zeiss Jena advertisement, anonymous, in a *Storm Reiseführer* travel guide, 1924 | the binoculars and hat, without the lettering |
| `Zollbeamtin.jpg` | troubleshooters | *I tullen 1909* (At the customs), Per Fredrik Röding (d. 1928), 1909; Stockholms stadsmuseum | — |

## Bundled systems

Each bundled system is a card design and a vocabulary for a game. The
game's mechanics are used under the terms noted; product names, logos,
trade dress, artwork and proper nouns remain the property of their owners.

| System | Game and rights holder | Terms | Notes |
|---|---|---|---|
| **5e_2014** | *System Reference Document 5.1*, Wizards of the Coast LLC | CC BY 4.0 (the SRD 5.1) | Field names and terminology follow the SRD; no SRD text is bundled. The German captions use the terminology of the German Player's Handbook of these rules (*Spielerhandbuch*) — single terms such as "Rüstungsklasse", "Herausforderung", "Auf höheren Graden"; no text of it is bundled. The system is named "5E (2014)" and carries no publisher's wordmark or logo; the d20 on its back is original. See the SRD attribution below. |
| **5e_2024** | *System Reference Document 5.2.1*, Wizards of the Coast LLC, in English and in its German translation (*Systemreferenzdokument 5.2.1*) | CC BY 4.0 (the SRD 5.2.1) | Field names, the stat block's structure and the terminology follow the SRD 5.2.1; the German captions are those of the German SRD 5.2.1. No SRD text is bundled; the samples are invented. The system is named "5E (2024)" and carries no publisher's wordmark, logo, fonts or trade dress; the colours, the d20 on its back and the typography are this project's. See the SRD attribution below. |
| **dcc** | *Dungeon Crawl Classics*, Goodman Games | Open Game License v1.0a | `dcc/OGL.txt` carries the notice and the licence: no game text bundled, field names follow the game, samples invented. "Dungeon Crawl Classics" and Goodman Games' Product Identity are not reproduced. |
| **daggerheart** | *Daggerheart System Reference Document 1.0*, Darrington Press / Critical Role, LLC; German edition by Pegasus Spiele | Darrington Press Community Gaming License (DPCGL) | Field names, the card structure and the sample texts follow the SRD 1.0, which the licence names Public Game Content; the German sample texts are this project's translation of it. The German captions use the terminology of the official German edition — single terms such as "Rückruf", "Zauber-Attribut", "Schadensschwellen"; no text of it is bundled. No artwork, logo, glyph, typography or trade dress of the publisher's is reproduced; the design is this project's. Every card front carries the line "Daggerheart™ Compatible. Terms at Daggerheart.com". See the DPCGL attribution below. |
| **dftq** | *Descended from the Queen* — the framework *For the Queen* (Alex Roberts) offers for games built on it | The framework's terms | The system is a card design for such games; nothing of *For the Queen* is bundled, and the samples are invented. |
| **dino-island** | *Escape from Dino Island* (Sam Tung & Sam Roberts, Mythworks); German edition *Flucht von Dino Island* (System Matters) | **Bundled with the explicit permission of the authors, Sam Tung & Sam Roberts** | Layouts and terminology only — no prose, images or logos of the game. |
| **dragonbane** | *Dragonbane*, Free League Publishing (Fria Ligan AB) | Not a Supplement under the Dragonbane Third-Party Tabletop Module License, which defines one as a publication of adventures, setting material or rules additions; the system bundles none, and no Free League text, artwork or logo | A card design in the spirit of the game's own card deck: colours and proportions follow the printed cards, no illustration of the publisher's is reproduced, and the textures are not Free League's. Anyone who publishes a Supplement made with it carries that licence's obligations — the logo, the notice — themselves. This system is not affiliated with, sponsored or endorsed by Fria Ligan AB. |
| **eiserne-zeit** | *Eiserne Zeit*, Gazer Press, Vienna (Markus Schauta; illustrations Marianne Musek) | **Bundled with the explicit permission of Markus Schauta** | The only system that ships a publisher's logo and graphic design — see the row above. Layouts, terminology and samples are original to this project. |
| **mini-d20** | *MINI D20*, Seba (kritischerfehlschlag.de) | **Bundled with the explicit permission of MINI D20's creator, Seba** | Layouts, terminology and samples are original to this project; the icons are game-icons.net's (above). |
| **pf2e** | *Pathfinder Second Edition*, Paizo Inc. | Paizo Community Use Policy | The "P" mark and the five action glyphs are Paizo's, under the policy; see the notice below. No rules text is bundled; samples are invented. |
| **simple** | — | MIT | Original to this project; system-agnostic. |
| **sw** | *Swords & Wizardry*, Matthew J. Finch / Frog God Games | Open Game License v1.0a | `sw/OGL.txt` carries the notice and the licence, on the same terms as dcc's. |
| **tor2e** | *The One Ring*, second edition, Free League Publishing / Sophisticated Games; Middle-earth is the property of Middle-earth Enterprises and the Tolkien Estate | Proprietary — nothing of it is bundled | Layout and field names only. The samples name no Middle-earth place, person or thing, and none may be added to the bundled content. |
| **troubleshooters** | *The Troubleshooters*, Helmgast AB | Helmgast Fan Content Policy | Compliant Fan Content: the policy permits the game's names, trademarks and mechanics and forbids its text, illustrations and graphic design; the system bundles none of the latter — the game's name on the back is set in Bangers as text — and the plugin is free. See the notice below. |

### SRD 5.1 attribution (5e_2014)

> This work includes material taken from the System Reference Document 5.1
> ("SRD 5.1") by Wizards of the Coast LLC and available at
> https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1
> is licensed under the Creative Commons Attribution 4.0 International
> License available at https://creativecommons.org/licenses/by/4.0/legalcode.

### SRD 5.2.1 attribution (5e_2024)

> This work includes material from the System Reference Document 5.2.1
> ("SRD 5.2.1") by Wizards of the Coast LLC, available at
> https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the
> Creative Commons Attribution 4.0 International License, available at
> https://creativecommons.org/licenses/by/4.0/legalcode.

> Dieses Werk enthält Material aus dem Systemreferenzdokument 5.2.1
> („SRD 5.2.1“) von Wizards of the Coast LLC, verfügbar unter
> https://www.dndbeyond.com/srd. Das SRD 5.2.1 ist lizenziert gemäß
> Creative Commons Namensnennung 4.0 International Public License
> (verfügbar unter https://creativecommons.org/licenses/by/4.0/legalcode.de).

### DPCGL attribution (daggerheart)

> This product includes materials from the Daggerheart System Reference
> Document 1.0, © Critical Role, LLC. under the terms of the Darrington
> Press Community Gaming (DPCGL) License. More information can be found
> at https://www.daggerheart.com. The licence is available at
> https://darringtonpress.com/license/. The German texts are a
> translation of the Public Game Content made for this project; there
> are no previous modifications by others.

Daggerheart™ Compatible. Terms at Daggerheart.com. Cardsmith is not
connected with, sponsored or endorsed by Darrington Press or Critical
Role.

### Paizo Community Use notice (pf2e)

> Cardsmith uses trademarks and/or copyrights owned by Paizo Inc., used
> under Paizo's Community Use Policy (paizo.com/licenses/communityuse). We
> are expressly prohibited from charging you to use or access this content.
> Cardsmith is not published, endorsed, or specifically approved by Paizo.
> For more information about Paizo Inc. and Paizo products, visit
> paizo.com.

### Helmgast Fan Content notice (troubleshooters)

> This product is unofficial Fan Content for The Troubleshooters permitted
> under the Helmgast Fan Content Policy:
> https://helmgast.se/meta/fan-content-policy

## Runtime dependencies

Bundled into `main.js`:

| Package | Licence |
|---|---|
| handlebars | MIT |
| js-yaml | MIT |
| marked | MIT |

Build and test tooling (esbuild, TypeScript, Vitest, Playwright, the
Obsidian API typings) is not distributed with the plugin.
