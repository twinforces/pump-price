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
  DELAY,
  transitPriceLagDays,
  arrivalDays,
  truckFuelCents,
  FLEET,
  renewableCentsPerGallon,
  WINTER,
  winterAdderOnTopOfHarbor,
  crackOverCrude,
  daysOfSupply,
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

describe("delays", () => {
  it("keeps the quote imaginary and the clocks real", () => {
    assert.equal(transitPriceLagDays(), 0);
    assert.equal(DELAY.refineryDays, 3);
    assert.equal(DELAY.shipDaysMin, 40);
    assert.equal(DELAY.shipDaysMax, 45);
    assert.equal(DELAY.tankerRoundTripDays, 20);
  });

  it("puts both fuels on one tanker, and lets diesel trail on the pipe", () => {
    assert.deepEqual(arrivalDays("tanker"), { gasoline: 8, diesel: 8 });
    assert.deepEqual(arrivalDays("pipe"), { gasoline: 15, diesel: 19 });
  });
});

describe("delivery", () => {
  it("moves the truck's fuel by a fraction of a cent when diesel moves a dollar", () => {
    const at3 = truckFuelCents(3);
    const at4 = truckFuelCents(4);
    assert.ok(at4 - at3 < 0.3);
    assert.ok(at4 - at3 > 0.1);
  });
});

describe("fleet", () => {
  it("keeps the old posted-versus-wholesale gap and does not pretend the series continues", () => {
    assert.equal(FLEET.retailOverCommercial, 0.06);
    assert.equal(FLEET.retailOverWholesale, 0.18);
    assert.equal(FLEET.seriesEnds, "2011-02");
  });
});

describe("renewable credit", () => {
  it("puts the same cents on gasoline and on diesel", () => {
    const cost = renewableCentsPerGallon(2018, {
      cellulosic: 1,
      biomassDiesel: 1,
      advanced: 1,
      conventional: 1,
    });
    assert.equal(cost.gasoline, cost.diesel);
    assert.equal(cost.gasoline, 10.7);
  });

  it("stays a few cents even if the diesel credit is wrongly given only to diesel", () => {
    const onlyDiesel = 0.0315 * 2 * 100;
    assert.ok(onlyDiesel < 7);
  });
});

describe("winter", () => {
  it("keeps the winter premium in the harbor and does not add it again", () => {
    assert.equal(WINTER.gulfPumpCents, 22);
    assert.equal(WINTER.midwestPumpCents, 27);
    assert.ok(WINTER.gulfLeftoverCents < 10);
    assert.equal(winterAdderOnTopOfHarbor(), 0);
  });
});

describe("crack", () => {
  it("is the harbor minus crude, and a dollar of crude is not a dollar of fuel", () => {
    assert.equal(crackOverCrude(2, 42), 1);
    assert.equal(crackOverCrude(1, 42), 0);
  });
});

describe("supply", () => {
  it("counts days of supply and does not turn them into cents", () => {
    assert.equal(daysOfSupply(300, 10), 30);
  });
});
