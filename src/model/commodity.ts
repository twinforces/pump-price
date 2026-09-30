/**
 * Groceries. Most of the shelf price does not follow diesel.
 * The slice that can is a picture you can move, not a measured pass-through.
 */
export const FOOD = {
  /** Cents of a food dollar that follow diesel, until a real share is measured. */
  dieselCentsPerDollar: 0.05,
} as const;

export type Commodity = {
  id: string;
  name: string;
  /** Starting shelf price. A picture, not a government print. */
  shelf: number;
  unit: string;
  /** Days from booking the cost until it reaches the store. Biology or a truck, not a fitted lag. */
  waitDays: number;
  /** How long the store holds it once it arrives. A shelf, not a fitted lag. */
  holdDays: number;
  /** Share of the starting price that scales with diesel. Zero means it does not. */
  dieselShare: number;
  why: string;
  /** What the wait is, in plain words. */
  wait: string;
};

export const COMMODITIES: readonly Commodity[] = [
  {
    id: "milk",
    name: "Milk",
    shelf: 4,
    unit: "gallon",
    waitDays: 2,
    holdDays: 7,
    dieselShare: FOOD.dieselCentsPerDollar,
    why: "Most of the gallon is the dairy. The tanker is the slice that can follow diesel.",
    wait: "Two days from the dairy. Milk does not keep.",
  },
  {
    id: "beef",
    name: "Ground beef",
    shelf: 6,
    unit: "pound",
    waitDays: 150,
    holdDays: 7,
    dieselShare: FOOD.dieselCentsPerDollar,
    why: "Most of the pound is the animal. Today's feed bill is not the meat already in the case.",
    wait: "About five months on feed. A round biological clock, not a fitted lag.",
  },
  {
    id: "paper",
    name: "Toilet paper",
    shelf: 1.25,
    unit: "roll",
    waitDays: 0,
    holdDays: 14,
    dieselShare: 0,
    why: "Mostly the electric mill. Diesel does not set this price.",
    wait: "No diesel clock.",
  },
];

/** Wheat is a market plus two bills that are not the market. Pictures, not a cost survey. */
export const WHEAT = {
  bushel: 6,
  /** Natural gas, booked at planting. Not diesel. */
  fertilizer: 1,
  /** Field fuel, dollars a bushel at the baseline diesel price. */
  fieldFuel: 0.3,
  waitDays: 270,
  holdDays: 30,
} as const;

/**
 * What gets booked for a bushel today.
 * The bushel and the fertilizer do not follow diesel. The field fuel does.
 */
export function wheatBooked(
  bushel: number,
  fertilizer: number,
  fieldFuel: number,
  dieselNow: number,
  dieselBaseline: number,
): number {
  if (bushel < 0 || fertilizer < 0 || fieldFuel < 0) throw new Error("a wheat bill cannot be negative");
  if (dieselNow < 0) throw new Error("diesel cannot be negative");
  if (dieselBaseline <= 0) throw new Error("the baseline diesel has to be a real price");
  return bushel + fertilizer + fieldFuel * (dieselNow / dieselBaseline);
}

/** Today's delivery. The rest of the price stays put. The diesel slice scales with the diesel sign. */
export function deliveryCost(
  shelf: number,
  dieselShare: number,
  dieselNow: number,
  dieselBaseline: number,
): number {
  if (shelf < 0) throw new Error("a shelf price cannot be negative");
  if (dieselShare < 0 || dieselShare > 1) throw new Error("the diesel slice has to be between nothing and the whole price");
  if (dieselNow < 0) throw new Error("diesel cannot be negative");
  if (dieselBaseline <= 0) throw new Error("the baseline diesel has to be a real price");
  const rest = shelf * (1 - dieselShare);
  const fuel = shelf * dieselShare * (dieselNow / dieselBaseline);
  return rest + fuel;
}

/**
 * Booked costs, oldest first. The last entry is yesterday.
 * The batch arriving today was booked `waitDays` ago.
 * A wait of zero means the last booking has already arrived.
 */
export function arrivingCost(history: readonly number[], waitDays: number): number {
  if (history.length === 0) throw new Error("no days yet");
  if (waitDays < 0) throw new Error("a wait cannot be negative");
  if (waitDays < 1) return history[history.length - 1];
  return history[Math.max(0, history.length - waitDays)];
}

/** What is already in the store. Batches still on the farm or in the field are not included. */
export function cooler(history: readonly number[], waitDays: number, holdDays: number): number[] {
  if (history.length === 0) throw new Error("no days yet");
  if (holdDays < 1) throw new Error("a shelf has to hold at least a day");
  if (waitDays < 0) throw new Error("a wait cannot be negative");
  if (waitDays < 1) return history.slice(-holdDays);
  const arrivingIndex = Math.max(0, history.length - waitDays);
  const arrived = history.slice(0, arrivingIndex + 1);
  const loads = arrived.slice(-holdDays);
  return loads.length > 0 ? loads : [history[0]];
}
