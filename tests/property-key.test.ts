import { describe, expect, it } from "vitest";
import { propertyKey } from "../src/util/property-key";

describe("propertyKey", () => {
  it("lowercases, and reads every run of spaces and underscores as one hyphen", () => {
    expect(propertyKey("Hit Points")).toBe("hit-points");
    expect(propertyKey("hit_points")).toBe("hit-points");
    expect(propertyKey("  Roll  Min ")).toBe("roll-min");
    expect(propertyKey("Hit _ Points")).toBe("hit-points");
  });

  it("leaves a canonical key as it is", () => {
    expect(propertyKey("hit-points")).toBe("hit-points");
    expect(propertyKey("größe")).toBe("größe");
  });

  it("keeps other punctuation — a key is an identifier, not prose", () => {
    expect(propertyKey("a.b")).toBe("a.b");
  });
});
