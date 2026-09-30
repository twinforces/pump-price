import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CALIFORNIA_INVOICE, invoiceCents } from "./california-invoice.ts";

describe("California invoice", () => {
  it("adds up to the July pump", () => {
    assert.equal(invoiceCents(), 531);
    assert.equal(CALIFORNIA_INVOICE.publishedTotal, 5.31);
  });
});
