/**
 * State tax on a gallon, July 1, 2026.
 * EIA, federal and state motor fuels taxes, revised August 2026.
 * The state total. Not county or city. Not the local dock.
 */
import { STATION } from "./station.ts";

export type FuelTax = "gasoline" | "diesel";

export type StateTax = { name: string; gasoline: number; diesel: number };

export const STATE_TAX_AS_OF = "July 1, 2026";

export const STATE_TAXES: readonly StateTax[] = [
  { name: "Alabama", gasoline: 0.31, diesel: 0.3275 },
  { name: "Alaska", gasoline: 0.0895, diesel: 0.0895 },
  { name: "Arizona", gasoline: 0.19, diesel: 0.19 },
  { name: "Arkansas", gasoline: 0.25, diesel: 0.288 },
  { name: "California", gasoline: 0.7364, diesel: 0.9294 },
  { name: "Colorado", gasoline: 0.30175, diesel: 0.35675 },
  { name: "Connecticut", gasoline: 0.25, diesel: 0.499 },
  { name: "Delaware", gasoline: 0.23, diesel: 0.22 },
  { name: "District of Columbia", gasoline: 0.357, diesel: 0.357 },
  { name: "Florida", gasoline: 0.40096, diesel: 0.40971 },
  { name: "Georgia", gasoline: 0.3405, diesel: 0.3805 },
  { name: "Hawaii", gasoline: 0.185, diesel: 0.185 },
  { name: "Idaho", gasoline: 0.33, diesel: 0.33 },
  { name: "Illinois", gasoline: 0.717, diesel: 0.792 },
  { name: "Indiana", gasoline: 0.645, diesel: 0.64 },
  { name: "Iowa", gasoline: 0.3, diesel: 0.325 },
  { name: "Kansas", gasoline: 0.2503, diesel: 0.2703 },
  { name: "Kentucky", gasoline: 0.264, diesel: 0.234 },
  { name: "Louisiana", gasoline: 0.20925, diesel: 0.20925 },
  { name: "Maine", gasoline: 0.31452, diesel: 0.319619 },
  { name: "Maryland", gasoline: 0.4681, diesel: 0.4766 },
  { name: "Massachusetts", gasoline: 0.275593, diesel: 0.275593 },
  { name: "Michigan", gasoline: 0.534, diesel: 0.534 },
  { name: "Minnesota", gasoline: 0.327, diesel: 0.327 },
  { name: "Mississippi", gasoline: 0.244, diesel: 0.244 },
  { name: "Missouri", gasoline: 0.2999, diesel: 0.2999 },
  { name: "Montana", gasoline: 0.3375, diesel: 0.305 },
  { name: "Nebraska", gasoline: 0.327, diesel: 0.321 },
  { name: "Nevada", gasoline: 0.23805, diesel: 0.2775 },
  { name: "New Hampshire", gasoline: 0.23746, diesel: 0.23746 },
  { name: "New Jersey", gasoline: 0.4915, diesel: 0.5615 },
  { name: "New Mexico", gasoline: 0.18875, diesel: 0.22875 },
  { name: "New York", gasoline: 0.241774, diesel: 0.223774 },
  { name: "North Carolina", gasoline: 0.4125, diesel: 0.4125 },
  { name: "North Dakota", gasoline: 0.23025, diesel: 0.23025 },
  { name: "Ohio", gasoline: 0.385, diesel: 0.47 },
  { name: "Oklahoma", gasoline: 0.2, diesel: 0.2 },
  { name: "Oregon", gasoline: 0.4, diesel: 0.4 },
  { name: "Pennsylvania", gasoline: 0.587, diesel: 0.741 },
  { name: "Rhode Island", gasoline: 0.4112, diesel: 0.4112 },
  { name: "South Carolina", gasoline: 0.2875, diesel: 0.2875 },
  { name: "South Dakota", gasoline: 0.3, diesel: 0.3 },
  { name: "Tennessee", gasoline: 0.274, diesel: 0.284 },
  { name: "Texas", gasoline: 0.2, diesel: 0.2 },
  { name: "Utah", gasoline: 0.3855, diesel: 0.3855 },
  { name: "Vermont", gasoline: 0.3126, diesel: 0.33 },
  { name: "Virginia", gasoline: 0.424, diesel: 0.435 },
  { name: "Washington", gasoline: 0.60169, diesel: 0.63169 },
  { name: "West Virginia", gasoline: 0.357, diesel: 0.357 },
  { name: "Wisconsin", gasoline: 0.329, diesel: 0.329 },
  { name: "Wyoming", gasoline: 0.24, diesel: 0.24 },
  { name: "American Samoa", gasoline: 0.35, diesel: 0.35 },
  { name: "Guam", gasoline: 0.19, diesel: 0.18 },
  { name: "Northern Mariana Islands", gasoline: 0.15, diesel: 0.15 },
  { name: "Puerto Rico", gasoline: 0.529, diesel: 0.26 },
  { name: "U.S. Virgin Islands", gasoline: 0.14, diesel: 0.14 },
];

export function stateTax(name: string, fuel: FuelTax): number {
  const row = STATE_TAXES.find((item) => item.name === name);
  if (!row) throw new Error("that state is not in the July 2026 table");
  return row[fuel];
}

/**
 * Los Angeles dock minus the Gulf dock.
 * Median weekly gap, 2015 through June 2025, March–May 2020 left out.
 * Gasoline is reformulated Los Angeles minus Gulf conventional.
 * Diesel is Los Angeles CARB diesel minus Gulf ultra-low sulfur.
 * It wanders. This is the middle, not a law.
 */
export const CALIFORNIA_DOCK = {
  gasoline: 0.189,
  diesel: 0.087,
} as const;

/** Same Gulf sign, this state's tax. California also pays its own dock. */
export function stateSign(
  gulfSign: number,
  fuel: FuelTax,
  stateName: string,
  californiaDock: number,
): number {
  const dock = stateName === "California" ? californiaDock : 0;
  return pumpWithStateTax(gulfSign, STATION.state, stateTax(stateName, fuel)) + dock;
}

/** Same gallons. Only the state tax changes. */
export function pumpWithStateTax(gulfSign: number, gulfTax: number, stateTaxDollars: number): number {
  if (gulfSign < 0 || gulfTax < 0 || stateTaxDollars < 0) throw new Error("a tax swap cannot start from a negative");
  return gulfSign - gulfTax + stateTaxDollars;
}
