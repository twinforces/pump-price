/**
 * California gasoline invoice, every month the Commission has published in this file.
 * May 2024 through July 2026. Dollars per gallon. The lines add up to the pump.
 * Refining is not a percent of the oil. Distribution does not follow the oil either.
 */
import { westCoastBarrel } from "./haul.ts";

export type CaliforniaMonth = {
  month: string;
  crude: number;
  refining: number;
  distribution: number;
  capAndTrade: number;
  lowCarbon: number;
  federal: number;
  stateExcise: number;
  sales: number;
  tank: number;
  total: number;
};

export const CALIFORNIA_MONTHS: readonly CaliforniaMonth[] = [
  { month: "2024-05", crude: 2.036, refining: 0.929, distribution: 0.744, capAndTrade: 0.309, lowCarbon: 0.077, federal: 0.184, stateExcise: 0.596, sales: 0.11, tank: 0.02, total: 5.005 },
  { month: "2024-06", crude: 2.057, refining: 0.619, distribution: 0.727, capAndTrade: 0.288, lowCarbon: 0.07, federal: 0.184, stateExcise: 0.596, sales: 0.103, tank: 0.02, total: 4.663 },
  { month: "2024-07", crude: 2.07, refining: 0.522, distribution: 0.628, capAndTrade: 0.28, lowCarbon: 0.074, federal: 0.184, stateExcise: 0.596, sales: 0.098, tank: 0.02, total: 4.471 },
  { month: "2024-08", crude: 1.974, refining: 0.612, distribution: 0.502, capAndTrade: 0.266, lowCarbon: 0.083, federal: 0.184, stateExcise: 0.596, sales: 0.095, tank: 0.02, total: 4.332 },
  { month: "2024-09", crude: 1.81, refining: 0.803, distribution: 0.568, capAndTrade: 0.28, lowCarbon: 0.096, federal: 0.184, stateExcise: 0.596, sales: 0.098, tank: 0.02, total: 4.455 },
  { month: "2024-10", crude: 1.847, refining: 0.609, distribution: 0.636, capAndTrade: 0.298, lowCarbon: 0.105, federal: 0.184, stateExcise: 0.596, sales: 0.097, tank: 0.02, total: 4.392 },
  { month: "2024-11", crude: 1.808, refining: 0.505, distribution: 0.631, capAndTrade: 0.284, lowCarbon: 0.114, federal: 0.184, stateExcise: 0.596, sales: 0.093, tank: 0.02, total: 4.236 },
  { month: "2024-12", crude: 1.785, refining: 0.454, distribution: 0.602, capAndTrade: 0.271, lowCarbon: 0.12, federal: 0.184, stateExcise: 0.596, sales: 0.091, tank: 0.02, total: 4.123 },
  { month: "2025-01", crude: 1.896, refining: 0.458, distribution: 0.498, capAndTrade: 0.253, lowCarbon: 0.191, federal: 0.184, stateExcise: 0.596, sales: 0.092, tank: 0.02, total: 4.187 },
  { month: "2025-02", crude: 1.826, refining: 0.855, distribution: 0.467, capAndTrade: 0.236, lowCarbon: 0.182, federal: 0.184, stateExcise: 0.596, sales: 0.098, tank: 0.02, total: 4.464 },
  { month: "2025-03", crude: 1.788, refining: 0.779, distribution: 0.629, capAndTrade: 0.241, lowCarbon: 0.154, federal: 0.184, stateExcise: 0.596, sales: 0.099, tank: 0.02, total: 4.49 },
  { month: "2025-04", crude: 1.665, refining: 1.019, distribution: 0.693, capAndTrade: 0.217, lowCarbon: 0.154, federal: 0.184, stateExcise: 0.596, sales: 0.102, tank: 0.02, total: 4.65 },
  { month: "2025-05", crude: 1.622, refining: 1.054, distribution: 0.701, capAndTrade: 0.214, lowCarbon: 0.137, federal: 0.184, stateExcise: 0.596, sales: 0.102, tank: 0.02, total: 4.629 },
  { month: "2025-06", crude: 1.73, refining: 0.771, distribution: 0.765, capAndTrade: 0.213, lowCarbon: 0.075, federal: 0.184, stateExcise: 0.596, sales: 0.098, tank: 0.02, total: 4.452 },
  { month: "2025-07", crude: 1.765, refining: 0.6, distribution: 0.77, capAndTrade: 0.22, lowCarbon: 0.129, federal: 0.184, stateExcise: 0.612, sales: 0.097, tank: 0.02, total: 4.397 },
  { month: "2025-08", crude: 1.706, refining: 0.759, distribution: 0.654, capAndTrade: 0.226, lowCarbon: 0.152, federal: 0.184, stateExcise: 0.612, sales: 0.097, tank: 0.02, total: 4.41 },
  { month: "2025-09", crude: 1.705, refining: 0.905, distribution: 0.646, capAndTrade: 0.243, lowCarbon: 0.141, federal: 0.184, stateExcise: 0.612, sales: 0.097, tank: 0.02, total: 4.557 },
  { month: "2025-10", crude: 1.619, refining: 0.862, distribution: 0.626, capAndTrade: 0.258, lowCarbon: 0.145, federal: 0.184, stateExcise: 0.612, sales: 0.097, tank: 0.02, total: 4.423 },
  { month: "2025-11", crude: 1.631, refining: 0.793, distribution: 0.735, capAndTrade: 0.243, lowCarbon: 0.138, federal: 0.184, stateExcise: 0.612, sales: 0.098, tank: 0.02, total: 4.454 },
  { month: "2025-12", crude: 1.53, refining: 0.5, distribution: 0.858, capAndTrade: 0.244, lowCarbon: 0.142, federal: 0.184, stateExcise: 0.612, sales: 0.092, tank: 0.02, total: 4.182 },
  { month: "2026-01", crude: 1.597, refining: 0.505, distribution: 0.584, capAndTrade: 0.245, lowCarbon: 0.171, federal: 0.184, stateExcise: 0.612, sales: 0.088, tank: 0.02, total: 4.007 },
  { month: "2026-02", crude: 1.71, refining: 0.755, distribution: 0.534, capAndTrade: 0.228, lowCarbon: 0.199, federal: 0.184, stateExcise: 0.612, sales: 0.095, tank: 0.02, total: 4.337 },
  { month: "2026-03", crude: 2.331, refining: 1.003, distribution: 0.589, capAndTrade: 0.224, lowCarbon: 0.183, federal: 0.184, stateExcise: 0.612, sales: 0.116, tank: 0.02, total: 5.262 },
  { month: "2026-04", crude: 2.467, refining: 1.206, distribution: 0.71, capAndTrade: 0.226, lowCarbon: 0.182, federal: 0.184, stateExcise: 0.612, sales: 0.126, tank: 0.02, total: 5.733 },
  { month: "2026-05", crude: 2.577, refining: 1.238, distribution: 0.761, capAndTrade: 0.233, lowCarbon: 0.193, federal: 0.184, stateExcise: 0.612, sales: 0.131, tank: 0.02, total: 5.949 },
  { month: "2026-06", crude: 2.344, refining: 0.862, distribution: 0.945, capAndTrade: 0.254, lowCarbon: 0.205, federal: 0.184, stateExcise: 0.612, sales: 0.122, tank: 0.02, total: 5.547 },
  { month: "2026-07", crude: 2.24, refining: 1.012, distribution: 0.626, capAndTrade: 0.26, lowCarbon: 0.213, federal: 0.184, stateExcise: 0.634, sales: 0.117, tank: 0.02, total: 5.305 },
];

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/** The other lines, held at their medians. Refining included. Not a formula for refining. */
export function medianPileBesidesCrude(): number {
  return median(CALIFORNIA_MONTHS.map((month) => month.total - month.crude));
}

/** Oil plus the median of every other line. The miss is the month the other lines were not typical. */
export function californiaFromCrude(crudePerGallon: number): number {
  if (crudePerGallon < 0) throw new Error("oil cannot be negative");
  return crudePerGallon + medianPileBesidesCrude();
}

export const SALES_SHARE = 0.022;

export type InvoiceLine = { label: string; cents: number };

/**
 * An approximate California invoice for a week.
 * Oil is the Gulf barrel plus the West Coast premium.
 * Refining is the Los Angeles dock minus that oil. It is not inferred.
 * Distribution is the median of the published months.
 * The programs and the taxes are the latest month the Commission published, July 2026.
 * Sales tax is 2.2 percent of the pump, the rate in every one of those months.
 */
export function approximateCaliforniaInvoice(
  gulfBarrel: number,
  losAngelesSpot: number,
): { lines: InvoiceLine[]; totalCents: number } {
  if (gulfBarrel < 0 || losAngelesSpot < 0) throw new Error("a price cannot be negative");
  const oil = westCoastBarrel(gulfBarrel) / 42;
  const refining = losAngelesSpot - oil;
  const distribution = median(CALIFORNIA_MONTHS.map((month) => month.distribution));
  const latest = CALIFORNIA_MONTHS[CALIFORNIA_MONTHS.length - 1];
  const held: [string, number][] = [
    ["Oil", oil],
    ["Refining", refining],
    ["Distribution, including marketing", distribution],
    ["Cap and trade", latest.capAndTrade],
    ["Low-carbon fuel standard", latest.lowCarbon],
    ["Federal tax", latest.federal],
    ["State excise tax", latest.stateExcise],
    ["Underground tank fee", latest.tank],
  ];
  const beforeSales = held.reduce((sum, [, value]) => sum + value, 0);
  const total = beforeSales / (1 - SALES_SHARE);
  const drafted = held.concat([["State and local sales tax", total - beforeSales]]);
  const lines = drafted.map(([label, value]) => ({ label, cents: Math.round(value * 100) }));
  const drift = Math.round(total * 100) - lines.reduce((sum, line) => sum + line.cents, 0);
  lines.push({ label: "Rounding", cents: drift });
  return { lines, totalCents: lines.reduce((sum, line) => sum + line.cents, 0) };
}
