import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CALIFORNIA_MONTHS, approximateCaliforniaInvoice, californiaFromCrude, medianPileBesidesCrude } from "./california-history.ts";

describe("California history", () => {
  it("adds up, month by month", () => {
    assert.equal(CALIFORNIA_MONTHS.length, 27);
    for (const month of CALIFORNIA_MONTHS) {
      const sum = month.crude + month.refining + month.distribution + month.capAndTrade + month.lowCarbon + month.federal + month.stateExcise + month.sales + month.tank;
      assert.ok(Math.abs(sum - month.total) < 0.01, month.month);
    }
  });

  it("lets the oil move and holds the rest, and the miss stays in the noise except the shock", () => {
    const pile = medianPileBesidesCrude();
    assert.ok(pile > 2.6 && pile < 2.8);
    const misses = CALIFORNIA_MONTHS.map((month) => Math.abs(month.total - californiaFromCrude(month.crude)));
    misses.sort((a, b) => a - b);
    assert.ok(misses[13] < 0.25);
    const may = CALIFORNIA_MONTHS.find((month) => month.month === "2026-05");
    assert.ok(may);
    assert.ok(Math.abs(may.total - californiaFromCrude(may.crude)) > 0.6);
  });

  it("builds an approximate invoice that adds up", () => {
    const invoice = approximateCaliforniaInvoice(100, 4);
    const sum = invoice.lines.reduce((total, line) => total + line.cents, 0);
    assert.equal(sum, invoice.totalCents);
    const oil = invoice.lines.find((line) => line.label === "Oil");
    assert.equal(oil?.cents, Math.round((103.45 / 42) * 100));
    const refining = invoice.lines.find((line) => line.label === "Refining");
    assert.equal(refining?.cents, Math.round((4 - 103.45 / 42) * 100));
  });
});
