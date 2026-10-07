/**
 * A state's own gasoline invoice. Not a Gulf bill with the tax swapped.
 * Oil is that region's crude, not the Gulf barrel, except on the Gulf.
 * Refining is a dock only where one is published: Gulf, New York, Los Angeles.
 * A haul is a line only where a filed rate names a place.
 * A recipe is a line of money only where a state published the cents.
 * Anything else is named and left unpublished. The pump is the sum of the lines.
 * It is not forced to the station survey.
 */
import { CALIFORNIA_MONTHS, SALES_SHARE } from "./california-history.ts";
import { ETHANOL_SHARE } from "./ethanol.ts";
import { CRUDE_PREMIUM, ordinaryHarborCrack, regionalBarrel } from "./haul.ts";
import { PIPE } from "./freight.ts";
import { recipeFor } from "./recipes.ts";
import { refineriesIn } from "./refineries.ts";
import { regionOf } from "./region.ts";
import { STATION } from "./station.ts";
import { stateTax } from "./states.ts";
import { flat, priceTerm, scaleTerm, sumTerms, type Term } from "./term.ts";
import { TRUCK_SKETCH, truckInvoiceLines } from "./truck-miles.ts";
import { voyageFor, type ImportTravel } from "./voyage.ts";

export type { ImportTravel };

/** Iowa plant price, USDA week ending September 25, 2026. Used when no plant price was passed in. */
export const IOWA_ETHANOL = 1.96;

/** The crude price nearest that many days before the latest week. A short hop stays on this week's barrel. */
export function crudeDaysAgo(
  weeks: readonly { date: string; value: number }[],
  today: string,
  todayPrice: number,
  days: number,
): number {
  if (!Number.isFinite(days) || days <= 0) return todayPrice;
  const end = Date.parse(today);
  let bestAge = 0;
  let bestValue = todayPrice;
  let bestDist = days;
  for (const row of weeks) {
    const age = (end - Date.parse(row.date)) / 86400000;
    if (!Number.isFinite(age) || age < 1 || !Number.isFinite(row.value)) continue;
    const dist = Math.abs(age - days);
    if (dist < bestDist || (dist === bestDist && age < bestAge)) {
      bestAge = age;
      bestValue = row.value;
      bestDist = dist;
    }
  }
  return bestValue;
}

/** Dollars a gallon. Negative when the mix that arrived was cheaper than this week's barrel. */
export function importTravelPerGallon(
  legs: readonly { share: number; days: number }[],
  todayPrice: number,
  priceDaysAgo: (days: number) => number,
): number {
  let gap = 0;
  for (const leg of legs) gap += leg.share * (priceDaysAgo(leg.days) - todayPrice);
  return gap / STATION.gallonsPerBarrel;
}

function dollarsOrNothing(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function travelFor(state: string, travel: ImportTravel | null): number | null {
  if (travel == null) return null;
  if (typeof travel === "number") return dollarsOrNothing(travel);
  return dollarsOrNothing(travel[voyageFor(state)]);
}

/** The arrived crude was not this week's barrel. Refining moves the other way, so the wholesale price does not. */
function withTravel(parts: Term[], state: string, travel: ImportTravel | null): Term[] {
  const dollars = travelFor(state, travel);
  if (dollars === null) return parts;
  if (parts.some((term) => term.label === "Import pricing lag")) return parts;
  const refining = parts.findIndex((term) => term.label.startsWith("Refiner profit"));
  if (refining === -1) return parts;
  const next = parts.slice();
  const term = next[refining];
  next[refining] = { ...term, constant: term.constant - dollars };
  next.splice(refining, 0, flat("Import pricing lag", dollars));
  return next;
}

/** The federal credit sits inside the wholesale price. Naming it does not add it again. */
function withCoupon(parts: Term[]): Term[] {
  if (parts.some((term) => term.label === "Renewable fuel credit")) return parts;
  const refining = parts.findIndex((term) => term.label.startsWith("Refiner profit"));
  if (refining === -1) return parts;
  const next = parts.slice();
  const term = next[refining];
  next[refining] = { ...term, constant: term.constant - RENEWABLE_FUEL_CREDIT };
  next.splice(refining + 1, 0, flat("Renewable fuel credit", RENEWABLE_FUEL_CREDIT));
  return next;
}

/** The plant's cost and its wearing out were inside the refining line. Naming them does not add them again. */
function withPlant(parts: Term[]): Term[] {
  if (parts.some((term) => term.label === "Running the refinery")) return parts;
  const refining = parts.findIndex((term) => term.label.startsWith("Refiner profit"));
  if (refining === -1) return parts;
  const next = parts.slice();
  const term = next[refining];
  next[refining] = { ...term, constant: term.constant - REFINERY_CASH_COST - REFINERY_DEPRECIATION };
  next.splice(
    refining,
    0,
    flat("Running the refinery", REFINERY_CASH_COST),
    flat("Refinery depreciation", REFINERY_DEPRECIATION),
  );
  return next;
}

/**
 * Rail from the Midwest plant to the terminal, tenth of a gallon.
 * 2013 rates: about 13 cents a gallon of ethanol to the East, 14 to the Gulf, about 20 to the West Coast.
 * On the gasoline gallon that is 1 cent, or 2 cents in the West and California.
 */
export function ethanolFreight(state: string): number {
  const region = regionOf(state).id;
  return region === "west" || region === "california" ? 0.02 : 0.01;
}

function withEthanolFreight(parts: Term[], state: string): Term[] {
  if (parts.some((term) => term.label === "Ethanol freight")) return parts;
  const refining = parts.findIndex((term) => term.label.startsWith("Refiner profit"));
  if (refining === -1) return parts;
  const dollars = ethanolFreight(state);
  const next = parts.slice();
  const term = next[refining];
  next[refining] = { ...term, constant: term.constant - dollars };
  next.splice(refining, 0, flat("Ethanol freight", dollars));
  return next;
}
function withCaliforniaRecipe(parts: Term[]): Term[] {
  if (parts.some((term) => term.label === "California recipe")) return parts;
  const refining = parts.findIndex((term) => term.label.startsWith("Refiner profit"));
  if (refining === -1) return parts;
  const next = parts.slice();
  const term = next[refining];
  next[refining] = { ...term, constant: term.constant - CALIFORNIA_RECIPE };
  next.splice(refining, 0, flat("California recipe", CALIFORNIA_RECIPE));
  return next;
}

/** Los Angeles gasoline minus Gulf gasoline, after California's crude is already its own line. */
function withDockGap(parts: Term[], gap: number | null): Term[] {
  if (gap === null || Math.round(gap * 100) === 0 || parts.some((term) => term.label === "Los Angeles over the Gulf")) return parts;
  const refining = parts.findIndex((term) => term.label.startsWith("Refiner profit"));
  if (refining === -1) return parts;
  const next = parts.slice();
  const term = next[refining];
  next[refining] = { ...term, constant: term.constant - gap };
  next.splice(refining, 0, flat("Los Angeles over the Gulf", gap));
  return next;
}
const OREGON_CLEAN_FUELS = 0.0935;
const WASHINGTON_CLEAN_FUEL = 0.0059;
/**
 * Renewable Fuel Standard credits, 2026.
 * About 34 cents a gallon. US Oil & Gas Association, October 6, 2026.
 * The Institute for Energy Research put the same stack near 37 cents in August 2026:
 * a credit around $2.40 times a 15.5 percent obligation.
 * It is not the ethanol in the gallon. It comes out of refining, so the pump does not change.
 */
export const RENEWABLE_FUEL_CREDIT = 0.34;
/**
 * Valero refining segment, second quarter 2026, per barrel of throughput.
 * Cash operating cost $4.70, which is 11 cents a gallon. A year earlier it was $4.91.
 * Depreciation $2.36, which is 6 cents a gallon.
 * What they kept was $16.56 this quarter and $4.78 a year earlier, so that part is not a fixed line.
 * Both come out of refining. The pump does not change.
 */
export const REFINERY_CASH_COST = 0.11;
export const REFINERY_DEPRECIATION = 0.06;
/**
 * Extra cost of California's blend versus ordinary gasoline.
 * Michael A. Mische, University of Southern California, May 5, 2025: 15 cents for the 2024 standard.
 * The Air Resources Board's original range, from the refiners, was 5 to 15 cents.
 * It is not the gap between Los Angeles and the Gulf. Gasoline only. It comes out of refining.
 */
export const CALIFORNIA_RECIPE = 0.15;
/** California diesel sales tax, July 1, 2026 through June 30, 2027. Gasoline is 2.25 percent. District tax is extra. */
const CALIFORNIA_DIESEL_SALES = 0.13;
/** California diesel excise, July 1, 2026. Not the 92.94 cent bundle. */
const CALIFORNIA_DIESEL_EXCISE = 0.482;
/** California underground tank fee. Two cents a gallon of petroleum put in the tank. Diesel pays it too. */
const CALIFORNIA_TANK_FEE = 0.02;
/** Gulf refiner wholesale minus the Gulf spot. Median month, 2015 through 2019, and still the median through March 2022. 87 percent of the calm months were inside 5 cents. */
export const GULF_WHOLESALE_OVER_SPOT = 0.01;

/** Three percent of the sale. The high end of what a processor charges, used so the bill is not low. */
export const CARD_RATE = 0.03;
/** Injected at the rack. The published bound is under a cent. This line is half a cent. */
export const DETERGENT = 0.005;
const CARD_NOTE = "Card fees are 3 percent of the sale.";
const SMOKES_NOTE =
  "Smokes and Natties are the inside counter. Cigarettes, and Natural Light. They can cover the rent when the sign is below the bill of lading. That subsidy is not a line.";
export const STATION_COSTS = {
  terminalToStation: 0.06,
  store: 0.06,
  building: 0.02,
} as const;

const DIESEL_TURN = 2;
export const STATION_PROFIT = 0.1;

export type StateLine = Term & { cents: number };

export type StateInvoice = {
  lines: StateLine[];
  totalCents: number;
  /** Sum of the lines, before display rounding. */
  aggregate: Term;
  unpublished: string[];
};

function californiaOtherDistribution(): number {
  return median(
    CALIFORNIA_MONTHS.map(
      (month) =>
        month.distribution -
        STATION_PROFIT -
        STATION_COSTS.terminalToStation -
        STATION_COSTS.store -
        STATION_COSTS.building,
    ),
  );
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function withCardRate(terms: Term[]): Term[] {
  const index = terms.findIndex((term) => term.label === "Card fees");
  if (index < 0) return terms;
  const base = sumTerms(terms.filter((term) => term.label !== "Card fees"));
  const next = terms.slice();
  next[index] = scaleTerm(base, CARD_RATE / (1 - CARD_RATE), "Card fees");
  return next;
}

function bill(
  terms: Term[],
  gulfBarrel: number,
  dieselPerGallon: number,
  unpublished: string[],
  salesShare: number | null = null,
): StateInvoice {
  const priced = withCardRate(terms);
  const lines: StateLine[] = priced.map((term) => ({
    ...term,
    cents: roundedCents(
      term.label,
      term.label.startsWith("Tanker surcharge")
        ? Math.max(0, priceTerm(term, gulfBarrel, dieselPerGallon))
        : priceTerm(term, gulfBarrel, dieselPerGallon),
    ),
  }));
  if (salesShare !== null) {
    const before = lines.reduce((sum, line) => sum + line.cents, 0);
    const totalCents = Math.round(before / (1 - salesShare));
    const tax = scaleTerm(sumTerms(priced), salesShare / (1 - salesShare), "State and local sales tax");
    lines.push({ ...tax, cents: totalCents - before });
    return { lines, totalCents, aggregate: sumTerms(lines), unpublished };
  }
  return {
    lines,
    totalCents: lines.reduce((sum, line) => sum + line.cents, 0),
    aggregate: sumTerms(priced),
    unpublished,
  };
}

/** EIA, rebuilt hydrotreater, highway diesel taken from 500 ppm sulfur to 15 ppm. About 5 cents. A new unit was about 6. */
export const ULSD_HYDROTREAT = 0.05;

/**
 * Diesel refining on the bill is gasoline's refining plus the hydrotreater.
 * The rest of the diesel wholesale, above that, is the market paying more for a scarce fuel.
 * The two lines add back to the old diesel refining line, so the pump does not move.
 */
export function applyDieselMarketFactor(diesel: StateInvoice, gasoline: StateInvoice): StateInvoice {
  const gas = gasoline.lines.find((line) => line.label.startsWith("Refiner profit"));
  const at = diesel.lines.findIndex((line) => line.label.startsWith("Refiner profit"));
  if (!gas || at < 0) return diesel;
  const current = diesel.lines[at];
  const refiningCents = Math.round(gas.cents);
  const hydroCents = Math.round(ULSD_HYDROTREAT * 100);
  const refining: StateLine = {
    label: current.label,
    constant: gas.constant,
    oil: gas.oil,
    diesel: gas.diesel,
    cents: refiningCents,
  };
  const hydro: StateLine = {
    label: "Hydrotreater",
    constant: ULSD_HYDROTREAT,
    oil: 0,
    diesel: 0,
    cents: hydroCents,
  };
  const market: StateLine = {
    label: "Market factor",
    constant: current.constant - refining.constant - ULSD_HYDROTREAT,
    oil: current.oil - refining.oil,
    diesel: current.diesel - refining.diesel,
    cents: current.cents - refiningCents - hydroCents,
  };
  const lines = diesel.lines.slice();
  lines.splice(at, 1, refining, hydro, market);
  return { ...diesel, lines };
}

function roundedCents(label: string, dollars: number): number {
  if (label.startsWith("Tanker") || label === "Detergent") return Math.round(dollars * 1000) / 10;
  return Math.round(dollars * 100);
}

function crudeTerm(premiumPerBarrel: number, share: number): Term {
  return {
    label: "Oil",
    constant: (share * premiumPerBarrel) / STATION.gallonsPerBarrel,
    oil: share / STATION.gallonsPerBarrel,
    diesel: 0,
  };
}

function crudeTransportLine(postedPerBarrel: number, crudeShare: number): Term {
  return flat("Crude transport", (crudeShare * postedPerBarrel) / STATION.gallonsPerBarrel);
}

function carriesCrudeTransport(state: string): boolean {
  if (refineriesIn(state).length === 0) return false;
  if (voyageFor(state) === "alaska") return false;
  return CRUDE_PREMIUM[regionOf(state).id] > 0;
}

/** The tenth of the gallon ethanol takes. A higher barrel makes this credit larger. */
function ethanolLines(premiumPerBarrel: number, plantPerGallon: number): Term[] {
  const full = crudeTerm(premiumPerBarrel, 1);
  return [
    {
      label: "Oil replaced by ethanol",
      constant: -ETHANOL_SHARE * full.constant,
      oil: -ETHANOL_SHARE * full.oil,
      diesel: 0,
    },
    flat("Ethanol, 10 percent", plantPerGallon * ETHANOL_SHARE),
  ];
}

/**
 * Refining, in dollars a gallon, is constant + oil × barrel.
 * Fit of the dock minus the barrel, weekly, 2015 through June 2025, March through May 2020 left out.
 * Gulf gasoline misses a typical week by 16 cents. Gulf diesel misses by 21 cents.
 */
export const REFINING_FIT = {
  gulfGasoline: { constant: -0.05717, oil: 0.00753948 },
  gulfDiesel: { constant: -0.353604, oil: 0.01432827 },
  losAngelesGasoline: { constant: 0.038742, oil: 0.0098315 },
  losAngelesDiesel: { constant: -0.264321, oil: 0.01442901 },
} as const;

function refiningTerm(label: string, premiumPerBarrel: number, crack: number, ethanolLine: number | null): Term {
  if (ethanolLine === null) return flat(label, crack);
  return {
    label,
    constant: (ETHANOL_SHARE * premiumPerBarrel) / STATION.gallonsPerBarrel + crack - ethanolLine,
    oil: ETHANOL_SHARE / STATION.gallonsPerBarrel,
    diesel: 0,
  };
}

function observedCrack(
  label: string,
  crackAtAnchor: number,
  anchor: number | null,
  barrel: number,
  slope: number,
  premiumPerBarrel: number,
  ethanolLine: number | null,
): Term {
  if (anchor === null) return refiningTerm(label, premiumPerBarrel, crackAtAnchor, ethanolLine);
  const leaned: Term = { label, constant: crackAtAnchor - slope * anchor, oil: slope, diesel: 0 };
  if (ethanolLine === null) return leaned;
  return {
    label,
    constant: (ETHANOL_SHARE * premiumPerBarrel) / STATION.gallonsPerBarrel + leaned.constant - ethanolLine,
    oil: ETHANOL_SHARE / STATION.gallonsPerBarrel + slope,
    diesel: 0,
  };
}

/** No refinery here. The gallon left the Gulf earlier. */
function leftTheGulf(state: string): boolean {
  if (state === "Oregon") return false;
  if (refineriesIn(state).length > 0) return false;
  const id = regionOf(state).id;
  return id === "midwest" || id === "rockies" || id === "west";
}

function fittedRefining(
  label: string,
  fit: { constant: number; oil: number },
  premiumPerBarrel: number,
  ethanolLine: number | null,
): Term {
  if (ethanolLine === null) return { label, constant: fit.constant, oil: fit.oil, diesel: 0 };
  return {
    label,
    constant: (ETHANOL_SHARE * premiumPerBarrel) / STATION.gallonsPerBarrel + fit.constant - ethanolLine,
    oil: ETHANOL_SHARE / STATION.gallonsPerBarrel + fit.oil,
    diesel: 0,
  };
}

function wholesaleTerm(parts: Term[]): Term {
  return sumTerms(
    parts.filter(
      (term) =>
        term.label === "Oil" ||
        term.label === "Oil replaced by ethanol" ||
        term.label === "Import pricing lag" ||
        term.label.startsWith("Refiner profit") ||
        term.label === "Running the refinery" ||
        term.label === "Refinery depreciation" ||
        term.label === "California recipe" ||
        term.label === "Los Angeles over the Gulf" ||
        term.label.startsWith("Pipeline") ||
        term.label === "Ethanol, 10 percent" ||
        term.label === "Ethanol freight" ||
        term.label === "Renewable fuel credit" ||
        term.label === "Refiner's sale over the spot",
    ),
    "wholesale",
  );
}

/**
 * Percentage taxes the July 2026 federal table leaves out of the state-tax total.
 * The base is the dock price on this bill, because each of these is a tax on the sale of the fuel, not on the pump.
 */
function knownOutsideTheStateTax(state: string, wholesale: Term): { lines: Term[]; notes: string[] } {
  const lines: Term[] = [];
  const notes: string[] = [];
  if (state === "Connecticut") {
    lines.push(scaleTerm(wholesale, 0.081, "Gross earnings tax, first sale"));
    notes.push("Connecticut taxes 8.1 percent of the first sale. That percent is not inside the state tax line. The base is the dock price on this bill, so this line picks up the oil coefficient of that dock.");
  } else if (state === "Delaware") {
    lines.push(scaleTerm(wholesale, 0.011902, "Hazardous substance tax"));
    notes.push("Delaware taxes 1.1902 percent of the sale of petroleum. That percent is not inside the state tax line. The base is the dock price on this bill, so this line picks up the oil coefficient of that dock.");
  } else if (state === "Ohio") {
    lines.push(scaleTerm(wholesale, 0.0065, "Petroleum activity tax"));
    notes.push("Ohio taxes 0.65 percent of the first sale out of the distribution system. That percent is not inside the state tax line. The base is the dock price on this bill, so this line picks up the oil coefficient of that dock.");
  } else if (state === "Washington") {
    lines.push(scaleTerm(wholesale, 0.003, "Petroleum products tax"));
    notes.push("Washington taxes 0.3 percent of the wholesale value. That percent is not inside the state tax line. The base is the dock price on this bill, so this line picks up the oil coefficient of that dock.");
  } else if (state === "New York") {
    lines.push(flat("State sales tax", 0.08));
    notes.push("New York's extra 8 cents is not inside the state tax line. The commuter-district rate is 8.75 cents, and counties add their own. Those are not on this bill.");
  } else if (state === "Hawaii") {
    notes.push("County fuel tax runs from 16.5 cents in Honolulu to 24 cents on Maui. It is not one number, so it is not a line.");
  }
  if (state !== "California") {
    notes.push("Tank fees and inspection fees that are charged by the gallon are already inside the state tax line. They are not added again.");
  }
  return { lines, notes };
}

const NEW_ENGLAND = new Set(["Connecticut", "Maine", "Massachusetts", "New Hampshire", "Rhode Island", "Vermont"]);

/** The gallon is priced at New York Harbor. Colonial is how that price got there. */
function fromTheHarbor(state: string): boolean {
  return regionOf(state).id === "east";
}

/**
 * Colonial, Houston to Greensboro, then the smaller line to Linden.
 * Gasoline is 14 days and 16 hours on the shipper schedule. Diesel is about 19 days.
 * The filed rate comes out of refining, so the wholesale price stays the harbor price.
 * The lag is how far the Gulf price moved during the trip.
 */
function harborDelivery(gulfCrack: number, laggedCrack: number | null): { lines: Term[]; takenFromRefining: number } {
  const lines: Term[] = [flat("Pipeline, Houston to Linden", PIPE.houstonToLinden)];
  let taken = PIPE.houstonToLinden;
  if (laggedCrack !== null) {
    lines.push(flat("Pipeline travel lag", laggedCrack - gulfCrack));
    taken += laggedCrack - gulfCrack;
  }
  return { lines, takenFromRefining: taken };
}

function contractNotes(state: string): string[] {
  if (!NEW_ENGLAND.has(state)) return [];
  return [
    "A New England contract can credit the cold. A gallon is defined at 60 degrees. Fuel delivered colder takes less room, so the gallons billed and the gallons in the tank are not the same number. That credit is in the contract. It is not a line.",
  ];
}

function haul(state: string): Term | null {
  if (state === "Alabama") return flat("Pipeline, Houston to Birmingham", PIPE.houstonToBirmingham);
  return null;
}

export function approximateStateInvoice(
  state: string,
  gulfBarrel: number,
  gulfCrack: number,
  losAngelesCrack: number | null,
  newYorkCrack: number | null,
  ethanolPerGallon: number | null,
  dieselPerGallon = 4,
  crackAnchor: number | null = null,
  laggedCrack: number | null = null,
  importTravel: ImportTravel | null = null,
): StateInvoice | null {
  if (gulfBarrel < 0) throw new Error("a barrel cannot be negative");
  if (ethanolPerGallon !== null && ethanolPerGallon < 0) throw new Error("ethanol cannot be negative");
  if (dieselPerGallon < 0) throw new Error("diesel price cannot be negative");
  const region = regionOf(state);
  const posted = CRUDE_PREMIUM[region.id];
  const carryTransport = carriesCrudeTransport(state);
  const premium = carryTransport ? 0 : posted;
  const ethanolPerGallonKnown = ethanolPerGallon;
  const unpublished: string[] = [CARD_NOTE, SMOKES_NOTE];
  if (ethanolPerGallonKnown === null) {
    unpublished.push("Ten percent of a gasoline gallon is ethanol. No plant price is on this bill, so the oil line is priced as if the whole gallon were crude. That overstates the oil.");
  }
  const recipe = recipeFor(state);
  const blend = ethanolPerGallonKnown === null ? [] : ethanolLines(premium, ethanolPerGallonKnown);

  if (state === "California") {
    const latest = CALIFORNIA_MONTHS[CALIFORNIA_MONTHS.length - 1];
    return bill(
      withDockGap(
        withCaliforniaRecipe(
          withEthanolFreight(
            withCoupon(withPlant(withTravel(
        [
          crudeTerm(premium, 1),
          ...blend,
          ...(carryTransport ? [crudeTransportLine(posted, ethanolPerGallonKnown === null ? 1 : 1 - ETHANOL_SHARE)] : []),
          losAngelesCrack === null
            ? fittedRefining("Refiner profit, Los Angeles", REFINING_FIT.losAngelesGasoline, premium, null)
            : observedCrack("Refiner profit, Los Angeles", losAngelesCrack, crackAnchor, gulfBarrel, REFINING_FIT.losAngelesGasoline.oil, premium, null),
          flat("Other distribution", californiaOtherDistribution()),
          flat("Detergent", DETERGENT),
          ...truckInvoiceLines(state),
          flat("Card fees", 0),
          flat("Store", STATION_COSTS.store),
          flat("Building", STATION_COSTS.building),
          flat("Station Profit", STATION_PROFIT),
          flat("Cap and trade", latest.capAndTrade),
          flat("Low-carbon fuel standard", latest.lowCarbon),
          flat("Federal tax", latest.federal),
          flat("State excise tax", latest.stateExcise),
          flat("Underground tank fee", latest.tank),
        ],
        state,
        importTravel,
      ),
      ),
      ),
      state,
      ),
      ),
      losAngelesCrack === null ? null : losAngelesCrack - gulfCrack,
      ),
      gulfBarrel,
      dieselPerGallon,
      ["The Commission's distribution line already held a tanker, the card fee, and the dime of profit. The card fee and the dime are shown on their own. The tanker that was in that line is replaced by the three tanker lines.", TRUCK_SKETCH, ...unpublished],
      SALES_SHARE,
    );
  }

  const parts: Term[] = [crudeTerm(premium, 1), ...blend];
  if (carryTransport) parts.push(crudeTransportLine(posted, ethanolPerGallonKnown === null ? 1 : 1 - ETHANOL_SHARE));
  if (region.id === "gulf") {
    parts.push(observedCrack("Refiner profit, Gulf dock", gulfCrack, crackAnchor, gulfBarrel, REFINING_FIT.gulfGasoline.oil, premium, null));
  } else if (region.id === "east") {
    if (newYorkCrack === null) unpublished.push("New York harbor did not price this week, so the East Coast dock is not a line.");
    else {
      const delivery = fromTheHarbor(state) ? harborDelivery(gulfCrack, laggedCrack) : { lines: [] as Term[], takenFromRefining: 0 };
      parts.push(...delivery.lines);
      const crack = observedCrack("Refiner profit, New York harbor", newYorkCrack, crackAnchor, gulfBarrel, REFINING_FIT.gulfGasoline.oil, premium, null);
      parts.push({ ...crack, constant: crack.constant - delivery.takenFromRefining });
    }
  } else if (state === "Washington" || state === "Oregon") {
    parts.push(observedCrack("Refiner profit, Puget Sound", gulfCrack, crackAnchor, gulfBarrel, REFINING_FIT.gulfGasoline.oil, premium, null));
  } else {
    const crack = leftTheGulf(state) && laggedCrack !== null ? laggedCrack : gulfCrack;
    parts.push(observedCrack("Refiner profit", crack, crackAnchor, gulfBarrel, REFINING_FIT.gulfGasoline.oil, premium, null));
    if (leftTheGulf(state) && laggedCrack !== null) unpublished.push("No refinery in this state. Gasoline uses the Gulf crack from about 15 days earlier. The oil line is today's barrel, so this crack is set so the two together are the older dock.");
  }

  if (region.id === "gulf" || region.id === "east" || state === "California") {
    unpublished.push("The terminal charges more than the refinery's sale. That gap did not hold still through March 2022, so there is no single cent to carry forward.");
  }
  if (region.id === "gulf") parts.push(flat("Refiner's sale over the spot", GULF_WHOLESALE_OVER_SPOT));

  const pipe = haul(state);
  if (pipe) parts.push(pipe);
  else if (!fromTheHarbor(state)) unpublished.push("No pipeline tariff on file names a place in this state. The gallons still move. That cost is part of the unnamed gap, not a line of its own.");

  if (state === "Washington") parts.push(flat("Clean Fuel Standard", WASHINGTON_CLEAN_FUEL));
  else if (state === "Oregon") parts.push(flat("Clean Fuels Program", OREGON_CLEAN_FUELS));
  else if (!recipe.boilAndSeparate) unpublished.push("This state is not only boil and separate. No agency has published the extra cents, so the recipe is not a line.");

  parts.push(
    flat("Detergent", DETERGENT),
    ...truckInvoiceLines(state),
    flat("Card fees", 0),
    flat("Store", STATION_COSTS.store),
    flat("Building", STATION_COSTS.building),
    flat("Station Profit", STATION_PROFIT),
    flat("Federal tax", STATION.gasolineFederal),
    flat("State tax", stateTax(state, "gasoline")),
  );
  const priced = withEthanolFreight(withCoupon(withPlant(withTravel(parts, state, importTravel))), state);
  const extra = knownOutsideTheStateTax(state, wholesaleTerm(priced));
  priced.push(...extra.lines);
  unpublished.push(...extra.notes);
  unpublished.push(...contractNotes(state), TRUCK_SKETCH);
  return bill(priced, gulfBarrel, dieselPerGallon, unpublished);
}

/** Same lines as gasoline. No ethanol, and no gasoline recipe cent copied onto diesel. */
export function approximateDieselInvoice(
  state: string,
  gulfBarrel: number,
  gulfCrack: number,
  losAngelesCrack: number | null,
  newYorkCrack: number | null,
  dieselPerGallon = 4,
  crackAnchor: number | null = null,
  laggedCrack: number | null = null,
  importTravel: ImportTravel | null = null,
): StateInvoice {
  if (gulfBarrel < 0) throw new Error("a barrel cannot be negative");
  if (dieselPerGallon < 0) throw new Error("diesel price cannot be negative");
  const region = regionOf(state);
  const unpublished: string[] = [CARD_NOTE, SMOKES_NOTE];
  const posted = CRUDE_PREMIUM[region.id];
  const carryTransport = carriesCrudeTransport(state);
  const parts: Term[] = [crudeTerm(carryTransport ? 0 : posted, 1)];
  if (carryTransport) parts.push(crudeTransportLine(posted, 1));
  if (state === "California") {
    parts.push(
      losAngelesCrack === null
        ? fittedRefining("Refiner profit, Los Angeles", REFINING_FIT.losAngelesDiesel, 0, null)
        : observedCrack("Refiner profit, Los Angeles", losAngelesCrack, crackAnchor, gulfBarrel, REFINING_FIT.losAngelesDiesel.oil, 0, null),
    );
  } else if (region.id === "gulf") {
    parts.push(observedCrack("Refiner profit, Gulf dock", gulfCrack, crackAnchor, gulfBarrel, REFINING_FIT.gulfDiesel.oil, 0, null));
  } else if (region.id === "east") {
    if (newYorkCrack === null) unpublished.push("New York harbor diesel did not price this week, so the East Coast dock is not a line.");
    else {
      const delivery = fromTheHarbor(state) ? harborDelivery(gulfCrack, laggedCrack) : { lines: [] as Term[], takenFromRefining: 0 };
      parts.push(...delivery.lines);
      const crack = observedCrack("Refiner profit, New York harbor", newYorkCrack, crackAnchor, gulfBarrel, REFINING_FIT.gulfDiesel.oil, 0, null);
      parts.push({ ...crack, constant: crack.constant - delivery.takenFromRefining });
    }
  } else if (state === "Washington" || state === "Oregon") {
    parts.push(observedCrack("Refiner profit, Puget Sound", gulfCrack, crackAnchor, gulfBarrel, REFINING_FIT.gulfDiesel.oil, 0, null));
  } else {
    const crack = leftTheGulf(state) && laggedCrack !== null ? laggedCrack : gulfCrack;
    parts.push(observedCrack("Refiner profit", crack, crackAnchor, gulfBarrel, REFINING_FIT.gulfDiesel.oil, 0, null));
    if (leftTheGulf(state) && laggedCrack !== null) unpublished.push("No refinery in this state. Diesel uses the Gulf crack from about 19 days earlier. The oil line is today's barrel, so this crack is set so the two together are the older dock.");
  }

  if (region.id === "gulf" || region.id === "east" || state === "California") {
    unpublished.push("The terminal charges more than the refinery's sale. That gap did not hold still through March 2022, so there is no single cent to carry forward.");
  }

  const pipe = haul(state);
  if (pipe) parts.push(pipe);
  else if (!fromTheHarbor(state)) unpublished.push("No pipeline tariff on file names a place in this state. The gallons still move. That cost is part of the unnamed gap, not a line of its own.");

  const recipe = recipeFor(state);
  if (state === "California" || state === "Oregon" || state === "Washington") {
    unpublished.push("California, Oregon, and Washington publish a gasoline recipe cent. That cent is not diesel, so it is not on this bill.");
  } else if (!recipe.boilAndSeparate) unpublished.push("This state is not only boil and separate. No diesel cent is published, so the recipe is not a line.");

  unpublished.push("Diesel at a regular station sells about half as fast, so the store, the building, and the profit are doubled. A truck stop is the other way around, and this bill is not one.");
  if (state === "California") parts.push(flat("Other distribution", californiaOtherDistribution()));
  const base = withCoupon(withPlant(withTravel(parts, state, importTravel)));
  const traveled =
    state === "California" ? withDockGap(base, losAngelesCrack === null ? null : losAngelesCrack - gulfCrack) : base;
  const station: Term[] = [
    ...truckInvoiceLines(state),
    flat("Card fees", 0),
    flat("Store", STATION_COSTS.store * DIESEL_TURN),
    flat("Building", STATION_COSTS.building * DIESEL_TURN),
    flat("Station Profit", STATION_PROFIT * DIESEL_TURN),
    flat("Federal tax", STATION.dieselFederal),
  ];
  if (state !== "California") {
    traveled.push(...station, flat("State tax", stateTax(state, "diesel")));
    const extra = knownOutsideTheStateTax(state, wholesaleTerm(traveled));
    traveled.push(...extra.lines);
    unpublished.push(...extra.notes);
    unpublished.push(...contractNotes(state), TRUCK_SKETCH);
    return bill(traveled, gulfBarrel, dieselPerGallon, unpublished);
  }

  traveled.push(...station);
  traveled.push(
    scaleTerm(sumTerms(traveled), CALIFORNIA_DIESEL_SALES, "State and local sales tax"),
    flat("State excise tax", CALIFORNIA_DIESEL_EXCISE),
    flat("Underground tank fee", CALIFORNIA_TANK_FEE),
  );
  unpublished.push("The tank fee is 2 cents on petroleum put in an underground tank, the same fee as gasoline. District sales tax sits on the 13 percent and is not on this bill. The old 92.94 cent state total is not used, because it hid the sales tax.");
  unpublished.push(...contractNotes(state), TRUCK_SKETCH);
  return bill(traveled, gulfBarrel, dieselPerGallon, unpublished);
}

/** Survey minus the pump. Positive means the September 28 price still has costs this bill does not name. Not a line in the pump. */
export function unnamedVersusSurvey(totalCents: number, surveyPerGallon: number): number {
  if (surveyPerGallon < 0) throw new Error("the survey cannot be negative");
  return Math.round(surveyPerGallon * 100) - totalCents;
}

/** Oil, ethanol, and refining. The bulk wholesale price. Not a second charge. */
export function bulkWholesaleCents(lines: { label: string; cents: number }[]): number | null {
  const oil = lines.find((line) => line.label === "Oil");
  const refining = lines.find((line) => line.label.startsWith("Refiner profit"));
  if (!oil || !refining) return null;
  const ethanol = lines.find((line) => line.label === "Ethanol, 10 percent");
  const replaced = lines.find((line) => line.label === "Oil replaced by ethanol");
  const travel = lines.find((line) => line.label === "Import pricing lag");
  const transport = lines.find((line) => line.label === "Crude transport");
  const sale = lines.find((line) => line.label === "Refiner's sale over the spot");
  const coupon = lines.find((line) => line.label === "Renewable fuel credit");
  const cash = lines.find((line) => line.label === "Running the refinery");
  const worn = lines.find((line) => line.label === "Refinery depreciation");
  const recipe = lines.find((line) => line.label === "California recipe");
  const freight = lines.find((line) => line.label === "Ethanol freight");
  const angeles = lines.find((line) => line.label === "Los Angeles over the Gulf");
  return (
    oil.cents +
    refining.cents +
    (ethanol?.cents ?? 0) +
    (replaced?.cents ?? 0) +
    (travel?.cents ?? 0) +
    (transport?.cents ?? 0) +
    (sale?.cents ?? 0) +
    (coupon?.cents ?? 0) +
    (cash?.cents ?? 0) +
    (worn?.cents ?? 0) +
    (recipe?.cents ?? 0) +
    (freight?.cents ?? 0) +
    (angeles?.cents ?? 0)
  );
}

/** American Petroleum Institute, May 5, 2026, citing the national Energy Information Administration split. About, not a law. */
export const NATIONAL_CRUDE_SHARE = 0.51;

const STATION_LINES = new Set([
  "Tanker, terminal to station",
  "Card fees",
  "Store",
  "Building",
  "Station Profit",
]);

export type GallonSplit = {
  oilCents: number;
  taxCents: number;
  stationCents: number;
  otherCents: number;
  pumpCents: number;
};

/** The national 51 percent is the oil. Everything else is taxes, the station, or still refining and distribution. */
export function splitGallon(lines: { label: string; cents: number }[]): GallonSplit {
  let oilCents = 0;
  let taxCents = 0;
  let stationCents = 0;
  let otherCents = 0;
  for (const line of lines) {
    if (line.label === "Oil") oilCents += line.cents;
    else if (line.label.startsWith("Tanker") || STATION_LINES.has(line.label)) stationCents += line.cents;
    else if (/tax|excise|tank fee/i.test(line.label)) taxCents += line.cents;
    else otherCents += line.cents;
  }
  return {
    oilCents,
    taxCents,
    stationCents,
    otherCents,
    pumpCents: oilCents + taxCents + stationCents + otherCents,
  };
}

/** The Gulf barrel that would make this bill equal the survey. Uses this bill's own slope, not a second bill. */
export function barrelOnThisBill(invoice: StateInvoice, surveyDollars: number, gulfBarrel: number): number | null {
  const oil = invoice.aggregate.oil;
  if (!Number.isFinite(oil) || Math.abs(oil) < 0.005) return null;
  const barrel = gulfBarrel + (surveyDollars - invoice.totalCents / 100) / oil;
  if (!Number.isFinite(barrel) || barrel < 0 || barrel > 400) return null;
  return Math.round(barrel);
}

/** The Gulf barrel that would make this bill equal the survey. Null when the bill barely moves with the barrel. */
export function barrelMatchingSurvey(
  state: string,
  surveyDollars: number,
  fuel: "gasoline" | "diesel",
  gulfCrack: number,
  dieselCrack: number,
): number | null {
  const at = (barrel: number): number | null => {
    const region = regionOf(state).id;
    const crack = fuel === "gasoline" ? gulfCrack : dieselCrack;
    const diesel = regionalBarrel(barrel, region) / 42 + dieselCrack;
    const harbor = ordinaryHarborCrack(crack, "east", fuel);
    const angeles = ordinaryHarborCrack(crack, "california", fuel);
    const invoice =
      fuel === "gasoline"
        ? approximateStateInvoice(state, barrel, gulfCrack, angeles, harbor, null, diesel)
        : approximateDieselInvoice(state, barrel, dieselCrack, angeles, harbor, diesel);
    return invoice ? invoice.totalCents / 100 : null;
  };
  const low = at(40);
  const high = at(140);
  if (low === null || high === null) return null;
  const slope = (high - low) / 100;
  if (Math.abs(slope) < 0.005) return null;
  const barrel = 40 + (surveyDollars - low) / slope;
  if (barrel < 0 || barrel > 400) return null;
  return Math.round(barrel);
}
