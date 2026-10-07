import { STATE_TAXES } from "./states.ts";

export type SurveyCache = {
  asOf: string;
  gasoline: { state: string; regular: number }[];
  diesel: Record<string, number>;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TERRITORIES = new Set([
  "American Samoa",
  "Guam",
  "Northern Mariana Islands",
  "Puerto Rico",
  "U.S. Virgin Islands",
]);

/** Fifty states and the District. The territories are on the tax table and not on this map. */
function statesOnTheMap(): Set<string> {
  return new Set(STATE_TAXES.map((row) => row.name).filter((name) => !TERRITORIES.has(name)));
}

/** "9/30/26" from the AAA page, as a date a person can read. */
export function aaaDate(raw: string): string {
  const match = raw.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (!match) throw new Error("the station survey date is not a date");
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = match[3].length === 2 ? 2000 + Number(match[3]) : Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) throw new Error("the station survey date is not a date");
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

function dollars(raw: string): number {
  const value = Number(raw.replace(/[$,]/g, ""));
  if (!Number.isFinite(value) || value <= 0) throw new Error("a station price is not a price");
  return value;
}

/** One row from the AAA state table: name, regular, diesel. Mid-grade and premium are ignored. */
export function surveyFromAaaRows(date: string, rows: readonly (readonly string[])[]): SurveyCache {
  const expected = statesOnTheMap();
  const gasoline: SurveyCache["gasoline"] = [];
  const diesel: Record<string, number> = {};
  for (const row of rows) {
    const state = row[0]?.trim();
    if (!state || !expected.has(state)) throw new Error(`the station survey has a name this app does not: ${state}`);
    gasoline.push({ state, regular: dollars(row[1] ?? "") });
    diesel[state] = dollars(row[4] ?? "");
  }
  if (gasoline.length !== expected.size) throw new Error("the station survey is not all 51");
  gasoline.sort((a, b) => a.state.localeCompare(b.state));
  return { asOf: aaaDate(date), gasoline, diesel };
}
