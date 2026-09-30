/**
 * The station. The barrel is an input. The truckload moves the same day.
 * The sign is the higher of that truckload and the gallons already paid for.
 * A fall waits until those gallons are sold. The profit on a gallon is a dime,
 * so a cheaper sign would spend it. Not fitted.
 */
export const STATION = {
  /** A normal week is a two-week tank. Measured on the gasoline ratchet, not chosen to score. */
  tankDays: 14,
  gallonsPerBarrel: 42,
  gasolineFederal: 0.184,
  dieselFederal: 0.244,
  /** Texas, both fuels. The Gulf score used this state. */
  state: 0.2,
  /** Harbor-to-pump leftover, Gulf, held still. Not the dealer's dime. */
  gasolineLeftover: 0.22,
  dieselLeftover: 0.54,
} as const;

export type Fuel = "gasoline" | "diesel";

/** Gulf spot minus the barrel, 2015 through June 2025, spring 2020 left out. A starting point, not a law. */
export const TYPICAL_CRACK = {
  gasoline: 0.39,
  diesel: 0.48,
} as const;

/** Barrel, tax, and the measured leftover. Not the harbor's extra over the barrel. */
export function gallonFromCrude(crudeDollarsPerBarrel: number, fuel: Fuel): number {
  if (crudeDollarsPerBarrel < 0) throw new Error("crude price cannot be negative");
  const federal = fuel === "gasoline" ? STATION.gasolineFederal : STATION.dieselFederal;
  const leftover = fuel === "gasoline" ? STATION.gasolineLeftover : STATION.dieselLeftover;
  return crudeDollarsPerBarrel / STATION.gallonsPerBarrel + federal + STATION.state + leftover;
}

/** The barrel split into gallons, plus the harbor's extra. The extra is an input. */
export function rackFromCrude(crudeDollarsPerBarrel: number, crackDollars: number): number {
  if (crudeDollarsPerBarrel < 0) throw new Error("crude price cannot be negative");
  if (crackDollars < 0) throw new Error("the harbor extra cannot be negative");
  return crudeDollarsPerBarrel / STATION.gallonsPerBarrel + crackDollars;
}

/** Rack price plus tax plus the measured leftover. What a gallon of that vintage costs on the sign. */
export function pumpFromRack(rackDollars: number, fuel: Fuel): number {
  if (rackDollars < 0) throw new Error("a rack price cannot be negative");
  const federal = fuel === "gasoline" ? STATION.gasolineFederal : STATION.dieselFederal;
  const leftover = fuel === "gasoline" ? STATION.gasolineLeftover : STATION.dieselLeftover;
  return rackDollars + federal + STATION.state + leftover;
}

/**
 * Completed days, oldest first. The last entry is yesterday.
 * The load on the truck was the refinery's price `plantDays` ago.
 */
export function onTheTruck(history: readonly number[], plantDays: number): number {
  if (history.length === 0) throw new Error("no days yet");
  if (plantDays < 0) throw new Error("the plant cannot take negative days");
  const index = history.length - plantDays;
  return history[Math.max(0, index)];
}

/** Gallons already in the ground. The load still on the truck is not included. Oldest first. */
export function tankLoads(history: readonly number[], plantDays: number, tankDays: number): number[] {
  if (history.length === 0) throw new Error("no days yet");
  if (tankDays < 1) throw new Error("a tank has to hold at least a day");
  const arrived = history.slice(0, Math.max(0, history.length - plantDays));
  const loads = arrived.slice(-tankDays);
  return loads.length > 0 ? loads : [history[0]];
}

/** Oldest first. One new load in, the oldest load out once the tank is full. */
export function nextTank(tank: readonly number[], load: number, days: number): number[] {
  if (days < 1) throw new Error("a tank has to hold at least a day");
  if (load < 0) throw new Error("a load cannot cost less than zero");
  const room = tank.length >= days ? tank.slice(tank.length - days + 1) : [...tank];
  return [...room, load];
}

/** What the gallons in the ground cost, on average. An empty tank has no cost. */
export function acquisitionCost(tank: readonly number[]): number {
  if (tank.length === 0) throw new Error("empty tank");
  return tank.reduce((sum, load) => sum + load, 0) / tank.length;
}

/** The dearest gallon still unsold. The station will not go under it. */
export function maxGallon(tank: readonly number[]): number {
  if (tank.length === 0) throw new Error("empty tank");
  return Math.max(...tank);
}

/**
 * The sign. A rise takes the new truckload the same day.
 * A fall stays at the dearest gallon already in the ground until that gallon is sold.
 */
export function stationSign(tank: readonly number[], nextLoad: number): number {
  if (nextLoad < 0) throw new Error("a load cannot cost less than zero");
  if (tank.length === 0) return nextLoad;
  return Math.max(nextLoad, maxGallon(tank));
}

export function filledTank(load: number, days: number): number[] {
  if (days < 1) throw new Error("a tank has to hold at least a day");
  return Array.from({ length: days }, () => load);
}
