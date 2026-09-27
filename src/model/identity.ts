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
  /** Barrels a day of crude the stills can take. Zero after a conversion scraps them. */
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
