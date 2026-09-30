/**
 * Where the bill gets a state's gasoline.
 * A filed pipeline rate is named only where that tariff names a place.
 */
import { PIPE } from "./freight.ts";
import { refineriesIn } from "./refineries.ts";
import { regionOf } from "./region.ts";
import { STATE_TAXES } from "./states.ts";
import { crudeBehindTheLag, wholesaleOnTheBill } from "./voyage.ts";

/** U.S. refinery yield, 2023. Gallons out of a 42-gallon barrel. */
export const BARREL = {
  year: 2023,
  gallonsIn: 42,
  gasolineGallons: 19.57,
  distillateGallons: 12.47,
  totalProductGallons: 44.65,
} as const;

/** Share of a finished gallon that is ethanol, the usual pump blend. Not half. */
export const ETHANOL_IN_THE_GALLON = 0.1;

/** Finished motor gasoline moving between regions in 2025, thousand barrels. Pipeline, tanker, and barge, one total. */
export const FINISHED_RECEIPTS_2025 = {
  eastFromGulf: 22_560,
  eastFromMidwest: 10_487,
  midwestFromGulf: 6_603,
  midwestFromRockies: 5_464,
  midwestFromEast: 923,
  gulfFromMidwest: 1_511,
  westFromRockies: 1_027,
} as const;

/** Fuel ethanol shipped out of the Midwest in 2025, thousand barrels. */
export const ETHANOL_FROM_MIDWEST_2025 = {
  east: 112_950,
  gulf: 81_917,
  rockies: 5_983,
  west: 47_521,
} as const;

export type SourceRow = {
  state: string;
  refineries: string;
  region: string;
  where: string;
  crude: string;
  transport: string;
};

function filedCents(dollars: number): string {
  return `${Math.round(dollars * 100)}¢`;
}

export function transportFor(state: string): string {
  if (regionOf(state).id === "east") {
    return `Houston to Linden, ${filedCents(PIPE.houstonToLinden)} a gallon. Colonial reaches Greensboro, then Linden. Gasoline takes 14 days and 16 hours.`;
  }
  if (state === "Alabama") {
    return `Houston to Birmingham, ${filedCents(PIPE.houstonToBirmingham)} a gallon. A filed rate for that city, not the state average, and not added.`;
  }
  return "Not published.";
}

export function sourceFor(state: string): SourceRow {
  const region = regionOf(state);
  const plants = refineriesIn(state);
  return {
    state,
    refineries: plants.length === 0 ? "None" : String(plants.length),
    region: region.name,
    where: wholesaleOnTheBill(state),
    crude: crudeBehindTheLag(state),
    transport: transportFor(state),
  };
}

const OUTSIDE_THE_REGIONS = new Set([
  "American Samoa",
  "Guam",
  "Northern Mariana Islands",
  "Puerto Rico",
  "U.S. Virgin Islands",
]);

export function sourceRows(): SourceRow[] {
  return STATE_TAXES.filter((row) => !OUTSIDE_THE_REGIONS.has(row.name)).map((row) => sourceFor(row.name));
}

export function barrelGasolineShare(): number {
  return BARREL.gasolineGallons / BARREL.gallonsIn;
}
