import { describe, expect, it } from "vitest";
import { cardSettingEntries } from "../src/definitions/card-settings";
import { deckSettingEntries } from "../src/definitions/deck-settings";
import { BASELINE } from "../src/systems/baseline";
import { settingText } from "../src/ui/setting-text";

describe("the deck summary's setting text", () => {
  it("shows the hinge as its fields, in the block's words and order, widths in millimetres", () => {
    expect(
      settingText("hinge", { sides: "both", color: "#e8d9b5", outerGap: 2.5, gap: 1.5 })
    ).toBe("gap: 1.5 mm, outer-gap: 2.5 mm, color: #e8d9b5, sides: both");
    expect(settingText("hinge", { gap: 0.5 })).toBe("gap: 0.5 mm");
  });

  it("renders every setting the baseline sets as words, never as a bare object", () => {
    const entries = [
      ...deckSettingEntries(BASELINE.deckSettings),
      ...cardSettingEntries(BASELINE.cardSettings),
    ];
    expect(entries.length).toBeGreaterThan(10);
    for (const [key, value] of entries) {
      if (key === "card-size" || key === "paper-size") continue; // shown in a row of their own
      expect(settingText(key, value), key).not.toContain("[object");
    }
  });
});
