import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NATIONAL_PILES } from "./pile.ts";

describe("national pile", () => {
  it("turns the shares back into cents", () => {
    const august = NATIONAL_PILES[0];
    const may = NATIONAL_PILES[1];
    assert.equal(august.crude, 1.58);
    assert.equal(august.refining, 0.55);
    assert.equal(august.distributionAndMarketing, 0.49);
    assert.equal(august.taxes, 0.51);
    assert.equal(may.refining, 0.97);
    assert.equal(may.taxes, 0.52);
  });

  it("keeps the tax pile still while the oil moves", () => {
    const [august, may] = NATIONAL_PILES;
    assert.equal(Math.round(august.taxes * 100), 51);
    assert.equal(Math.round(may.taxes * 100), 52);
    assert.ok(may.crude - august.crude > 0.5);
    assert.ok(may.refining > august.refining);
  });
});
