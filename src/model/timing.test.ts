import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { crudeLagDays, productLagDays } from "./voyage.ts";

describe("timing lags", () => {
  it("keeps Alaska's crude at home and sends Idaho's gallon out of the Gulf", () => {
    assert.equal(crudeLagDays("Alaska"), 0);
    assert.ok(crudeLagDays("Texas") > 0);
    assert.equal(productLagDays("Texas"), 0);
    assert.equal(productLagDays("Idaho"), 15);
    assert.equal(productLagDays("Idaho", "diesel"), 19);
    assert.equal(productLagDays("Massachusetts", "diesel"), 19);
    assert.equal(productLagDays("Oregon"), 0);
    assert.equal(productLagDays("Washington"), 0);
    assert.equal(crudeLagDays("Oregon"), crudeLagDays("Washington"));
  });
});
