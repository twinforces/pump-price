import { flat, type Term } from "./term.ts";

/**
 * One-way road miles from people to the nearest rack that can load a truck.
 * Racks are Homeland Infrastructure Foundation-Level Data petroleum terminals
 * in service with a truck rack and gasoline, distillate, or refined product.
 * People are Census county population, 2023. The road is the straight line times 1.25.
 * The national average is 27 miles. A trucking survey's round trip is about 55, so the fuel is charged both ways.
 */
export const TRUCK_MILES_AS_OF = "2023 counties, HIFLD racks";

export const TRUCK_MILES: Readonly<Record<string, number>> = {
  Alabama: 36,
  Alaska: 51,
  Arizona: 49,
  Arkansas: 44,
  California: 33,
  Colorado: 34,
  Connecticut: 13,
  Delaware: 27,
  "District of Columbia": 14,
  Florida: 32,
  Georgia: 24,
  Hawaii: 19,
  Idaho: 40,
  Illinois: 17,
  Indiana: 18,
  Iowa: 24,
  Kansas: 34,
  Kentucky: 29,
  Louisiana: 22,
  Maine: 47,
  Maryland: 19,
  Massachusetts: 20,
  Michigan: 26,
  Minnesota: 28,
  Mississippi: 42,
  Missouri: 29,
  Montana: 54,
  Nebraska: 30,
  Nevada: 31,
  "New Hampshire": 49,
  "New Jersey": 19,
  "New Mexico": 35,
  "New York": 13,
  "North Carolina": 33,
  "North Dakota": 38,
  Ohio: 17,
  Oklahoma: 30,
  Oregon: 55,
  Pennsylvania: 18,
  "Rhode Island": 15,
  "South Carolina": 43,
  "South Dakota": 34,
  Tennessee: 36,
  Texas: 20,
  Utah: 40,
  Vermont: 63,
  Virginia: 26,
  Washington: 33,
  "West Virginia": 41,
  Wisconsin: 27,
  Wyoming: 55,
};

/** A loaded highway tanker. The 7 is miles per gallon of diesel. The load is what one trailer carries. Not the station's tank. Those are 5,000, 7,000, 10,000, or 20,000 gallons. */
export const TANKER = { milesPerGallon: 7, gallons: 8500 } as const;

/**
 * Placeholder, not a tariff.
 * The stop is a flat hundred dollars. The contract mile rate is the cost at a diesel price of $3, and it does not move.
 * The surcharge is only the extra diesel the truck burns above that $3. A local haul is often just the flat.
 */
export const TRUCK_STOP_DOLLARS = 100;
/** Dollars of non-fuel truck cost per mile at the contract diesel price, divided by that price. Kept so a $3 diesel and a 55 mile round trip still land near 2.3 cents. */
export const TRUCK_MILE_PER_DIESEL = 0.44;
/** The diesel price already inside the contract. The surcharge is the increase above this, not the whole price. */
export const FREIGHT_DIESEL_PEG = 3;

export const TRUCK_SKETCH =
  "Freight on the bill of lading is a contract flat, plus a surcharge for diesel above $3 a gallon. The flat is a $100 stop and the mile cost at that $3, there and back, on 8,500 gallons. The surcharge is only the extra diesel burned above $3, at 7 miles a gallon. It is not 44 cents of the mile charge moving with the whole diesel price. A haul next to the terminal is often just the flat. At $3 and a 55 mile round trip the flat is about 2.3 cents. Not a filed rate.";

/**
 * Diesel the truck burns, per gallon delivered.
 * diesel / 7 * miles, and the miles are the drive there and the drive back.
 */
export function truckFuelDollars(dieselPerGallon: number, oneWayMiles: number): number {
  if (dieselPerGallon < 0) throw new Error("diesel price cannot be negative");
  if (oneWayMiles < 0) throw new Error("miles cannot be negative");
  const driven = oneWayMiles * 2;
  return (dieselPerGallon / TANKER.milesPerGallon) * driven / TANKER.gallons;
}

export function truckInvoiceLines(state: string): Term[] {
  const miles = TRUCK_MILES[state];
  if (miles === undefined) throw new Error("no truck miles for that state");
  const driven = miles * 2;
  const perGallon = driven / TANKER.gallons;
  const fuelPerDollar = perGallon / TANKER.milesPerGallon;
  return [
    flat("Tanker stop, $100 a trip", TRUCK_STOP_DOLLARS / TANKER.gallons),
    flat(
      `Tanker contract, ${miles} miles each way`,
      (TRUCK_MILE_PER_DIESEL * FREIGHT_DIESEL_PEG + FREIGHT_DIESEL_PEG / TANKER.milesPerGallon) * perGallon,
    ),
    {
      label: `Tanker surcharge, diesel above $${FREIGHT_DIESEL_PEG}, ${miles} miles each way`,
      constant: -FREIGHT_DIESEL_PEG * fuelPerDollar,
      oil: 0,
      diesel: fuelPerDollar,
    },
  ];
}
