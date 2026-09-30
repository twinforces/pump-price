import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { REFINERIES, refineriesIn, refineryCapacity } from "./refineries.ts";

describe("refineries", () => {
  it("counts the January 2026 operable refineries", () => {
    assert.equal(REFINERIES.length, 124);
    const barrels = REFINERIES.reduce((sum, refinery) => sum + refinery.barrelsPerDay, 0);
    assert.equal(barrels, 18_160_493);
  });

  it("puts the most capacity in Texas and none in New York or Florida", () => {
    assert.ok(refineryCapacity("Texas") > refineryCapacity("Louisiana"));
    assert.equal(refineriesIn("New York").length, 0);
    assert.equal(refineriesIn("Florida").length, 0);
    assert.ok(refineriesIn("California").length > 1);
  });
});
