import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CALIFORNIA_DOCK, stateSign, stateTax } from "./states.ts";

describe("state tax", () => {
  it("keeps Texas at 20 cents on both fuels", () => {
    assert.equal(stateTax("Texas", "gasoline"), 0.2);
    assert.equal(stateTax("Texas", "diesel"), 0.2);
  });

  it("puts a much larger state tax on a California gallon", () => {
    assert.ok(stateTax("California", "gasoline") > 0.7);
    assert.ok(stateTax("California", "diesel") > stateTax("California", "gasoline"));
  });

  it("leaves Texas on the Gulf sign and adds the Los Angeles dock only in California", () => {
    assert.equal(stateSign(3, "gasoline", "Texas", CALIFORNIA_DOCK.gasoline), 3);
    const california = stateSign(3, "gasoline", "California", CALIFORNIA_DOCK.gasoline);
    assert.equal(california, 3 - 0.2 + stateTax("California", "gasoline") + CALIFORNIA_DOCK.gasoline);
    assert.equal(CALIFORNIA_DOCK.gasoline, 0.189);
    assert.equal(CALIFORNIA_DOCK.diesel, 0.087);
  });
});
