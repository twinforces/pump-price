/**
 * Regular gasoline, station average, September 28, 2026.
 * AAA, republished as a state table. Not GasBuddy. GasBuddy does not publish this file.
 * AAA's feed is card transactions, so this is the credit price. There is no cash column.
 * The federal weekly survey asks for the cash price, unless the station takes only cards.
 * Where that weekly survey overlaps, Texas is the same number, $3.92.
 */
export type StationSurvey = { state: string; regular: number };

export const SURVEY_AS_OF = "September 28, 2026";

export const STATION_SURVEY: readonly StationSurvey[] = [
  { state: "California", regular: 6.37 },
  { state: "Hawaii", regular: 5.57 },
  { state: "Washington", regular: 5.53 },
  { state: "Nevada", regular: 5.47 },
  { state: "Oregon", regular: 5.07 },
  { state: "Alaska", regular: 5.06 },
  { state: "Idaho", regular: 4.99 },
  { state: "Utah", regular: 4.94 },
  { state: "Arizona", regular: 4.81 },
  { state: "Illinois", regular: 4.78 },
  { state: "Michigan", regular: 4.67 },
  { state: "Montana", regular: 4.59 },
  { state: "Pennsylvania", regular: 4.54 },
  { state: "New Mexico", regular: 4.52 },
  { state: "Wyoming", regular: 4.51 },
  { state: "District of Columbia", regular: 4.50 },
  { state: "Connecticut", regular: 4.50 },
  { state: "New York", regular: 4.49 },
  { state: "Vermont", regular: 4.45 },
  { state: "Maine", regular: 4.43 },
  { state: "Massachusetts", regular: 4.39 },
  { state: "New Jersey", regular: 4.38 },
  { state: "Rhode Island", regular: 4.38 },
  { state: "New Hampshire", regular: 4.37 },
  { state: "Maryland", regular: 4.37 },
  { state: "West Virginia", regular: 4.36 },
  { state: "Delaware", regular: 4.35 },
  { state: "Florida", regular: 4.34 },
  { state: "Nebraska", regular: 4.34 },
  { state: "Minnesota", regular: 4.33 },
  { state: "Ohio", regular: 4.32 },
  { state: "Wisconsin", regular: 4.31 },
  { state: "Iowa", regular: 4.26 },
  { state: "South Dakota", regular: 4.26 },
  { state: "North Dakota", regular: 4.25 },
  { state: "Virginia", regular: 4.22 },
  { state: "Colorado", regular: 4.20 },
  { state: "Georgia", regular: 4.19 },
  { state: "Missouri", regular: 4.17 },
  { state: "North Carolina", regular: 4.14 },
  { state: "Kansas", regular: 4.14 },
  { state: "Oklahoma", regular: 4.12 },
  { state: "Kentucky", regular: 4.12 },
  { state: "South Carolina", regular: 4.10 },
  { state: "Alabama", regular: 4.08 },
  { state: "Tennessee", regular: 4.04 },
  { state: "Arkansas", regular: 4.03 },
  { state: "Louisiana", regular: 4.02 },
  { state: "Mississippi", regular: 4.00 },
  { state: "Texas", regular: 3.92 },
  { state: "Indiana", regular: 3.88 }
];

export function stationRegular(state: string): number {
  const row = STATION_SURVEY.find((item) => item.state === state);
  if (!row) throw new Error("that state is not in the September 28 survey");
  return row.regular;
}

/** AAA diesel, September 28, 2026. Same day as the gasoline survey. National average $6.45. */
export const DIESEL_SURVEY: Readonly<Record<string, number>> = {
  Alabama: 6.08,
  Alaska: 6.63,
  Arizona: 6.37,
  Arkansas: 6.09,
  California: 8.4,
  Colorado: 6.1,
  Connecticut: 6.5,
  Delaware: 6.45,
  "District of Columbia": 6.5,
  Florida: 6.07,
  Georgia: 6.25,
  Hawaii: 7.15,
  Idaho: 6.61,
  Illinois: 6.79,
  Indiana: 6.88,
  Iowa: 6.17,
  Kansas: 6.18,
  Kentucky: 6.32,
  Louisiana: 5.95,
  Maine: 6.51,
  Maryland: 6.48,
  Massachusetts: 6.39,
  Michigan: 6.77,
  Minnesota: 6.27,
  Mississippi: 5.99,
  Missouri: 6.27,
  Montana: 6.27,
  Nebraska: 6.14,
  Nevada: 6.8,
  "New Hampshire": 6.41,
  "New Jersey": 6.43,
  "New Mexico": 6.21,
  "New York": 6.51,
  "North Carolina": 6.14,
  "North Dakota": 6.19,
  Ohio: 6.73,
  Oklahoma: 5.93,
  Oregon: 6.86,
  Pennsylvania: 6.59,
  "Rhode Island": 6.34,
  "South Carolina": 6.01,
  "South Dakota": 6.11,
  Tennessee: 6.15,
  Texas: 5.86,
  Utah: 6.56,
  Vermont: 6.43,
  Virginia: 6.36,
  Washington: 7.42,
  "West Virginia": 6.49,
  Wisconsin: 6.49,
  Wyoming: 6.23,
};

export function stationDiesel(state: string): number {
  const price = DIESEL_SURVEY[state];
  if (price === undefined) throw new Error("that state is not in the September 28 diesel survey");
  return price;
}

/** The Texas station gallon, with this state's tax in place of Texas's 20 cents. */
export function taxSwapFromTexas(stateTaxDollars: number): number {
  if (stateTaxDollars < 0) throw new Error("a tax cannot be negative");
  return stationRegular("Texas") - 0.2 + stateTaxDollars;
}
