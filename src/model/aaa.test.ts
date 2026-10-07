import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { aaaDate, surveyFromAaaRows } from "./aaa.ts";
import { STATE_TAXES } from "./states.ts";

describe("AAA station table", () => {
  it("reads the page date", () => {
    assert.equal(aaaDate("9/30/26"), "September 30, 2026");
  });

  it("keeps regular and diesel and drops the middle grades", () => {
    const rows = STATE_TAXES.filter((row) => row.name !== "American Samoa" && row.name !== "Guam" && row.name !== "Northern Mariana Islands" && row.name !== "Puerto Rico" && row.name !== "U.S. Virgin Islands").map((row) => [row.name, "$4.0000", "$4.1000", "$4.2000", "$5.0000"]);
    const survey = surveyFromAaaRows("9/30/26", rows);
    assert.equal(survey.gasoline.length, 51);
    assert.equal(survey.gasoline.find((row) => row.state === "Texas")?.regular, 4);
    assert.equal(survey.diesel.Texas, 5);
    assert.equal(survey.asOf, "September 30, 2026");
  });
});
