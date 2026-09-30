import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { REGIONS, regionOf } from "./region.ts";

describe("refining region", () => {
  it("puts Texas on the Gulf, where the pump gap is zero", () => {
    const region = regionOf("Texas");
    assert.equal(region.id, "gulf");
    assert.equal(region.gasolinePump, 0);
    assert.equal(region.dieselDock, 0);
  });

  it("keeps the East Coast dock a nickel and the pump much wider", () => {
    const region = regionOf("New York");
    assert.equal(region.gasolineDock, 0.058);
    assert.equal(region.dieselDock, 0.054);
    assert.ok(region.gasolinePump > 0.2);
  });

  it("splits California off the rest of the West Coast", () => {
    assert.equal(regionOf("California").id, "california");
    assert.equal(regionOf("Washington").id, "west");
    assert.equal(regionOf("Washington").gasolineDock, null);
    assert.ok(REGIONS.california.gasolinePump > REGIONS.west.gasolinePump);
  });

  it("has no published spot for the Midwest or the Rockies", () => {
    assert.equal(regionOf("Illinois").gasolineDock, null);
    assert.equal(regionOf("Colorado").dieselDock, null);
  });
});
