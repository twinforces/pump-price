/**
 * A look into a simple refinery from the markets it sells into.
 * Two gallons of gasoline and one of diesel from three gallons of crude.
 * The result is dollars per barrel of crude: revenue minus the crude.
 * Not profit. Fuel, labor, and maintenance are not in it.
 * The rack is outside the fence and is not used here.
 */

/** Share of the crude put in. Median week, 2015 through 2019. Finished gasoline includes ethanol blended later. */
export const FLEET_YIELD = {
  gasoline: 0.599,
  distillate: 0.303,
} as const;

export function crack321(crudePerBarrel: number, gasolinePerGallon: number, dieselPerGallon: number): number {
  if (crudePerBarrel < 0 || gasolinePerGallon < 0 || dieselPerGallon < 0) {
    throw new Error("a price cannot be negative");
  }
  return ((2 * gasolinePerGallon + dieselPerGallon) / 3) * 42 - crudePerBarrel;
}
