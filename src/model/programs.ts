/**
 * California-only costs named by the California Energy Commission.
 * Page updated September 11, 2026. Not inside the EIA state-tax line.
 * Cap-and-trade and the low-carbon fuel standard are pass-throughs.
 * They are not added to the sign. They do not close the California gap.
 */
export const CALIFORNIA_PROGRAMS = {
  asOf: "September 11, 2026",
  capAndTrade: 0.25,
  lowCarbonFuel: 0.17,
} as const;
