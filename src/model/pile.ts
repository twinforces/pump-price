/**
 * National gasoline pile, in dollars per gallon. Energy Information Administration,
 * Gasoline Pump Components History. Percents of the retail price, turned back into money.
 * Distribution and marketing are one published remainder. They are not split.
 * Not the Gulf leftover, and not added to the sign.
 */
export type Pile = {
  month: string;
  retail: number;
  crude: number;
  refining: number;
  distributionAndMarketing: number;
  taxes: number;
};

function dollars(retail: number, percent: number): number {
  return Math.round(retail * percent) / 100;
}

function pile(
  month: string,
  retail: number,
  crudePercent: number,
  refiningPercent: number,
  distributionPercent: number,
  taxPercent: number,
): Pile {
  return {
    month,
    retail,
    crude: dollars(retail, crudePercent),
    refining: dollars(retail, refiningPercent),
    distributionAndMarketing: dollars(retail, distributionPercent),
    taxes: dollars(retail, taxPercent),
  };
}

export const NATIONAL_PILES: readonly Pile[] = [
  pile("August 2025", 3.133, 50.5, 17.6, 15.5, 16.4),
  pile("May 2026", 4.479, 51.9, 21.7, 14.8, 11.5),
] as const;
