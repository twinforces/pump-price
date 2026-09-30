/**
 * California gasoline invoice, July 2026.
 * California Energy Commission, workbook dated September 11, 2026.
 * Cents are the published dollars, rounded. They come up a penny short of the
 * published total, so the penny is its own line. Nothing else is added.
 * Marketing, ethanol, additives, and the California formula are not separate lines.
 */
export const CALIFORNIA_INVOICE = {
  month: "July 2026",
  publishedTotal: 5.31,
  lines: [
    { label: "Oil", cents: 224 },
    { label: "Refining", cents: 101 },
    { label: "Distribution, including marketing", cents: 63 },
    { label: "Cap and trade", cents: 26 },
    { label: "Low-carbon fuel standard", cents: 21 },
    { label: "Federal tax", cents: 18 },
    { label: "State excise tax", cents: 63 },
    { label: "State and local sales tax", cents: 12 },
    { label: "Underground tank fee", cents: 2 },
    { label: "Rounding", cents: 1 },
  ],
} as const;

export const NOT_SEPARATE = [
  "Distribution and marketing are different things. Distribution is the haul. Marketing is the station. This invoice glues them into 63 cents, from the terminal to the pump, including rent, wages, card fees, and profit.",
  "The haul from the refinery to the terminal is inside refining, along with the oxygenate. Ethanol and additives are not their own lines.",
  "Oil is what the refineries paid for the crude they bought. California is cut off by the Rockies, so that crude arrives by ship. The ship is not a separate line on top of this price.",
  "The California formula is not a line of its own. The extra cost of that recipe is already inside refining and the low-carbon standard.",
] as const;

export function invoiceCents(): number {
  return CALIFORNIA_INVOICE.lines.reduce((sum, line) => sum + line.cents, 0);
}
