import { refineriesIn } from "./refineries.ts";
import { regionOf } from "./region.ts";

/**
 * Where a state's crude was, in days, before this week's barrel.
 * Shares are of the crude the refineries ran in 2025, not of the imports alone.
 * Imports are EIA, by the district that processed them. Inputs are refinery net input of crude.
 * A day count is a sailing or a pipeline estimate. It is not a filed schedule.
 * Domestic crude in that district is already there.
 */
export type VoyageLeg = { source: string; share: number; days: number };

export type VoyageId = "california" | "washington" | "east" | "midwest" | "gulf" | "rockies" | "alaska" | "hawaii";

export type ImportTravel = Record<VoyageId, number>;

/** California, 2025 West Coast run of 2,057,000 barrels a day. Imports are June 2026. The rest was already there. */
const CALIFORNIA_NAMED: readonly VoyageLeg[] = [
  { source: "California", share: 250 / 2057, days: 0 },
  { source: "Alaska", share: 444 / 2057, days: 6 },
  { source: "Canada", share: 390 / 2057, days: 10 },
  { source: "Ecuador", share: 172 / 2057, days: 10 },
  { source: "Panama", share: 230 / 2057, days: 21 },
  { source: "Iraq", share: 17 / 2057, days: 35 },
];
export const CALIFORNIA_VOYAGE: readonly VoyageLeg[] = [
  ...CALIFORNIA_NAMED,
  {
    source: "Already there",
    share: 1 - CALIFORNIA_NAMED.reduce((sum, leg) => sum + leg.share, 0),
    days: 0,
  },
];

/** Washington, 2025. Ecology publication 26-08-001. Oregon's fuel is refined there. */
const VESSEL = 0.43;
const Q4_VESSEL = 19596867;
export const WASHINGTON_VOYAGE: readonly VoyageLeg[] = [
  { source: "Alaska", share: VESSEL * (16251867 / Q4_VESSEL), days: 4 },
  { source: "Canada", share: 0.37 + VESSEL * (440000 / Q4_VESSEL), days: 10 },
  { source: "Bakken", share: 0.2, days: 4 },
  { source: "Panama", share: VESSEL * ((1365000 + 665000 + 460000) / Q4_VESSEL), days: 21 },
  { source: "United Arab Emirates", share: VESSEL * (415000 / Q4_VESSEL), days: 35 },
];

const EAST_RUN = 274928;
/** About 50,000 barrels a day. April 2025 field production, carried across the year. */
const EAST_LOCAL = 18250;
/** Thousand barrels, 2025, East Coast imports by district of processing. */
const EAST_IMPORTS: readonly { source: string; barrels: number; days: number }[] = [
  { source: "Canada", barrels: 38402, days: 7 },
  { source: "Nigeria", barrels: 47146, days: 14 },
  { source: "Saudi Arabia", barrels: 28414, days: 30 },
  { source: "Libya", barrels: 19271, days: 14 },
  { source: "Guyana", barrels: 12007, days: 10 },
  { source: "Colombia", barrels: 8313, days: 8 },
  { source: "Angola", barrels: 7867, days: 16 },
  { source: "Gabon", barrels: 6405, days: 16 },
  { source: "Kazakhstan", barrels: 6061, days: 16 },
  { source: "Venezuela", barrels: 4002, days: 8 },
  { source: "Ghana", barrels: 3824, days: 16 },
  { source: "Algeria", barrels: 3122, days: 14 },
  { source: "Iraq", barrels: 2411, days: 30 },
  { source: "Congo", barrels: 1689, days: 16 },
  { source: "Cameroon", barrels: 958, days: 16 },
  { source: "Argentina", barrels: 887, days: 21 },
  { source: "Ivory Coast", barrels: 671, days: 16 },
  { source: "Tunisia", barrels: 653, days: 14 },
  { source: "Ecuador", barrels: 621, days: 21 },
];

const GULF_RUN = 3284885;
/** Thousand barrels, 2025. Gulf Coast imports by district of processing. */
const GULF_IMPORTS: readonly { source: string; barrels: number; days: number }[] = [
  { source: "Canada", barrels: 151798, days: 18 },
  { source: "Mexico", barrels: 126193, days: 3 },
  { source: "Colombia", barrels: 51690, days: 5 },
  { source: "Saudi Arabia", barrels: 47111, days: 35 },
  { source: "Venezuela", barrels: 47031, days: 5 },
  { source: "Guyana", barrels: 21837, days: 7 },
  { source: "Brazil", barrels: 17369, days: 14 },
  { source: "Iraq", barrels: 11966, days: 35 },
  { source: "United Kingdom", barrels: 9884, days: 18 },
  { source: "Trinidad", barrels: 8332, days: 5 },
  { source: "Kuwait", barrels: 4934, days: 35 },
  { source: "Angola", barrels: 2863, days: 18 },
  { source: "Senegal", barrels: 1910, days: 16 },
  { source: "Norway", barrels: 1544, days: 18 },
  { source: "Argentina", barrels: 962, days: 21 },
  { source: "Ecuador", barrels: 738, days: 21 },
  { source: "Peru", barrels: 727, days: 21 },
  { source: "Guatemala", barrels: 622, days: 3 },
];

const MIDWEST_RUN = 1442537;
const MIDWEST_CANADA = 1004707;
const ROCKIES_RUN = 221634;
const ROCKIES_CANADA = 97656;

function fromImports(
  run: number,
  local: { source: string; barrels: number; days: number } | null,
  imports: readonly { source: string; barrels: number; days: number }[],
  otherDays: number,
): VoyageLeg[] {
  const named = imports.reduce((sum, row) => sum + row.barrels, 0);
  const localBarrels = local?.barrels ?? 0;
  const other = run - localBarrels - named;
  const legs: VoyageLeg[] = [];
  if (local && localBarrels > 0) legs.push({ source: local.source, share: localBarrels / run, days: local.days });
  for (const row of imports) legs.push({ source: row.source, share: row.barrels / run, days: row.days });
  if (other > run * 0.001) legs.push({ source: "Already there", share: other / run, days: 0 });
  else if (other < -run * 0.001) legs.push({ source: "Other", share: 0, days: otherDays });
  return legs;
}

function eastVoyage(): VoyageLeg[] {
  const named = EAST_IMPORTS.reduce((sum, row) => sum + row.barrels, 0);
  const imported = 218725;
  const rows = [...EAST_IMPORTS];
  if (imported - named > EAST_RUN * 0.001) rows.push({ source: "Other", barrels: imported - named, days: 16 });
  const fromGulf = EAST_RUN - EAST_LOCAL - imported;
  if (fromGulf > 0) rows.push({ source: "Gulf", barrels: fromGulf, days: 6 });
  return fromImports(EAST_RUN, { source: "Appalachia", barrels: EAST_LOCAL, days: 0 }, rows, 16);
}

/** Hawaii publishes no slate. These are the named West Coast waterborne legs, without California's wells. */
function hawaiiVoyage(): VoyageLeg[] {
  const water = CALIFORNIA_VOYAGE.filter((leg) => leg.days > 0);
  const sum = water.reduce((total, leg) => total + leg.share, 0);
  return water.map((leg) => ({ source: leg.source, share: leg.share / sum, days: leg.days }));
}

export const VOYAGES: Record<VoyageId, readonly VoyageLeg[]> = {
  california: CALIFORNIA_VOYAGE,
  washington: WASHINGTON_VOYAGE,
  east: eastVoyage(),
  midwest: fromImports(MIDWEST_RUN, null, [{ source: "Canada", barrels: MIDWEST_CANADA, days: 14 }], 14),
  gulf: fromImports(GULF_RUN, null, GULF_IMPORTS, 18),
  rockies: fromImports(ROCKIES_RUN, null, [{ source: "Canada", barrels: ROCKIES_CANADA, days: 7 }], 7),
  alaska: [{ source: "Alaska", share: 1, days: 0 }],
  hawaii: hawaiiVoyage(),
};

/**
 * The crude diet of the refineries that make this state's fuel.
 * No refinery in the state means the gallon was made on the Gulf, which is the trip those plants already use.
 * Oregon is the exception. Its gallon is made on Puget Sound.
 */
export function voyageFor(state: string): VoyageId {
  if (state === "California") return "california";
  if (state === "Oregon" || state === "Washington") return "washington";
  if (state === "Alaska") return "alaska";
  if (state === "Hawaii") return "hawaii";
  if (refineriesIn(state).length === 0) return "gulf";
  const id = regionOf(state).id;
  if (id === "east") return "east";
  if (id === "midwest") return "midwest";
  if (id === "rockies") return "rockies";
  return "gulf";
}

const CRUDE_DIET: Record<VoyageId, string> = {
  california: "California mix. Local wells, Alaska, Canada, and barrels through Panama.",
  washington: "Puget Sound mix. Alaska, Canada, Bakken, and a little through Panama.",
  east: "East Coast mix. Local Appalachia, imports, and Gulf crude.",
  midwest: "Midwest mix. Mostly Canadian crude, about two weeks in the pipe.",
  gulf: "Gulf mix. Domestic crude already there, plus Canada, Mexico, and the Atlantic.",
  rockies: "Rockies mix. About half Canadian, about a week in the pipe.",
  alaska: "Alaska. Pumped in the state.",
  hawaii: "West Coast waterborne mix, without California's wells.",
};

/** Where the bill's wholesale price comes from. Same rule as the invoice. */
export function wholesaleOnTheBill(state: string): string {
  if (state === "California") return "Los Angeles spot.";
  if (state === "Oregon") return "Puget Sound, the same wholesale as Washington. The Olympic pipe to Portland is about 3 cents a gallon and is not on the bill.";
  if (state === "Washington") return "Puget Sound refiners. The oil line is West Coast crude.";
  if (regionOf(state).id === "east") return "New York harbor. Colonial from Houston. Gasoline is about 15 days. Diesel is about 19.";
  if (regionOf(state).id === "gulf") return "Gulf dock, this week.";
  if (refineriesIn(state).length === 0) return "Gulf dock from about 15 days earlier for gasoline and 19 for diesel.";
  if (regionOf(state).id === "rockies") return "This week's Gulf crack. The oil line is Rockies crude, $5.17 a barrel under the Gulf.";
  if (regionOf(state).id === "midwest") return "This week's Gulf crack. The oil line is Midwest crude, $2.10 a barrel under the Gulf.";
  return "This week's Gulf crack, plus the West Coast crude premium.";
}

export function crudeBehindTheLag(state: string): string {
  return CRUDE_DIET[voyageFor(state)];
}

/** Weighted days the crude spent getting to the refinery that makes this state's fuel. */
export function crudeLagDays(state: string): number {
  const legs = VOYAGES[voyageFor(state)];
  const weighted = legs.reduce((sum, leg) => sum + Math.max(0, leg.share) * leg.days, 0);
  return Math.round(weighted);
}

/**
 * Days the finished gallon spends after the refinery, before a station can take it.
 * The East Coast and a state with no refinery are on the Gulf-to-market pipe, about 15 days.
 * Oregon's gallon is already the Puget Sound wholesale. A refinery in the state is already there.
 */
export function productLagDays(state: string, fuel: "gasoline" | "diesel" = "gasoline"): number {
  const pipe = fuel === "diesel" ? 19 : 15;
  if (regionOf(state).id === "east") return pipe;
  if (state === "Oregon" || refineriesIn(state).length > 0) return 0;
  const id = regionOf(state).id;
  if (id === "midwest" || id === "rockies" || id === "west") return pipe;
  return 0;
}
