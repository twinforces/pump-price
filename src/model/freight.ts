/**
 * Colonial Pipeline filed rates, FERC 99.94.0, effective July 1, 2026.
 * Cents per barrel of 42 gallons, from Houston (Pasadena), divided by 42.
 * The Northeast rates are market-based, not a cost per mile.
 * This is the pipe. It is not the truck, and it is not added to the sign.
 */
export const PIPE = {
  asOf: "July 1, 2026",
  /** Houston to Linden, New Jersey. 335.15 cents per barrel. */
  houstonToLinden: 335.15 / 42 / 100,
  /** Houston to Birmingham, Alabama. 101.60 cents per barrel. */
  houstonToBirmingham: 101.6 / 42 / 100,
} as const;
