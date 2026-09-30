import type { LatestWeek } from "./today";

/** The last week that loaded. Week of 2026-09-18. Used when the live files miss. */
export const SAVED_WEEK: LatestWeek = {
  week: "2026-09-18",
  crude: 103.54,
  gasolineSpot: 3.888,
  dieselSpot: 5.128,
  gasolineCrack: 1.4227619047619045,
  dieselCrack: 2.6627619047619047,
  quality: { month: "2026-06-15", sulfur: 1.35, api: 33.32 },
  californiaDock: { gasoline: 0.23500000000000032, diesel: 0.2370000000000001 },
  losAngelesGasoline: { date: "2026-09-18", value: 4.123 },
  newYorkGasoline: { date: "2026-09-18", value: 3.542 },
  newYorkDiesel: { date: "2026-09-18", value: 5.223 },
  ethanol: { date: "September  25,  2026", dollarsPerGallon: 1.96 },
  refinery: {
    week: "2026-09-18",
    utilization: 94,
    gasolineShare: 0.5704598179763251,
    distillateShare: 0.3068823984295997,
  },
  lag: {
    gasoline: { date: "2026-09-04", crack: 1.0287619047619048 },
    diesel: { date: "2026-08-28", crack: 1.8087619047619046 },
  },
  importTravel: {
    california: -0.10613804199365709,
    washington: -0.12825963252187217,
    east: -0.21695238736098535,
    midwest: -0.20496591570466277,
    gulf: -0.03804608764661401,
    rockies: -0.04678946886694804,
    alaska: 0,
    hawaii: -0.1742425797134498,
  },
  stale: true,
};
