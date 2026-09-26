"""Add the German letters Nodesto Caps Condensed lacks.

The Solbera release of Nodesto Caps Condensed — the title face of the
5e_2014 system — has no ä ö ü Ä Ö Ü and no ß, so a German name such as
"Eulenbär" printed its ä in the fallback serif. This script composes them
from the font's own outlines, in each of the four styles:

  ä ö ü Ä Ö Ü   the base letter with two dots over it, each dot the
                font's own full stop, scaled down — on the italic styles
                moved along the slant
  ß             two of the font's s side by side — the capital form a
                caps face prints ß as

It works on the WOFF2 files in place and leaves a file that already has
the letters alone, so it can run again. The fonts are CC BY-SA 4.0; the
modification is stated in fonts/solbera-LICENSE.txt.

    python3 scripts/fonts/nodesto-umlauts.py

Needs fontTools with brotli (pip install fonttools brotli).
"""

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

FONTS = Path(__file__).resolve().parents[2] / "resources/systems/5e_2014/fonts"

# new glyph -> (code point, base glyph)
UMLAUTS = {
    "adieresis": (0xE4, "a"),
    "odieresis": (0xF6, "o"),
    "udieresis": (0xFC, "u"),
    "Adieresis": (0xC4, "A"),
    "Odieresis": (0xD6, "O"),
    "Udieresis": (0xDC, "U"),
}

# The dots: the full stop at this size, this far above the letter, this
# far apart (centre to centre) in dot widths.
DOT_SCALE = 0.72
DOT_GAP = 0.45
DOT_SPACING = 2.1


def bounds(glyphset, name):
    pen = BoundsPen(glyphset)
    glyphset[name].draw(pen)
    return pen.bounds


def slant(glyphset):
    """The lean of the face, run over rise, measured on the stem of I.

    The italic styles do not state an italic angle, so it is read off the
    outline: the leftmost point of I near its foot against the leftmost
    near its top. Upright styles come out at 0.
    """
    pen = DecomposingRecordingPen(glyphset)
    glyphset["I"].draw(pen)
    points = [pt for _, args in pen.value for pt in args]
    ys = [y for _, y in points]
    low, high = min(ys), max(ys)
    band = (high - low) * 0.1
    foot = min(x for x, y in points if y <= low + band)
    top = min(x for x, y in points if y >= high - band)
    return (top - foot) / (high - low)


def add_glyph(font, name, code, parts, width):
    """Add `name` drawn from `parts` — (glyph, 2x3 transform) — at `width`."""
    glyphset = font.getGlyphSet()
    cff = font["CFF "].cff
    top = cff.topDictIndex[0]
    private = top.Private
    nominal = getattr(private, "nominalWidthX", 0)
    pen = T2CharStringPen(width - nominal, glyphset)
    for glyph, transform in parts:
        glyphset[glyph].draw(TransformPen(pen, transform))
    charstring = pen.getCharString(private=private, globalSubrs=cff.GlobalSubrs)

    strings = top.CharStrings
    strings.charStringsIndex.append(charstring)
    strings.charStrings[name] = len(strings.charStringsIndex) - 1
    # The CFF charset and the font's glyph order are one list once loaded;
    # the name goes in once.
    order = font.getGlyphOrder()
    order.append(name)
    if top.charset is not order:
        top.charset.append(name)
    font.setGlyphOrder(order)

    box = charstring.calcBounds(strings)
    font["hmtx"].metrics[name] = (width, int(round(box[0])) if box else 0)
    for table in font["cmap"].tables:
        if table.isUnicode():
            table.cmap[code] = name


def patch(path):
    font = TTFont(path)
    cmap = font.getBestCmap()
    if all(code in cmap for code, _ in UMLAUTS.values()) and 0xDF in cmap:
        print(f"{path.name}: complete, left alone")
        return

    glyphset = font.getGlyphSet()
    hmtx = font["hmtx"].metrics
    px0, py0, px1, py1 = bounds(glyphset, "period")
    dot = (px1 - px0) * DOT_SCALE
    lean = slant(glyphset)

    for name, (code, base) in UMLAUTS.items():
        if code in cmap:
            continue
        x0, y0, x1, y1 = bounds(glyphset, base)
        y = y1 + dot * DOT_GAP
        # The box's middle is the letter's middle at half height; on a
        # slanted face the dots sit further along the lean.
        centre = (x0 + x1) / 2 + lean * (y + dot / 2 - (y0 + y1) / 2)
        parts = [(base, (1, 0, 0, 1, 0, 0))]
        for side in (-1, 1):
            x = centre + side * dot * DOT_SPACING / 2 - dot / 2
            parts.append(
                ("period", (DOT_SCALE, 0, 0, DOT_SCALE, x - px0 * DOT_SCALE, y - py0 * DOT_SCALE))
            )
        add_glyph(font, name, code, parts, hmtx[base][0])

    if 0xDF not in cmap:
        s_width = hmtx["s"][0]
        parts = [("s", (1, 0, 0, 1, 0, 0)), ("s", (1, 0, 0, 1, s_width, 0))]
        add_glyph(font, "germandbls", 0xDF, parts, s_width * 2)

    font.flavor = "woff2"
    font.save(path)
    print(f"{path.name}: ä ö ü Ä Ö Ü ß added")


for woff2 in sorted(FONTS.glob("solbera-nodesto-caps-condensed-*.woff2")):
    patch(woff2)
