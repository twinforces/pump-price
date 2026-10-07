import { useRef, useState } from "react";
import { ordinaryHarborCrack, regionalBarrel } from "../model/haul";
import { regionOf } from "../model/region";
import { recipeFor } from "../model/recipes";
import { applyDieselMarketFactor, approximateDieselInvoice, approximateStateInvoice, barrelOnThisBill, unnamedVersusSurvey, type ImportTravel } from "../model/state-invoice";
import { voyageFor } from "../model/voyage";
import { REFINERIES_AS_OF, refineriesIn } from "../model/refineries";
import { SURVEY_AS_OF, stationDiesel, stationRegular } from "../model/survey";
import { US_PATHS } from "./us-paths";

function money(dollars: number): string {
  if (!Number.isFinite(dollars)) return "—";
  const amount = Math.abs(dollars).toFixed(2);
  return dollars < 0 ? `-$${amount}` : `$${amount}`;
}

function moneyCents(cents: number): string {
  if (!Number.isFinite(cents)) return "—";
  if (cents !== 0 && Math.abs(cents) < 1) return `${cents.toFixed(1)}¢`;
  return money(cents / 100);
}

function tone(price: number, low: number, high: number): string {
  const span = high - low;
  const raw = span === 0 ? 0.5 : Math.min(1, Math.max(0, (price - low) / span));
  const t = 0.28 + 0.72 * raw;
  const r = Math.round(246 + (196 - 246) * t);
  const g = Math.round(243 + (92 - 243) * t);
  const b = Math.round(236 + (38 - 236) * t);
  return `rgb(${r} ${g} ${b})`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function defineLine(label: string, state = ""): string {
  if (label === "Oil") return "The crude in the gallon. A barrel holds 42 gallons.";
  if (label === "Oil replaced by ethanol") return "Ten percent of a gasoline gallon is not crude. This takes that tenth off. A higher barrel makes this credit larger.";
  if (label === "Import pricing lag") {
    const diet = voyageFor(state);
    const rest = " Negative means that crude cost less than this week's barrel.";
    if (diet === "washington") return "Washington has no crude of its own. Alaska comes by ship, Canada by pipe, and Bakken by rail. Oregon's fuel is refined there, so it takes the same trip. This is that mix minus this week's barrel." + rest;
    if (diet === "east") return "These plants run foreign crude. West Africa is about two weeks. The Middle East is about a month. A little was already in Appalachia, and a little came up from the Gulf." + rest;
    if (diet === "midwest") return "Most of this crude is Canadian, about two weeks in the pipe. The rest was already in the Midwest." + rest;
    if (diet === "gulf") return "Most of this crude was already on the Gulf. Canada is about two weeks in the pipe. Mexico is a few days by ship. The Middle East is about five weeks." + rest;
    if (diet === "rockies") return "About half of this crude is Canadian, about a week in the pipe. The rest was already in the Rockies." + rest;
    if (diet === "alaska") return "Alaska's crude is pumped in the state. It was not on a ship." + rest;
    if (diet === "hawaii") return "Hawaii has no crude of its own. This is the West Coast mix that comes by ship, without California's wells." + rest;
    return "California's own wells are already there. The rest is Alaska by ship, Canada by pipe, and Atlantic barrels through Panama. This is that mix minus this week's barrel." + rest;
  }
  if (label === "Ethanol, 10 percent") return "What the ethanol costs. Ten percent of the gallon, at the Iowa plant price. It does not follow the barrel.";
  if (label === "Ethanol freight") return "Rail from the Midwest plant to the terminal. A 2013 study put that at about 13 cents a gallon of ethanol to the East, 14 to the Gulf, and about 20 to the West Coast. This gallon is one tenth ethanol, so that is 1 cent, or 2 cents in the West and California.";
  if (label === "Renewable fuel credit") return "The federal credit a refiner turns in under the Renewable Fuel Standard. About 34 cents a gallon in 2026. It is not the ethanol in the tank.";
  if (label === "Pipeline, Houston to Linden") return "Colonial, from Houston to Greensboro, then the smaller line to Linden, at New York Harbor. Gasoline takes 14 days and 16 hours. Diesel takes about 19 days.";
  if (label === "Pipeline travel lag") return "The Gulf price moved while that batch was in the pipe. Negative means the batch was cheaper than this week's Gulf price.";
  if (label.startsWith("Pipeline")) return "A filed pipeline rate for a named place. It is not the tanker to the station.";
  if (label === "Crude transport") return "The extra these refiners paid for a gallon of crude over the Gulf barrel. The pipe and the ship are in that, and so is the kind of crude. It is not a filed freight rate.";
  if (label === "Running the refinery") return "What it costs to run the plant, not what the refiner keeps. Valero, second quarter 2026: $4.70 a barrel of throughput, 11 cents a gallon. A year earlier it was $4.91.";
  if (label === "Refinery depreciation") return "The plant wearing out. Valero, second quarter 2026: $2.36 a barrel, 6 cents a gallon. This is an accounting charge, not cash paid for this gallon.";
  if (label === "California recipe") return "The extra cost of California's blend. Michael Mische, University of Southern California, May 2025: 15 cents for the 2024 standard. The Air Resources Board's original range was 5 to 15 cents. Gasoline only.";
  if (label === "Los Angeles over the Gulf") return "Los Angeles this week minus the Gulf, after the extra paid for California crude.";
  if (label === "Refiner profit, Puget Sound") return "What the Puget Sound refineries keep after the costs on this bill. Oregon is the same number.";
  if (label === "Market factor") return "What buyers pay for diesel above gasoline's profit and the hydrotreater.";
  if (label === "Hydrotreater") return "Taking sulfur out of diesel, down to 15 parts per million. The Energy Information Administration priced a rebuilt unit at about 5 cents a gallon. A new unit was about 6.";
  if (label.startsWith("Refiner profit")) return "What is left after the costs on this bill. On diesel, the same profit as gasoline.";
  if (label === "Wholesale") return "The bulk price, before the tanker and the tax. A branded station does not necessarily pay this. The brand sets that price, and it can differ by neighborhood.";
  if (label === "Clean Fuels Program") return "Oregon's cleaner-gasoline standard. 9.35 cents a gallon of gasoline with 10 percent ethanol.";
  if (label === "Clean Fuel Standard") return "Washington's cleaner-fuel standard, in cents per gallon.";
  if (label === "Other distribution") return "California's distribution costs besides the tanker, the card fee, the store, the building, and the station profit. Diesel uses the same figure. The state did not publish a diesel series.";
  if (label === "Refiner's sale over the spot") return "One cent a Gulf refiner charged over the spot price, through March 2022. Carried forward.";
  if (label.startsWith("Tanker stop")) return "The delivery stop, spread over the gallons in the tanker.";
  if (label.startsWith("Tanker contract")) return "The agreed haul from the wholesale terminal to the station, priced as if diesel were $3 a gallon.";
  if (label.startsWith("Tanker surcharge")) return "The extra cost of that haul when diesel is above $3 a gallon.";
  if (label === "Detergent") return "Injected into the tanker at the rack. Every gasoline gallon has to have some. Chevron's package is called Techron. The published bound is less than a cent. This line is half a cent.";
  if (label === "Card fees") return "Three percent of the sale. The high end of what a processor charges.";
  if (label === "Store") return "Labor, utilities, and the counter, per gallon. Doubled on diesel because those gallons sell more slowly.";
  if (label === "Building") return "The building, the tanks, and the pumps, per gallon. Doubled on diesel for the same reason.";
  if (label === "Station Profit") return "What the station aims to keep on a gallon. Ten cents for gasoline. Twenty for diesel.";
  if (label === "Federal tax") return "The federal tax. 18.4 cents on gasoline, 24.4 cents on diesel.";
  if (label === "State tax" || label === "State excise tax") return "The state tax on a gallon.";
  if (label === "Underground tank fee") return "A fee on fuel put in an underground tank.";
  if (label === "Cap and trade") return "California's charge for the carbon in the fuel.";
  if (label === "Low-carbon fuel standard") return "California's charge for a fuel that is not low-carbon.";
  if (label === "State and local sales tax") return "A percent of the gallon, not a flat cents-per-gallon tax.";
  if (/tax/i.test(label)) return "A tax that is not inside the main state tax line.";
  if (label === "Price@Pump") return "Every line on this bill, added up.";
  if (label.startsWith("Station survey")) return "What stations in this state were charging on the survey date.";
  if (label === "Theory vs. Reality") return "The station survey minus this bill. Negative means the sign is below the bill. A station will do that to get people into the store.";
  if (label === "Barrel that matches the survey") return "The oil price that would make this bill equal the survey. If it is a recent barrel, the gap is lag. If it is nowhere near a real barrel, the bill is missing a cost.";
  return "";
}

function Hint({ label, state = "", className = "" }: { label: string; state?: string; className?: string }) {
  const tip = defineLine(label, state);
  return (
    <span title={tip || undefined} className={tip ? `cursor-help underline decoration-dotted underline-offset-2 ${className}` : className}>
      {label}
    </span>
  );
}

function cell(cents: number | null): string {
  return cents === null || !Number.isFinite(cents) ? "—" : moneyCents(cents);
}

/** One label per row. A line that belongs to only one fuel is a dash on the other side. */
function alignBills(
  gasoline: { label: string; cents: number }[],
  diesel: { label: string; cents: number }[],
): { label: string; gas: number | null; diesel: number | null }[] {
  const gasCents = new Map(gasoline.map((line) => [line.label, line.cents]));
  const dieselCents = new Map(diesel.map((line) => [line.label, line.cents]));
  const labels = gasoline.map((line) => line.label);
  for (let j = 0; j < diesel.length; j++) {
    if (labels.includes(diesel[j].label)) continue;
    let insertAt = labels.length;
    for (let k = j - 1; k >= 0; k--) {
      const at = labels.indexOf(diesel[k].label);
      if (at !== -1) {
        insertAt = at + 1;
        break;
      }
    }
    labels.splice(insertAt, 0, diesel[j].label);
  }
  return labels.map((label) => ({
    label,
    gas: gasCents.get(label) ?? null,
    diesel: dieselCents.get(label) ?? null,
  }));
}

export function PriceMap({
  gulfBarrel,
  gulfCrack,
  gulfDieselCrack,
  losAngelesGasolineCrack = null,
  losAngelesDieselCrack = null,
  newYorkGasolineCrack = null,
  newYorkDieselCrack = null,
  crackAnchor = null,
  laggedGasolineCrack = null,
  laggedDieselCrack = null,
  ethanolPerGallon = null,
  importTravel = null,
}: {
  gulfBarrel: number;
  gulfCrack: number;
  gulfDieselCrack: number;
  /** A pulled week. Null uses the ordinary dock gap, not that week's spot. */
  losAngelesGasolineCrack?: number | null;
  losAngelesDieselCrack?: number | null;
  newYorkGasolineCrack?: number | null;
  newYorkDieselCrack?: number | null;
  crackAnchor?: number | null;
  laggedGasolineCrack?: number | null;
  laggedDieselCrack?: number | null;
  ethanolPerGallon?: number | null;
  importTravel?: ImportTravel | null;
}) {
  const [show, setShow] = useState<"price" | "refineries">("price");
  const [name, setName] = useState("Texas");
  const [hover, setHover] = useState<{ name: string; x: number; y: number } | null>(null);
  const box = useRef<HTMLElement>(null);
  const prices = US_PATHS.map((state) => stationRegular(state.name));
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const capacities = US_PATHS.map((state) =>
    refineriesIn(state.name).reduce((sum, refinery) => sum + refinery.barrelsPerDay, 0),
  );
  const most = Math.max(...capacities);
  const plants = refineriesIn(name);
  const plantBarrels = plants.reduce((sum, refinery) => sum + refinery.barrelsPerDay, 0);
  const recipe = recipeFor(name);
  const dieselForTheTanker = regionalBarrel(gulfBarrel, regionOf(name).id) / 42 + gulfDieselCrack;

  return (
    <section ref={box} className="relative mt-4 border border-line p-4">
      <h2 className="text-xl">Every state</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        The color is the station survey for {SURVEY_AS_OF}. Click a state for its own recipe.
      </p>
      <div className="mt-3 flex gap-2 text-sm">
        <button
          type="button"
          className={`border border-line px-3 py-1 ${show === "price" ? "bg-ink text-paper" : ""}`}
          onClick={() => setShow("price")}
        >
          Price
        </button>
        <button
          type="button"
          className={`border border-line px-3 py-1 ${show === "refineries" ? "bg-ink text-paper" : ""}`}
          onClick={() => setShow("refineries")}
        >
          Refineries
        </button>
      </div>
      <svg viewBox="0 0 959 593" className="mt-3 w-full" role="img" aria-label="United States, priced by state">
        {US_PATHS.map((state) => {
          const gasoline = stationRegular(state.name);
          const diesel = stationDiesel(state.name);
          const barrels = refineriesIn(state.name).reduce((sum, refinery) => sum + refinery.barrelsPerDay, 0);
          const selected = state.name === name;
          const fill = show === "refineries" ? (barrels === 0 ? "#f6f3ec" : tone(barrels, 0, most)) : tone(gasoline, low, high);
          const place = (event: { clientX: number; clientY: number }) => {
            const rect = box.current?.getBoundingClientRect();
            if (!rect) return;
            setHover({ name: state.name, x: event.clientX - rect.left, y: event.clientY - rect.top });
          };
          return state.d.map((path) => (
            <path
              key={`${state.name}-${path.slice(0, 16)}`}
              d={path}
              fill={fill}
              stroke={selected ? "#1f4e79" : "#f6f3ec"}
              strokeWidth={selected ? 2.5 : 1}
              className="cursor-pointer"
              aria-label={`${state.name} gasoline ${money(gasoline)} diesel ${money(diesel)}`}
              onClick={() => setName(state.name)}
              onMouseEnter={place}
              onMouseMove={place}
              onMouseLeave={() => setHover(null)}
            >
              <title>{`${state.name}  gasoline ${money(gasoline)}  diesel ${money(diesel)}`}</title>
            </path>
          ));
        })}
      </svg>
      {hover ? (
        <div
          className="pointer-events-none absolute z-10 border border-line bg-paper px-2 py-1 text-sm"
          style={{ left: hover.x + 12, top: hover.y + 12 }}
        >
          <div>{hover.name}</div>
          <div>Gasoline {money(stationRegular(hover.name))}</div>
          <div>Diesel {money(stationDiesel(hover.name))}</div>
        </div>
      ) : null}
      <p className="mt-1 text-sm text-muted">
        {show === "refineries"
          ? `No refineries, up to ${Math.round(most / 1000)} thousand barrels a day. Darker has more capacity.`
          : `${money(low)} to ${money(high)}. Darker is dearer.`}
      </p>
      <div className="mt-4 border border-line p-4">
        <h3 className="text-lg">{name}</h3>
        <div className="mt-2 space-y-1 text-sm leading-relaxed">
          {recipe.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <Row label={`Gasoline, ${SURVEY_AS_OF}`} value={money(stationRegular(name))} />
          <Row label={`Diesel, ${SURVEY_AS_OF}`} value={money(stationDiesel(name))} />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {plants.length === 0
            ? `No refineries here, ${REFINERIES_AS_OF}. The gallons are made in another state. Getting them here is distribution. A filed rate is entered only when it names a place in this state.`
            : `${plants.length} refineries, ${Math.round(plantBarrels / 1000)} thousand barrels a day, ${REFINERIES_AS_OF}.`}
        </p>
        {plants.slice(0, 5).map((refinery) => (
          <div key={`${refinery.site}-${refinery.company}`} className="mt-1 grid grid-cols-[1fr_auto] gap-3 text-sm">
            <span>
              {refinery.site}
              <span className="text-muted"> {refinery.company}</span>
            </span>
            <span>{Math.round(refinery.barrelsPerDay / 1000)} kb/d</span>
          </div>
        ))}
        {plants.length > 5 ? <p className="mt-1 text-sm text-muted">and {plants.length - 5} more.</p> : null}
        <PairedBill
          state={name}
          gulfBarrel={gulfBarrel}
          gasoline={approximateStateInvoice(
            name,
            gulfBarrel,
            gulfCrack,
            losAngelesGasolineCrack ?? ordinaryHarborCrack(gulfCrack, "california", "gasoline"),
            newYorkGasolineCrack ?? ordinaryHarborCrack(gulfCrack, "east", "gasoline"),
            ethanolPerGallon,
            dieselForTheTanker,
            crackAnchor,
            laggedGasolineCrack,
            importTravel,
          )}
          diesel={approximateDieselInvoice(
            name,
            gulfBarrel,
            gulfDieselCrack,
            losAngelesDieselCrack ?? ordinaryHarborCrack(gulfDieselCrack, "california", "diesel"),
            newYorkDieselCrack ?? ordinaryHarborCrack(gulfDieselCrack, "east", "diesel"),
            dieselForTheTanker,
            crackAnchor,
            laggedDieselCrack,
            importTravel,
          )}
          gasolineSurvey={stationRegular(name)}
          dieselSurvey={stationDiesel(name)}
        />
      </div>
    </section>
  );
}

function PairedBill({
  state,
  gulfBarrel,
  gasoline,
  diesel,
  gasolineSurvey,
  dieselSurvey,
}: {
  state: string;
  gulfBarrel: number;
  gasoline: ReturnType<typeof approximateStateInvoice>;
  diesel: ReturnType<typeof approximateDieselInvoice>;
  gasolineSurvey: number;
  dieselSurvey: number;
}) {
  if (!gasoline || !diesel) {
    return <p className="mt-4 text-sm">This invoice has no dock.</p>;
  }
  const dieselBill = applyDieselMarketFactor(diesel, gasoline);
  const gasolineBarrel = barrelOnThisBill(gasoline, gasolineSurvey, gulfBarrel);
  const dieselBarrel = barrelOnThisBill(dieselBill, dieselSurvey, gulfBarrel);
  const rows = alignBills(gasoline.lines, dieselBill.lines);
  const wholesalePart = (label: string) =>
    label === "Oil" ||
    label === "Oil replaced by ethanol" ||
    label === "Import pricing lag" ||
    label === "Crude transport" ||
    label === "Ethanol, 10 percent" ||
    label === "Ethanol freight" ||
    label === "Renewable fuel credit" ||
    label === "Running the refinery" ||
    label === "Refinery depreciation" ||
    label === "California recipe" ||
    label === "Los Angeles over the Gulf" ||
    label === "Hydrotreater" ||
    label === "Refiner's sale over the spot" ||
    label.startsWith("Refiner profit") ||
    label === "Market factor" ||
    label.startsWith("Pipeline");
  const sumWholesale = (lines: { label: string; cents: number }[]) =>
    lines.filter((line) => wholesalePart(line.label)).reduce((sum, line) => sum + line.cents, 0);
  let lastWholesale = -1;
  for (let i = 0; i < rows.length; i++) {
    if (wholesalePart(rows[i].label)) lastWholesale = i;
  }
  const shown: { label: string; gas: number | null; diesel: number | null }[] = [];
  for (let i = 0; i < rows.length; i++) {
    shown.push(rows[i]);
    if (i === lastWholesale) {
      shown.push({
        label: "Wholesale",
        gas: sumWholesale(gasoline.lines),
        diesel: sumWholesale(dieselBill.lines),
      });
    }
  }
  return (
    <div className="mt-4 border-t border-line pt-4 text-sm">
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1">
        <span />
        <span className="text-right">Gasoline</span>
        <span className="text-right">Diesel</span>
        {shown.flatMap((row) => [
          <Hint key={row.label} label={row.label} state={state} className={row.label === "Wholesale" ? "border-t border-line pt-2" : ""} />,
          <span key={`${row.label}-g`} className={`text-right ${row.label === "Wholesale" ? "border-t border-line pt-2" : ""}`}>{cell(row.gas)}</span>,
          <span key={`${row.label}-d`} className={`text-right ${row.label === "Wholesale" ? "border-t border-line pt-2" : ""}`}>{cell(row.diesel)}</span>,
        ])}
        <Hint label="Price@Pump" className="border-t border-line pt-2" />
        <span className="border-t border-line pt-2 text-right">{money(gasoline.totalCents / 100)}</span>
        <span className="border-t border-line pt-2 text-right">{money(dieselBill.totalCents / 100)}</span>
        <Hint label={`Station survey, ${SURVEY_AS_OF}`} className="text-muted" />
        <span className="text-right text-muted">{money(gasolineSurvey)}</span>
        <span className="text-right text-muted">{money(dieselSurvey)}</span>
        <Hint label="Theory vs. Reality" />
        <span className="text-right">{money(unnamedVersusSurvey(gasoline.totalCents, gasolineSurvey) / 100)}</span>
        <span className="text-right">{money(unnamedVersusSurvey(dieselBill.totalCents, dieselSurvey) / 100)}</span>
        <Hint label="Barrel that matches the survey" />
        <span className="text-right">{gasolineBarrel === null ? "—" : `$${gasolineBarrel}`}</span>
        <span className="text-right">{dieselBarrel === null ? "—" : `$${dieselBarrel}`}</span>
      </div>
    </div>
  );
}
