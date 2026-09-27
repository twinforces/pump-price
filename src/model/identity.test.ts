import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LAST_FIT_WEEK,
  MIDNIGHT_HAMMER,
  SCORE,
  alaskaDieselBasis,
  californiaDieselBasis,
  crudeCapacity,
  demandAt,
  gasolineCapacity,
  inFitWindow,
  percentMiss,
  renewableDiesel,
  retailFromCrack,
  scoreBand,
  curveGap,
  expectationMiss,
  type Plant,
} from "./identity.ts";

const crude: Plant = {
  id: "gulf",
  kind: "crude",
  crudeBarrelsPerDay: 1000,
  gasolineShare: 0.45,
  renewableDieselBarrelsPerDay: 0,
};

const converted: Plant = {
  id: "martinez",
  kind: "converted-to-renewable-diesel",
  crudeBarrelsPerDay: 0,
  gasolineShare: 0,
  renewableDieselBarrelsPerDay: 40,
};

describe("fit window", () => {
  it("studies the week before Midnight Hammer and not the strike", () => {
    assert.equal(MIDNIGHT_HAMMER, "2025-06-22");
    assert.equal(LAST_FIT_WEEK, "2025-06-16");
    assert.equal(inFitWindow("2025-06-16"), true);
    assert.equal(inFitWindow("2025-06-22"), false);
    assert.equal(inFitWindow("2026-02-28"), false);
  });
});

describe("percent score", () => {
  it("calls 1 percent a success and 10 percent not", () => {
    const actual = 4;
    assert.equal(scoreBand(percentMiss(actual, actual * 1.01)), "genius");
    assert.equal(scoreBand(percentMiss(actual, actual * 0.99)), "genius");
    assert.ok(percentMiss(actual, actual * 1.1) - SCORE.notASuccess < 1e-12);
    assert.equal(scoreBand(percentMiss(actual, actual * 1.1)), "not-a-success");
  });

  it("calls 20 percent a missing factor and does not invent a speculation knob", () => {
    assert.equal(scoreBand(percentMiss(3, 3 * 1.2)), "missing-factor");
    assert.equal(scoreBand(0.2), "missing-factor");
    assert.equal(scoreBand(0.19), "not-a-success");
  });

  it("is the same miss on the way up and the way down", () => {
    assert.equal(percentMiss(4, 4.4), percentMiss(4, 3.6));
  });
});

describe("demand", () => {
  it("treats 100 percent as the measured baseline", () => {
    assert.equal(demandAt(3_900_000, 100), 3_900_000);
    assert.equal(demandAt(3_900_000, 80), 3_120_000);
    assert.equal(demandAt(3_900_000, 0), 0);
  });
});

describe("plants and tax", () => {
  it("removes a crude plant and does not treat a conversion as a full shutdown", () => {
    assert.equal(crudeCapacity([crude, converted]), 1000);
    assert.equal(gasolineCapacity([crude, converted]), 450);
    assert.equal(renewableDiesel([crude, converted]), 40);
    assert.equal(crudeCapacity([converted]), 0);
    assert.equal(gasolineCapacity([converted]), 0);
  });

  it("adds tax to retail and leaves the crack where it was", () => {
    const crack = 2.5;
    assert.equal(retailFromCrack(crack, 0.184), 2.684);
    assert.equal(crack, 2.5);
  });

  it("does not call Alaska diesel a West Coast federal print", () => {
    assert.equal(alaskaDieselBasis(), "station-survey");
    assert.equal(californiaDieselBasis(), "federal-state");
    assert.notEqual(alaskaDieselBasis(), californiaDieselBasis());
  });
});

describe("speculation", () => {
  it("derives the gap from a later month and the spot, and does not tune it", () => {
    assert.equal(curveGap(80, 70), 10);
    assert.equal(curveGap(60, 70), -10);
  });

  it("grades whether the month mattered only after the month arrives", () => {
    assert.equal(expectationMiss(80, 80), 0);
    assert.equal(scoreBand(expectationMiss(88, 80)), "not-a-success");
    assert.equal(scoreBand(expectationMiss(96, 80)), "missing-factor");
  });
});
