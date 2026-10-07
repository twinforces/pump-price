import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PIPE } from "./freight.ts";
import { CALIFORNIA_PROGRAMS } from "./programs.ts";
import { DIESEL_SURVEY, STATION_SURVEY, stationDiesel, stationRegular, taxSwapFromTexas } from "./survey.ts";
import { stateTax } from "./states.ts";

describe("station survey", () => {
  it("is the cached AAA table, fifty states and the District", () => {
    assert.equal(STATION_SURVEY.length, 51);
    assert.ok(stationRegular("California") > stationRegular("Texas"));
  });

  it("has a diesel price for every state on that same day", () => {
    assert.equal(Object.keys(DIESEL_SURVEY).length, 51);
    for (const row of STATION_SURVEY) assert.equal(typeof stationDiesel(row.state), "number");
    assert.ok(stationDiesel("California") > stationDiesel("Texas"));
  });

  it("leaves Texas unchanged and does not explain California", () => {
    assert.equal(taxSwapFromTexas(stateTax("Texas", "gasoline")), stationRegular("Texas"));
    const california = taxSwapFromTexas(stateTax("California", "gasoline"));
    const named = california + PIPE.houstonToLinden + CALIFORNIA_PROGRAMS.capAndTrade + CALIFORNIA_PROGRAMS.lowCarbonFuel;
    assert.ok(stationRegular("California") - named > 1);
  });

  it("keeps the long pipe under 8 cents a gallon", () => {
    assert.ok(Math.abs(PIPE.houstonToLinden - 335.15 / 42 / 100) < 1e-12);
    assert.ok(PIPE.houstonToLinden < 0.08);
    assert.ok(PIPE.houstonToBirmingham < PIPE.houstonToLinden);
  });
});
