import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BARREL, ETHANOL_IN_THE_GALLON, barrelGasolineShare, sourceFor, sourceRows } from "./sources.ts";

describe("sources", () => {
  it("does not treat half a gallon as additives", () => {
    assert.equal(ETHANOL_IN_THE_GALLON, 0.1);
    assert.ok(barrelGasolineShare() > 0.4);
    assert.ok(barrelGasolineShare() < 0.5);
    assert.equal(BARREL.gasolineGallons, 19.57);
  });

  it("names a filed rate only where the tariff names a place", () => {
    assert.match(sourceFor("New Jersey").transport, /Linden/);
    assert.match(sourceFor("Alabama").transport, /Birmingham/);
    assert.equal(sourceFor("Montana").transport, "Not published.");
    assert.equal(sourceFor("Florida").refineries, "None");
    assert.notEqual(sourceFor("Texas").refineries, "None");
    assert.match(sourceFor("Idaho").where, /15 days/);
    assert.match(sourceFor("Idaho").crude, /Gulf/);
    assert.match(sourceFor("Oregon").where, /Puget Sound/);
    assert.match(sourceFor("Massachusetts").where, /New York harbor/);
  });

  it("covers every state and the District", () => {
    assert.equal(sourceRows().length, 51);
  });
});
