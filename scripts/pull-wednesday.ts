/**
 * Wednesday snapshot. The Energy Information Administration posts at 10:30 Eastern.
 * Run after that. Writes the dock week and the AAA station table the app ships with.
 * The page does not fetch either one. Publish after this file changes.
 */
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { surveyFromAaaRows } from "../src/model/aaa.ts";
import { loadLiveWeek } from "../src/lib/today.server.ts";

const AAA = "https://gasprices.aaa.com/state-gas-price-averages/";

async function stationTable(): Promise<{ date: string; rows: string[][] }> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const response = await page.goto(AAA, { waitUntil: "domcontentloaded", timeout: 45000 });
    if (!response || response.status() !== 200) throw new Error("the station survey did not load");
    return await page.evaluate(() => {
      const date = document.body.innerText.match(/Price as of\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/)?.[1] ?? "";
      const table = document.querySelector("#sortable");
      const rows = [...(table?.querySelectorAll("tbody tr") ?? [])].map((tr) =>
        [...tr.querySelectorAll("td")].map((td) => td.textContent?.trim() ?? ""),
      );
      return { date, rows };
    });
  } finally {
    await browser.close();
  }
}

const [week, table] = await Promise.all([loadLiveWeek(), stationTable()]);
const survey = surveyFromAaaRows(table.date, table.rows);
const { stale: _stale, ...cached } = week;
await writeFile(new URL("../src/lib/saved-week.json", import.meta.url), `${JSON.stringify(cached, null, 2)}\n`);
await writeFile(new URL("../src/model/survey-cache.json", import.meta.url), `${JSON.stringify(survey, null, 2)}\n`);
console.log(`Dock week ${cached.week}, barrel ${cached.crude}. Station survey ${survey.asOf}.`);
