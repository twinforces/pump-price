import { execFile } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import * as XLSX from "xlsx";

import { iowaEthanolPrice } from "../model/ethanol.ts";
import { crudeDaysAgo, importTravelPerGallon } from "../model/state-invoice.ts";
import { VOYAGES, type ImportTravel, type VoyageId } from "../model/voyage.ts";
import { SAVED_WEEK } from "./saved-week.ts";

const execFileAsync = promisify(execFile);

const SERIES = {
  crude: "https://www.eia.gov/dnav/pet/hist_xls/RWTCw.xls",
  gasoline: "https://www.eia.gov/dnav/pet/hist_xls/EER_EPMRU_PF4_RGC_DPGw.xls",
  diesel: "https://www.eia.gov/dnav/pet/hist_xls/EER_EPD2DXL0_PF4_RGC_DPGw.xls",
  quality: "https://www.eia.gov/dnav/pet/xls/PET_PNP_CRQ_DCU_NUS_M.xls",
  laGasoline: "https://www.eia.gov/dnav/pet/hist_xls/EER_EPMRR_PF4_Y05LA_DPGw.xls",
  laDiesel: "https://www.eia.gov/dnav/pet/hist_xls/EER_EPD2DC_PF4_Y05LA_DPGw.xls",
  newYorkGasoline: "https://www.eia.gov/dnav/pet/hist_xls/EER_EPMRU_PF4_Y35NY_DPGw.xls",
  newYorkDiesel: "https://www.eia.gov/dnav/pet/hist_xls/EER_EPD2DXL0_PF4_Y35NY_DPGw.xls",
  utilization: "https://www.eia.gov/dnav/pet/hist_xls/WPULEUS3w.xls",
  crudeInput: "https://www.eia.gov/dnav/pet/hist_xls/WCRRIUS2w.xls",
  gasolineMade: "https://www.eia.gov/dnav/pet/hist_xls/WGFRPUS2w.xls",
  distillateMade: "https://www.eia.gov/dnav/pet/hist_xls/WDIRPUS2w.xls",
} as const;

export type LatestWeek = {
  week: string;
  crude: number;
  gasolineSpot: number;
  dieselSpot: number;
  gasolineCrack: number;
  dieselCrack: number;
  /** Monthly average of the crude refineries ran. Not a four-way pie. */
  quality: { month: string; api: number; sulfur: number } | null;
  californiaDock: { gasoline: number; diesel: number } | null;
  losAngelesGasoline: { date: string; value: number } | null;
  newYorkGasoline: { date: string; value: number } | null;
  newYorkDiesel: { date: string; value: number } | null;
  ethanol: { date: string; dollarsPerGallon: number } | null;
  refinery: {
    week: string;
    utilization: number;
    gasolineShare: number | null;
    distillateShare: number | null;
  } | null;
  lag: {
    gasoline: { date: string; crack: number };
    diesel: { date: string; crack: number };
  } | null;
  importTravel: ImportTravel | null;
  /** True when the live files missed and this is the last week that did load. */
  stale?: boolean;
};

type SheetCell = string | number | boolean | Date | null | undefined;
type WeekPoint = { date: string; value: number };

function rowsOf(buf: Buffer): SheetCell[][] {
  const book = XLSX.read(buf, { type: "buffer", cellDates: true });
  const sheet = book.Sheets["Data 1"];
  if (!sheet) throw new Error("the price file has no data sheet");
  return XLSX.utils.sheet_to_json<SheetCell[]>(sheet, { header: 1, raw: true });
}

function asDate(raw: SheetCell): string | null {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw.toISOString().slice(0, 10);
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  return null;
}

function asNumber(raw: SheetCell): number | null {
  return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
}

function pointsFrom(buf: Buffer): WeekPoint[] {
  const rows: WeekPoint[] = [];
  for (const row of rowsOf(buf).slice(3)) {
    const date = asDate(row?.[0]);
    const value = asNumber(row?.[1]);
    if (date && value !== null) rows.push({ date, value });
  }
  if (rows.length === 0) throw new Error("empty workbook");
  return rows;
}

async function fetchBook(url: string): Promise<Buffer> {
  const response = await fetch(url, { headers: { "User-Agent": "pump-price" } });
  if (!response.ok) throw new Error("the price file did not load");
  return Buffer.from(await response.arrayBuffer());
}

function qualityFrom(buf: Buffer): NonNullable<LatestWeek["quality"]> {
  let last: LatestWeek["quality"] = null;
  for (const row of rowsOf(buf).slice(3)) {
    const month = asDate(row?.[0]);
    const sulfur = asNumber(row?.[1]);
    const api = asNumber(row?.[2]);
    if (month && sulfur !== null && api !== null) last = { month, sulfur, api };
  }
  if (!last) throw new Error("empty quality workbook");
  return last;
}

const READ_ETHANOL = `
from pypdf import PdfReader
import sys
reader = PdfReader(sys.argv[1])
print("\\n".join((page.extract_text() or "") for page in reader.pages))
`;

async function latestValue(url: string): Promise<{ date: string; value: number }> {
  const points = pointsFrom(await fetchBook(url));
  const last = points[points.length - 1];
  if (!last) throw new Error("empty workbook");
  return last;
}

/** Crack versus the anchor crude, so today's oil line plus this crack equals the older dock. */
function crackDaysBack(spot: WeekPoint[], crude: WeekPoint[], targetDays: number, anchorCrude: number): { date: string; crack: number } | null {
  const end = Date.parse(crude[crude.length - 1].date);
  let best: { date: string; crack: number; days: number } | null = null;
  const byDate = new Map(spot.map((row) => [row.date, row.value]));
  for (const row of crude) {
    const days = (end - Date.parse(row.date)) / 86400000;
    if (days < 7) continue;
    const price = byDate.get(row.date);
    if (price === undefined) continue;
    if (best === null || Math.abs(days - targetDays) < Math.abs(best.days - targetDays)) {
      best = { date: row.date, crack: price - anchorCrude / 42, days };
    }
  }
  return best === null ? null : { date: best.date, crack: best.crack };
}

/** Cushing weekly West Texas Intermediate on or after `since`. */
export async function loadCrudeWeeks(since: string): Promise<WeekPoint[]> {
  return pointsFrom(await fetchBook(SERIES.crude)).filter((row) => row.date >= since);
}

/** The latest published Gulf week, plus the latest crude-quality month. Not the grocery shelf. */
export async function loadLatestWeek(): Promise<LatestWeek> {
  try {
    return await loadLiveWeek();
  } catch {
    return SAVED_WEEK;
  }
}

export async function loadLiveWeek(): Promise<LatestWeek> {
  const [crudeBook, gasolineBook, dieselBook] = await Promise.all([
    fetchBook(SERIES.crude),
    fetchBook(SERIES.gasoline),
    fetchBook(SERIES.diesel),
  ]);
  const crudeWeeks = pointsFrom(crudeBook);
  const gasolineWeeks = pointsFrom(gasolineBook);
  const dieselWeeks = pointsFrom(dieselBook);
  const crude = crudeWeeks[crudeWeeks.length - 1];
  const gasoline = gasolineWeeks[gasolineWeeks.length - 1];
  const diesel = dieselWeeks[dieselWeeks.length - 1];
  if (!crude || !gasoline || !diesel) throw new Error("empty workbook");
  const perGallon = crude.value / 42;
  let quality: LatestWeek["quality"] = null;
  try {
    quality = qualityFrom(await fetchBook(SERIES.quality));
  } catch {
    quality = null;
  }
  let californiaDock: LatestWeek["californiaDock"] = null;
  let losAngelesGasoline: LatestWeek["losAngelesGasoline"] = null;
  try {
    const [losAngelesGas, losAngelesDiesel] = await Promise.all([
      latestValue(SERIES.laGasoline),
      latestValue(SERIES.laDiesel),
    ]);
    losAngelesGasoline = losAngelesGas;
    californiaDock = {
      gasoline: losAngelesGas.value - gasoline.value,
      diesel: losAngelesDiesel.value - diesel.value,
    };
  } catch {
    californiaDock = null;
    losAngelesGasoline = null;
  }
  let newYorkGasoline: LatestWeek["newYorkGasoline"] = null;
  let newYorkDiesel: LatestWeek["newYorkDiesel"] = null;
  try {
    newYorkGasoline = await latestValue(SERIES.newYorkGasoline);
  } catch {
    newYorkGasoline = null;
  }
  try {
    newYorkDiesel = await latestValue(SERIES.newYorkDiesel);
  } catch {
    newYorkDiesel = null;
  }
  let ethanol: LatestWeek["ethanol"] = null;
  try {
    const response = await fetch("https://www.ams.usda.gov/mnreports/ams_3616.pdf", { headers: { "User-Agent": "pump-price" } });
    if (response.ok) {
      const dir = await mkdtemp(join(tmpdir(), "pump-ethanol-"));
      const path = join(dir, "ethanol.pdf");
      await writeFile(path, Buffer.from(await response.arrayBuffer()));
      const { stdout } = await execFileAsync("python3", ["-c", READ_ETHANOL, path], { timeout: 20000 });
      const price = iowaEthanolPrice(stdout);
      const dated = stdout.match(/September\s+\d{1,2},\s+\d{4}/);
      if (price !== null) ethanol = { date: dated?.[0] ?? "USDA weekly", dollarsPerGallon: price };
    }
  } catch {
    ethanol = null;
  }
  let refinery: LatestWeek["refinery"] = null;
  try {
    const [utilization, crudeInput, gasolineMade, distillateMade] = await Promise.all([
      latestValue(SERIES.utilization),
      latestValue(SERIES.crudeInput),
      latestValue(SERIES.gasolineMade),
      latestValue(SERIES.distillateMade),
    ]);
    const sameWeek = crudeInput.date === gasolineMade.date && crudeInput.date === distillateMade.date;
    refinery = {
      week: utilization.date,
      utilization: utilization.value,
      gasolineShare: sameWeek ? gasolineMade.value / crudeInput.value : null,
      distillateShare: sameWeek ? distillateMade.value / crudeInput.value : null,
    };
  } catch {
    refinery = null;
  }
  let lag: LatestWeek["lag"] = null;
  let importTravel: ImportTravel | null = null;
  try {
    const gasolineLag = crackDaysBack(gasolineWeeks, crudeWeeks, 15, crude.value);
    const dieselLag = crackDaysBack(dieselWeeks, crudeWeeks, 19, crude.value);
    if (gasolineLag && dieselLag) lag = { gasoline: gasolineLag, diesel: dieselLag };
    const price = (days: number) => crudeDaysAgo(crudeWeeks, crude.date, crude.value, days);
    importTravel = Object.fromEntries(
      (Object.keys(VOYAGES) as VoyageId[]).map((id) => [id, importTravelPerGallon(VOYAGES[id], crude.value, price)]),
    ) as ImportTravel;
  } catch {
    lag = null;
    importTravel = null;
  }
  return {
    week: crude.date,
    crude: crude.value,
    gasolineSpot: gasoline.value,
    dieselSpot: diesel.value,
    gasolineCrack: gasoline.value - perGallon,
    dieselCrack: diesel.value - perGallon,
    quality,
    californiaDock,
    losAngelesGasoline,
    newYorkGasoline,
    newYorkDiesel,
    ethanol,
    refinery,
    lag,
    importTravel,
  };
}
