import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ETHANOL_SHARE, iowaEthanolPrice } from "./ethanol.ts";

describe("ethanol", () => {
  it("reads the Iowa plant price and ignores the later grain prices", () => {
    const text = "Iowa\nTrade\n1.9600\nUNCH\nIowa East\nAsk\n74.00";
    assert.equal(iowaEthanolPrice(text), 1.96);
    assert.equal(ETHANOL_SHARE, 0.1);
  });
});
