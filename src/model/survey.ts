/**
 * The station survey shipped with this build.
 * scripts/pull-wednesday.ts writes survey-cache.json from the AAA state table.
 * Card transactions, so this is the credit price. There is no cash column.
 */
import cache from "./survey-cache.json" with { type: "json" };

export type StationSurvey = { state: string; regular: number };

export const SURVEY_AS_OF = cache.asOf;

export const STATION_SURVEY: readonly StationSurvey[] = cache.gasoline;

export function stationRegular(state: string): number {
  const row = STATION_SURVEY.find((item) => item.state === state);
  if (!row) throw new Error("that state is not in the station survey");
  return row.regular;
}

/** Same day as the gasoline survey. */
export const DIESEL_SURVEY: Readonly<Record<string, number>> = cache.diesel;

export function stationDiesel(state: string): number {
  const price = DIESEL_SURVEY[state];
  if (price === undefined) throw new Error("that state is not in the diesel survey");
  return price;
}

/** The Texas station gallon, with this state's tax in place of Texas's 20 cents. */
export function taxSwapFromTexas(stateTaxDollars: number): number {
  if (stateTaxDollars < 0) throw new Error("a tax cannot be negative");
  return stationRegular("Texas") - 0.2 + stateTaxDollars;
}
