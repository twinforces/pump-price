/**
 * Ten percent of a finished gallon is ethanol. It is not free.
 * The price is the Iowa plant sale in the USDA weekly ethanol report.
 * That is the plant gate, not the terminal. The haul from the plant is not in it.
 */
export const ETHANOL_SHARE = 0.1;

/** First Iowa trade in the report is the ethanol plant, in dollars per gallon. */
export function iowaEthanolPrice(reportText: string): number | null {
  const match = reportText.match(/Iowa\s+Trade\s+([0-9]+\.[0-9]+)/);
  if (!match) return null;
  const price = Number(match[1]);
  if (!Number.isFinite(price) || price <= 0) return null;
  return price;
}
