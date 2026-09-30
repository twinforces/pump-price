import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EVEN_SLATE, setShare, slateNote } from "./slate.ts";

describe("the slate", () => {
  it("keeps the four shares at 100", () => {
    const next = setShare(EVEN_SLATE, "heavySour", 70);
    const sum = next.lightSweet + next.lightSour + next.heavySweet + next.heavySour;
    assert.equal(next.heavySour, 70);
    assert.equal(sum, 100);
    assert.ok(Object.values(next).every((share) => Number.isInteger(share)));
  });

  it("does not turn a heavy slate into a price", () => {
    const heavy = setShare(EVEN_SLATE, "heavySour", 80);
    assert.match(slateNote(heavy), /does not change the dock price/);
    assert.match(slateNote(heavy), /Diesel/);
  });

  it("calls a light sweet lead the news barrel", () => {
    const light = setShare(EVEN_SLATE, "lightSweet", 60);
    assert.match(slateNote(light), /news barrel/);
  });
});
