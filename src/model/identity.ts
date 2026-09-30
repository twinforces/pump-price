/**
 * Closed equations only. No coefficient that turns barrels into cents.
 * The historical fit is a later body. It may not see Midnight Hammer or after.
 *
 * Midnight Hammer is the United States strike on Iranian nuclear sites,
 * June 22, 2025. It is not the February 28, 2026 closure of the Strait of Hormuz.
 */

export const MIDNIGHT_HAMMER = "2025-06-22";

/** Last survey week the fit is allowed to study. The next Monday is after the strike. */
export const LAST_FIT_WEEK = "2025-06-16";

export const SCORE = {
  /** At or under this, the miss is the one we call a success. */
  genius: 0.01,
  /** Ten percent is not a success. It is also not yet a missing factor. */
  notASuccess: 0.1,
  /** At or over this, a measured lever is missing, or the later month did not show up in the spot. */
  missingFactor: 0.2,
} as const;

export type ScoreBand = "genius" | "not-a-success" | "missing-factor";

export type Basis = "federal-state" | "station-survey" | "allocated";

export type PlantKind = "crude" | "converted-to-renewable-diesel";

export type Plant = {
  id: string;
  kind: PlantKind;
  /** Barrels a day of crude the refineries can take. Zero after a conversion scraps them. */
  crudeBarrelsPerDay: number;
  /** Share of crude that becomes gasoline. Zero when the plant no longer runs crude. */
  gasolineShare: number;
  /** Renewable diesel barrels a day. Only a converted plant may be non-zero. */
  renewableDieselBarrelsPerDay: number;
};

export type Scenario = {
  /** 100 is the measured baseline. Not a knob fitted to the price. */
  demandPercent: number;
  plants: readonly Plant[];
  /** Dollars per gallon, added after the crack. */
  gasolineTax: number;
  dieselTax: number;
};

export function inFitWindow(week: string): boolean {
  return week <= LAST_FIT_WEEK;
}

export function percentMiss(actual: number, predicted: number): number {
  if (!(actual > 0) || !(predicted >= 0)) {
    throw new Error("prices have to be positive to score a percent");
  }
  const raw = Math.abs(predicted - actual) / actual;
  return Math.round(raw * 1e8) / 1e8;
}

export function scoreBand(miss: number): ScoreBand {
  if (miss <= SCORE.genius) return "genius";
  if (miss >= SCORE.missingFactor) return "missing-factor";
  return "not-a-success";
}

/** Measured demand, scaled. 100 percent returns the baseline. */
export function demandAt(baselineBarrelsPerDay: number, demandPercent: number): number {
  if (baselineBarrelsPerDay < 0 || demandPercent < 0) {
    throw new Error("demand cannot be negative");
  }
  return baselineBarrelsPerDay * (demandPercent / 100);
}

export function crudeCapacity(plants: readonly Plant[]): number {
  return plants.reduce((sum, plant) => sum + plant.crudeBarrelsPerDay, 0);
}

export function gasolineCapacity(plants: readonly Plant[]): number {
  return plants.reduce(
    (sum, plant) => sum + plant.crudeBarrelsPerDay * plant.gasolineShare,
    0,
  );
}

export function renewableDiesel(plants: readonly Plant[]): number {
  return plants.reduce((sum, plant) => sum + plant.renewableDieselBarrelsPerDay, 0);
}

/**
 * Tax is added to retail. It is not added to the crack.
 * The crack is whatever the caller already computed. This function does not invent one.
 */
export function retailFromCrack(crackDollarsPerGallon: number, taxDollarsPerGallon: number): number {
  return crackDollarsPerGallon + taxDollarsPerGallon;
}

/**
 * A later-month future minus today's spot, same barrel.
 * Positive: the market pays more for the later month than for oil now.
 * The month will arrive. This gap is not proof the later month's story will.
 * Not a coefficient. Callers do not adjust it to shrink a retail miss.
 */
export function curveGap(laterMonthFuture: number, spot: number): number {
  return laterMonthFuture - spot;
}

/**
 * After the month arrives: how far that future was from the spot that showed up.
 * A percent, same score as a retail miss. It grades the expectation. It is not fed back into the fit.
 */
export function expectationMiss(futureWhenQuoted: number, spotWhenMonthArrived: number): number {
  return percentMiss(spotWhenMonthArrived, futureWhenQuoted);
}

export function alaskaDieselBasis(): Basis {
  return "station-survey";
}

export function californiaDieselBasis(): Basis {
  return "federal-state";
}

/**
 * Two layers. The quote is imaginary: it can move before a gallon has moved.
 * The delay is real: a barrel is available when the hull or the batch arrives.
 * Gasoline and diesel share the movement. They are not two oceans.
 */
export const DELAY = {
  /** Persian Gulf to the US Gulf, the long way around. Only the barrels on that water. */
  shipDaysMin: 40,
  shipDaysMax: 45,
  /** Crude already at the plant, turned into fuel. One ship becomes both fuels. */
  refineryDays: 3,
  /** One pipeline. Gasoline batch, Gulf to New York. About 5 miles an hour. */
  pipeGasolineDays: 15,
  /** Same pipeline, diesel batch. Heavier, so a few days behind the gasoline. */
  pipeDieselDays: 19,
  /** A product tanker, Gulf to New York, days on the water. Both grades aboard dock together. */
  tankerDays: 8,
  /** Load, sail, unload, sail back. The hull cannot deliver again until this is over. */
  tankerRoundTripDays: 20,
} as const;

/** The quoted price does not wait. It is not the gallon. */
export function transitPriceLagDays(): number {
  return 0;
}

export type Movement = "pipe" | "tanker";

/** Days after one departure that each fuel can actually be pumped. */
export function arrivalDays(movement: Movement): { gasoline: number; diesel: number } {
  if (movement === "tanker") {
    return { gasoline: DELAY.tankerDays, diesel: DELAY.tankerDays };
  }
  return { gasoline: DELAY.pipeGasolineDays, diesel: DELAY.pipeDieselDays };
}

/**
 * The diesel the delivery truck burns, in cents per gallon delivered.
 * One truck often carries both fuels. This is the piece that moves with the diesel price.
 * The assumptions are a worked example, not a fit: 100 miles, 6 miles per gallon, 8,500 gallons.
 */
export const TRUCK = {
  miles: 100,
  milesPerGallon: 6,
  gallons: 8500,
} as const;

export function truckFuelCents(dieselDollarsPerGallon: number): number {
  if (dieselDollarsPerGallon < 0) throw new Error("diesel price cannot be negative");
  const burned = TRUCK.miles / TRUCK.milesPerGallon;
  return (burned * dieselDollarsPerGallon * 100) / TRUCK.gallons;
}

/**
 * Posted diesel over the price a reseller paid. Ultra-low-sulfur, United States, taxes excluded.
 * January 2007 through February 2011. The public series stops there.
 * A piece of the diesel leftover. Not fitted, and not subtracted from the weekly score.
 */
export const FLEET = {
  /** Retail sales minus a commercial buyer. Typical gap, dollars per gallon. */
  retailOverCommercial: 0.06,
  /** Retail sales minus wholesale. Typical gap. The range in that window was 11 to 32 cents. */
  retailOverWholesale: 0.18,
  seriesEnds: "2011-02",
} as const;

/**
 * Annual renewable-fuel percentages of gasoline plus diesel, not of diesel alone.
 * The categories nest: biomass-based diesel is inside advanced, advanced is inside the total.
 * Not fitted. Not subtracted from the weekly score.
 */
export const RENEWABLE_OBLIGATION = [
  { year: 2015, cellulosic: 0.00069, biomassDiesel: 0.0149, advanced: 0.0162, total: 0.0952 },
  { year: 2016, cellulosic: 0.00128, biomassDiesel: 0.0159, advanced: 0.0201, total: 0.101 },
  { year: 2017, cellulosic: 0.00173, biomassDiesel: 0.0167, advanced: 0.0238, total: 0.107 },
  { year: 2018, cellulosic: 0.00159, biomassDiesel: 0.0174, advanced: 0.0237, total: 0.1067 },
  { year: 2019, cellulosic: 0.0023, biomassDiesel: 0.0173, advanced: 0.0271, total: 0.1097 },
  { year: 2020, cellulosic: 0.0032, biomassDiesel: 0.023, advanced: 0.0293, total: 0.1082 },
  { year: 2021, cellulosic: 0.0033, biomassDiesel: 0.0216, advanced: 0.03, total: 0.1119 },
  { year: 2022, cellulosic: 0.0035, biomassDiesel: 0.0233, advanced: 0.0316, total: 0.1159 },
  { year: 2023, cellulosic: 0.0048, biomassDiesel: 0.0258, advanced: 0.0339, total: 0.1196 },
  { year: 2024, cellulosic: 0.0059, biomassDiesel: 0.0282, advanced: 0.0379, total: 0.125 },
  { year: 2025, cellulosic: 0.0071, biomassDiesel: 0.0315, advanced: 0.0431, total: 0.1313 },
] as const;

export type RinPrices = {
  /** Dollars per credit. Cellulosic. */
  cellulosic: number;
  /** Dollars per credit. Biomass-based diesel. */
  biomassDiesel: number;
  /** Dollars per credit. Other advanced. */
  advanced: number;
  /** Dollars per credit. Ethanol, the conventional credit. */
  conventional: number;
};

/**
 * Cents of credit cost on one gallon of gasoline and one gallon of diesel.
 * The statute puts the same bundle on both. A producer of renewable diesel is paid
 * the credit. A refiner of petroleum pays this much per gallon of either fuel.
 */
export function renewableCentsPerGallon(
  year: number,
  prices: RinPrices,
): { gasoline: number; diesel: number } {
  const rule = RENEWABLE_OBLIGATION.find((row) => row.year === year);
  if (!rule) throw new Error("no renewable obligation for that year");
  for (const price of Object.values(prices)) {
    if (price < 0) throw new Error("a credit price cannot be negative");
  }
  const otherAdvanced = rule.advanced - rule.cellulosic - rule.biomassDiesel;
  const conventional = rule.total - rule.advanced;
  const dollars =
    rule.cellulosic * prices.cellulosic +
    rule.biomassDiesel * prices.biomassDiesel +
    otherAdvanced * prices.advanced +
    conventional * prices.conventional;
  const cents = Math.round(dollars * 1000) / 10;
  return { gasoline: cents, diesel: cents };
}

/**
 * Winter diesel costs more than gasoline at the pump. That premium is already
 * in the diesel harbor. Nothing is added again on the way to the sign.
 * Gulf, January minus July, 2015 through June 2025, COVID months out.
 */
export const WINTER = {
  /** Diesel pump minus gasoline pump, after the extra 6 cents of federal diesel tax. */
  gulfPumpCents: 22,
  /** Same comparison, Midwest. Colder, and a wider pump gap. */
  midwestPumpCents: 27,
  /** Diesel pump minus its own harbor, January minus July. Not an adder. */
  gulfLeftoverCents: 4,
} as const;

export function winterAdderOnTopOfHarbor(): number {
  return 0;
}

/** Harbor price minus the crude price, same gallon. Forty-two gallons in a barrel. Not a fitted constant. */
export function crackOverCrude(harborDollarsPerGallon: number, crudeDollarsPerBarrel: number): number {
  if (crudeDollarsPerBarrel < 0) throw new Error("crude price cannot be negative");
  return harborDollarsPerGallon - crudeDollarsPerBarrel / 42;
}

/** Days the pile lasts at the current rate of use. Not a price. */
export function daysOfSupply(stock: number, usedPerDay: number): number {
  if (stock < 0 || usedPerDay < 0) throw new Error("stock and use cannot be negative");
  if (usedPerDay === 0) throw new Error("nothing is being used");
  return stock / usedPerDay;
}
