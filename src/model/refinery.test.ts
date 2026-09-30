import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { crack321, FLEET_YIELD } from "./refinery.ts";

describe("refinery", () => {
  it("prices two gasoline and one diesel against three crude", () => {
    const margin = crack321(84, 2, 2.1);
    assert.ok(Math.abs(margin - 1.4) < 1e-9);
  });

  it("keeps the slate that still described the fleet after 2022", () => {
    assert.ok(Math.abs(FLEET_YIELD.gasoline - 0.592) < 0.01);
    assert.ok(Math.abs(FLEET_YIELD.distillate - 0.303) < 0.005);
  });
});
