import { REGIONS, type RegionId } from "./region.ts";

/**
 * Extra dollars per barrel that refiners in each region paid over Gulf Coast refiners.
 * EIA refiner acquisition cost, composite, median of monthly gaps, 2015 through 2025.
 * Freight is in the gap, and so is the kind of crude. Not a ship tariff.
 * The Gulf is the baseline, so its gap is zero. It is not a bill copied onto other states.
 */
export const CRUDE_PREMIUM: Record<RegionId, number> = {
  east: 3.78,
  midwest: -2.1,
  gulf: 0,
  rockies: -5.17,
  west: 3.45,
  california: 3.45,
};

/** West Coast figure, kept under the old name. Same as CRUDE_PREMIUM.west. */
export const WEST_COAST_CRUDE_PREMIUM = CRUDE_PREMIUM.west;

export function regionalBarrel(gulfBarrel: number, region: RegionId): number {
  if (gulfBarrel < 0) throw new Error("a barrel cannot be negative");
  return gulfBarrel + CRUDE_PREMIUM[region];
}

export function westCoastBarrel(gulfBarrel: number): number {
  return regionalBarrel(gulfBarrel, "west");
}

/** Ordinary dock minus that region's crude. The published spot gap over the Gulf, not a fetched week. */
export function ordinaryHarborCrack(gulfCrack: number, region: RegionId, fuel: "gasoline" | "diesel"): number | null {
  if (gulfCrack < 0) throw new Error("the dock cannot be negative");
  const dock = fuel === "gasoline" ? REGIONS[region].gasolineDock : REGIONS[region].dieselDock;
  if (dock === null) return null;
  return gulfCrack + dock - CRUDE_PREMIUM[region] / 42;
}
