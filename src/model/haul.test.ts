import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CRUDE_PREMIUM, WEST_COAST_CRUDE_PREMIUM, ordinaryHarborCrack, westCoastBarrel } from "./haul.ts";
import { REGIONS } from "./region.ts";

describe("West Coast crude haul", () => {
  it("adds the same premium to any Gulf barrel", () => {
    assert.equal(WEST_COAST_CRUDE_PREMIUM, 3.45);
    assert.equal(westCoastBarrel(70), 73.45);
    assert.equal(westCoastBarrel(100) - westCoastBarrel(70), 30);
  });

  it("is about 8 cents a gallon, not a second Oregon hop", () => {
    const cents = (WEST_COAST_CRUDE_PREMIUM / 42) * 100;
    assert.ok(cents > 8);
    assert.ok(cents < 9);
  });

  it("prices a harbor from the Gulf dock plus the published gap, minus the dearer crude", () => {
    assert.equal(ordinaryHarborCrack(0.39, "gulf", "gasoline"), 0.39);
    assert.equal(
      ordinaryHarborCrack(0.39, "california", "gasoline"),
      0.39 + REGIONS.california.gasolineDock! - CRUDE_PREMIUM.california / 42,
    );
    assert.equal(ordinaryHarborCrack(0.48, "midwest", "diesel"), null);
  });
});
