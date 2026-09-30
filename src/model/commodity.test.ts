import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COMMODITIES, WHEAT, arrivingCost, cooler, deliveryCost, wheatBooked } from "./commodity.ts";
import { stationSign } from "./station.ts";

describe("the shelf", () => {
  it("matches the starting price when diesel has not moved", () => {
    assert.equal(deliveryCost(4, 0.05, 3, 3), 4);
  });

  it("moves only the diesel slice when diesel doubles", () => {
    const next = deliveryCost(4, 0.05, 6, 3);
    assert.equal(next, 4.2);
  });

  it("leaves toilet paper alone", () => {
    const paper = COMMODITIES.find((item) => item.id === "paper");
    assert.ok(paper);
    assert.equal(deliveryCost(paper.shelf, paper.dieselShare, 9, 3), paper.shelf);
  });

  it("holds the shelf at the dearest unit until that unit is sold", () => {
    const stock = [4.2, 4, 4, 4, 4, 4, 4];
    assert.equal(stationSign(stock, 4), 4.2);
    const sold = [4, 4, 4, 4, 4, 4, 4];
    assert.equal(stationSign(sold, 4), 4);
  });

  it("lets milk arrive in two days and keeps the steer and the wheat waiting", () => {
    const milk = COMMODITIES.find((item) => item.id === "milk");
    const beef = COMMODITIES.find((item) => item.id === "beef");
    const wheat = WHEAT;
    assert.equal(milk?.waitDays, 2);
    assert.equal(beef?.waitDays, 150);
    assert.equal(wheat.waitDays, 270);
    const history = [...Array(200).fill(4), 9];
    assert.equal(arrivingCost(history, 2), 4);
    assert.equal(arrivingCost(history, 150), 4);
    const caughtUp = [...Array(2).fill(4), 9, 9];
    assert.equal(arrivingCost(caughtUp, 2), 9);
    assert.ok(cooler(history, 150, 7).every((load) => load === 4));
  });

  it("keeps the wheat market and the fertilizer off diesel", () => {
    const calm = wheatBooked(6, 1, 0.3, 3, 3);
    const dear = wheatBooked(6, 1, 0.3, 6, 3);
    assert.equal(calm, 7.3);
    assert.equal(dear, 7.6);
    assert.ok(Math.abs(wheatBooked(8, 1, 0.3, 3, 3) - calm - 2) < 1e-9);
    assert.ok(Math.abs(wheatBooked(6, 2, 0.3, 3, 3) - calm - 1) < 1e-9);
  });
});
