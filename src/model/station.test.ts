import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  STATION,
  TYPICAL_CRACK,
  acquisitionCost,
  filledTank,
  gallonFromCrude,
  nextTank,
  onTheTruck,
  pumpFromRack,
  rackFromCrude,
  stationSign,
  tankLoads,
  maxGallon,
} from "./station.ts";

describe("truckload", () => {
  it("turns a barrel into a gallon and adds the tax and the leftover", () => {
    const gas = gallonFromCrude(42, "gasoline");
    assert.equal(gas, 1 + STATION.gasolineFederal + STATION.state + STATION.gasolineLeftover);
    const diesel = gallonFromCrude(42, "diesel");
    assert.equal(diesel, 1 + STATION.dieselFederal + STATION.state + STATION.dieselLeftover);
  });

  it("moves 10 dollars on the barrel by about 24 cents", () => {
    const low = gallonFromCrude(70, "gasoline");
    const high = gallonFromCrude(80, "gasoline");
    assert.ok(Math.abs(high - low - 10 / 42) < 1e-9);
  });

  it("refuses a negative barrel", () => {
    assert.throws(() => gallonFromCrude(-1, "gasoline"));
  });
});

describe("the sign", () => {
  it("takes a rise the same day", () => {
    const tank = filledTank(2, STATION.tankDays);
    assert.equal(stationSign(tank, 3), 3);
  });

  it("keeps a fall on the old gallons", () => {
    const tank = filledTank(3, STATION.tankDays);
    assert.equal(stationSign(tank, 2), 3);
  });

  it("lets the fall through only after the old gallons are sold", () => {
    let tank = filledTank(3, STATION.tankDays);
    for (let day = 0; day < STATION.tankDays - 1; day += 1) {
      tank = nextTank(tank, 2, STATION.tankDays);
      assert.ok(stationSign(tank, 2) > 2);
    }
    tank = nextTank(tank, 2, STATION.tankDays);
    assert.equal(stationSign(tank, 2), 2);
    assert.equal(acquisitionCost(tank), 2);
  });

  it("does not drop the sign on the first cheap day", () => {
    const tank = nextTank(filledTank(3, STATION.tankDays), 2, STATION.tankDays);
    assert.ok(stationSign(tank, 2) > 2.9);
  });

  it("holds the sign at the dearest gallon, not the average, until that gallon is sold", () => {
    const tank = [4, ...Array(13).fill(2)];
    assert.equal(maxGallon(tank), 4);
    assert.equal(stationSign(tank, 2), 4);
    assert.ok(acquisitionCost(tank) < 3);
    const sold = nextTank(tank, 2, 14);
    assert.equal(maxGallon(sold), 2);
    assert.equal(stationSign(sold, 2), 2);
  });

  it("uses the truckload when the tank is empty", () => {
    assert.equal(stationSign([], 2.5), 2.5);
  });
});

describe("the flow", () => {
  it("adds the harbor extra on top of the barrel, then the tax and the leftover", () => {
    const rack = rackFromCrude(42, TYPICAL_CRACK.gasoline);
    assert.equal(rack, 1 + TYPICAL_CRACK.gasoline);
    assert.equal(
      pumpFromRack(rack, "gasoline"),
      rack + STATION.gasolineFederal + STATION.state + STATION.gasolineLeftover,
    );
  });

  it("changes what the refinery pays today and leaves the truck on the old gallons", () => {
    const history = [...Array(16).fill(2), 4];
    assert.equal(history[history.length - 1], 4);
    assert.equal(onTheTruck(history, 3), 2);
    assert.ok(tankLoads(history, 3, 14).every((load) => load === 2));
  });

  it("lets the new gallons into the tank only after the plant days", () => {
    const history = [...Array(16).fill(2), 4, 4, 4, 4];
    assert.equal(onTheTruck(history, 3), 4);
    const loads = tankLoads(history, 3, 14);
    assert.equal(loads.filter((load) => load === 4).length, 1);
    assert.equal(loads.filter((load) => load === 2).length, 13);
  });

  it("keeps the sign on the old gallons while the refinery is already cheaper", () => {
    const history = Array(20).fill(3);
    const tank = tankLoads(history, 3, 14).map((rack) => pumpFromRack(rack, "gasoline"));
    const today = pumpFromRack(2, "gasoline");
    assert.ok(stationSign(tank, today) > today);
  });
});
