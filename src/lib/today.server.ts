import { execFile } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import { iowaEthanolPrice } from "../model/ethanol.ts";
import { crudeDaysAgo, importTravelPerGallon } from "../model/state-invoice.ts";
import { VOYAGES, type ImportTravel, type VoyageId } from "../model/voyage.ts";

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
};

const READ_LAST = `
import json, sys, xlrd
wb = xlrd.open_workbook(sys.argv[1])
sh = wb.sheet_by_name("Data 1")
last = None
for r in range(3, sh.nrows):
    raw, v = sh.cell_value(r, 0), sh.cell_value(r, 1)
    if raw == "" or v == "" or v is None:
        continue
    last = {"date": xlrd.xldate_as_datetime(raw, wb.datemode).date().isoformat(), "value": float(v)}
if last is None:
    raise SystemExit("empty workbook")
print(json.dumps(last))
`;

const READ_WEEKS = `
import json, sys, xlrd
wb = xlrd.open_workbook(sys.argv[1])
sh = wb.sheet_by_name("Data 1")
rows = []
for r in range(3, sh.nrows):
    raw, v = sh.cell_value(r, 0), sh.cell_value(r, 1)
    if raw == "" or v == "" or v is None:
        continue
    rows.append({"date": xlrd.xldate_as_datetime(raw, wb.datemode).date().isoformat(), "value": float(v)})
print(json.dumps(rows))
`;

const READ_QUALITY = `
import json, sys, xlrd
wb = xlrd.open_workbook(sys.argv[1])
sh = wb.sheet_by_name("Data 1")
last = None
for r in range(3, sh.nrows):
    raw, sulfur, api = sh.cell_value(r, 0), sh.cell_value(r, 1), sh.cell_value(r, 2)
    if raw == "" or sulfur == "" or api == "" or sulfur is None or api is None:
        continue
    last = {
        "month": xlrd.xldate_as_datetime(raw, wb.datemode).date().isoformat(),
        "sulfur": float(sulfur),
        "api": float(api),
    }
if last is None:
    raise SystemExit("empty quality workbook")
print(json.dumps(last))
`;

const READ_ETHANOL = `
from pypdf import PdfReader
import sys
reader = PdfReader(sys.argv[1])
print("\\n".join((page.extract_text() or "") for page in reader.pages))
`;

async function latestValue(url: string, dir: string, name: string): Promise<{ date: string; value: number }> {
  const response = await fetch(url, { headers: { "User-Agent": "pump-price" } });
  if (!response.ok) throw new Error("the price file did not load");
  const path = join(dir, `${name}.xls`);
  await writeFile(path, Buffer.from(await response.arrayBuffer()));
  const { stdout } = await execFileAsync("python3", ["-c", READ_LAST, path], { timeout: 20000 });
  return JSON.parse(stdout) as { date: string; value: number };
}

type WeekPoint = { date: string; value: number };

async function readWeeks(path: string): Promise<WeekPoint[]> {
  const { stdout } = await execFileAsync("python3", ["-c", READ_WEEKS, path], { timeout: 20000 });
  return JSON.parse(stdout) as WeekPoint[];
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
  const dir = await mkdtemp(join(tmpdir(), "pump-crude-"));
  await latestValue(SERIES.crude, dir, "crude");
  const weeks = await readWeeks(join(dir, "crude.xls"));
  return weeks.filter((row) => row.date >= since);
}

/** The latest published Gulf week, plus the latest crude-quality month. Not the grocery shelf. */
export async function loadLatestWeek(): Promise<LatestWeek> {
  const dir = await mkdtemp(join(tmpdir(), "pump-week-"));
  const [crude, gasoline, diesel] = await Promise.all([
    latestValue(SERIES.crude, dir, "crude"),
    latestValue(SERIES.gasoline, dir, "gasoline"),
    latestValue(SERIES.diesel, dir, "diesel"),
  ]);
  const perGallon = crude.value / 42;
  let quality: LatestWeek["quality"] = null;
  try {
    const response = await fetch(SERIES.quality, { headers: { "User-Agent": "pump-price" } });
    if (response.ok) {
      const path = join(dir, "quality.xls");
      await writeFile(path, Buffer.from(await response.arrayBuffer()));
      const { stdout } = await execFileAsync("python3", ["-c", READ_QUALITY, path], { timeout: 20000 });
      quality = JSON.parse(stdout) as LatestWeek["quality"];
    }
  } catch {
    quality = null;
  }
  let californiaDock: LatestWeek["californiaDock"] = null;
  let losAngelesGasoline: LatestWeek["losAngelesGasoline"] = null;
  try {
    const [losAngelesGas, losAngelesDiesel] = await Promise.all([
      latestValue(SERIES.laGasoline, dir, "la-gasoline"),
      latestValue(SERIES.laDiesel, dir, "la-diesel"),
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
    newYorkGasoline = await latestValue(SERIES.newYorkGasoline, dir, "ny-gasoline");
  } catch {
    newYorkGasoline = null;
  }
  try {
    newYorkDiesel = await latestValue(SERIES.newYorkDiesel, dir, "ny-diesel");
  } catch {
    newYorkDiesel = null;
  }
  let ethanol: LatestWeek["ethanol"] = null;
  try {
    const response = await fetch("https://www.ams.usda.gov/mnreports/ams_3616.pdf", { headers: { "User-Agent": "pump-price" } });
    if (response.ok) {
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
      latestValue(SERIES.utilization, dir, "util"),
      latestValue(SERIES.crudeInput, dir, "crude-in"),
      latestValue(SERIES.gasolineMade, dir, "gas-made"),
      latestValue(SERIES.distillateMade, dir, "dist-made"),
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
    const [crudeWeeks, gasolineWeeks, dieselWeeks] = await Promise.all([
      readWeeks(join(dir, "crude.xls")),
      readWeeks(join(dir, "gasoline.xls")),
      readWeeks(join(dir, "diesel.xls")),
    ]);
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
