import { useEffect, useRef, useState } from "react";
import { pullCrudeWeeks } from "../lib/today";
import { SAVED_WEEK } from "../lib/saved-week";
import { epicFuryPlay } from "../model/epic";
import { DELAY } from "../model/identity";
import { STATION, acquisitionCost, maxGallon, stationSign } from "../model/station";
import { IOWA_ETHANOL, approximateDieselInvoice, approximateStateInvoice } from "../model/state-invoice";
import { STATE_TAXES } from "../model/states";
import { crudeLagDays, productLagDays } from "../model/voyage";
import { inputsFromWeek, type WeekInputs } from "./week-inputs";

const OPENING = inputsFromWeek(SAVED_WEEK);

const SPEEDS = [0.5, 1, 2, 7] as const;
const TRAIL = 28;
const HISTORY = 120;
/** Diesel sells about half as fast, so the same tank lasts twice as many days. */
const DIESEL_HOLD = 2;

function money(dollars: number): string {
  if (!Number.isFinite(dollars)) return "—";
  return `$${dollars.toFixed(2)}`;
}

function Spark({ points }: { points: number[] }) {
  const low = Math.min(...points);
  const high = Math.max(...points);
  const span = high - low || 1;
  const d = points
    .map((value, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 88;
      const y = 20 - ((value - low) / span) * 16;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 88 24" className="h-6 w-24 shrink-0" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function barrelThen(history: readonly number[], live: number, daysAgo: number): number {
  if (daysAgo <= 0) return live;
  const at = history.length - daysAgo;
  return history[Math.max(0, at)] ?? live;
}

function laggedSeries(history: readonly number[], live: number, lag: number): number[] {
  const all = [...history, live];
  const end = all.length - 1;
  const points: number[] = [];
  for (let ago = TRAIL - 1; ago >= 0; ago -= 1) {
    points.push(all[Math.max(0, end - ago - lag)]);
  }
  return points;
}

function states(): string[] {
  const outside = new Set([
    "American Samoa",
    "Guam",
    "Northern Mariana Islands",
    "Puerto Rico",
    "U.S. Virgin Islands",
  ]);
  return STATE_TAXES.map((row) => row.name).filter((name) => !outside.has(name));
}

function invoicePump(name: string, barrel: number, week: WeekInputs): number | null {
  const bill = approximateStateInvoice(
    name,
    barrel,
    week.gasCrack,
    week.losAngelesCrack,
    week.newYorkCrack,
    week.ethanol ?? IOWA_ETHANOL,
    barrel / 42 + week.dieselCrack,
    week.crude,
    null,
    null,
  );
  return bill ? bill.totalCents / 100 : null;
}

function dieselPump(name: string, barrel: number, week: WeekInputs): number | null {
  const bill = approximateDieselInvoice(
    name,
    barrel,
    week.dieselCrack,
    week.losAngelesDiesel,
    week.newYorkDiesel,
    barrel / 42 + week.dieselCrack,
    week.crude,
    null,
    null,
  );
  return bill ? bill.totalCents / 100 : null;
}

export function Timing() {
  const names = states();
  const [name, setName] = useState("Oregon");
  const [week, setWeek] = useState<WeekInputs | null>(OPENING);
  const [note, setNote] = useState(
    OPENING
      ? `Clock is frozen on the dock week of ${OPENING.week}. Move the barrel and it starts.`
      : "The Wednesday snapshot did not load.",
  );
  const [barrel, setBarrel] = useState(OPENING?.crude ?? 70);
  const [history, setHistory] = useState<number[]>(() => Array(HISTORY).fill(OPENING?.crude ?? 70));
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [day, setDay] = useState(0);
  const [replayDate, setReplayDate] = useState<string | null>(null);
  const [loadingReplay, setLoadingReplay] = useState(false);
  const [pumpTrail, setPumpTrail] = useState<number[]>(() => Array(TRAIL).fill(0));
  const [averageTrail, setAverageTrail] = useState<number[]>(() => Array(TRAIL).fill(0));
  const [dieselPumpTrail, setDieselPumpTrail] = useState<number[]>(() => Array(TRAIL).fill(0));
  const [dieselAverageTrail, setDieselAverageTrail] = useState<number[]>(() => Array(TRAIL).fill(0));
  const barrelRef = useRef(barrel);
  const historyRef = useRef(history);
  const weekRef = useRef(week);
  const nameRef = useRef(name);
  const replayRef = useRef<{ prices: number[]; dates: string[]; index: number } | null>(null);
  barrelRef.current = barrel;
  historyRef.current = history;
  weekRef.current = week;
  nameRef.current = name;

  useEffect(() => {
    if (!week) return;
    const gasNow = tankQuote(invoicePump, name, historyRef.current, barrelRef.current, week, "gasoline");
    const dieselNow = tankQuote(dieselPump, name, historyRef.current, barrelRef.current, week, "diesel");
    setPumpTrail(Array(TRAIL).fill(gasNow?.sign ?? 0));
    setAverageTrail(Array(TRAIL).fill(gasNow?.average ?? gasNow?.sign ?? 0));
    setDieselPumpTrail(Array(TRAIL).fill(dieselNow?.sign ?? 0));
    setDieselAverageTrail(Array(TRAIL).fill(dieselNow?.average ?? dieselNow?.sign ?? 0));
  }, [name, week]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const nextHistory = [...historyRef.current, barrelRef.current].slice(-HISTORY);
      historyRef.current = nextHistory;
      const replay = replayRef.current;
      if (replay) {
        if (replay.index >= replay.prices.length) {
          setRunning(false);
        } else {
          const price = replay.prices[replay.index];
          barrelRef.current = price;
          setBarrel(price);
          setReplayDate(replay.dates[replay.index]);
          replay.index += 1;
          if (replay.index >= replay.prices.length) setRunning(false);
        }
      }
      setHistory(nextHistory);
      setDay((n) => n + 1);
      const priced = weekRef.current;
      if (!priced) return;
      const gasNow = tankQuote(invoicePump, nameRef.current, nextHistory, barrelRef.current, priced, "gasoline");
      const dieselNow = tankQuote(dieselPump, nameRef.current, nextHistory, barrelRef.current, priced, "diesel");
      const push = (prev: number[], next: number) => [...prev.slice(-TRAIL + 1), next];
      setPumpTrail((prev) => push(prev, gasNow?.sign ?? prev[prev.length - 1] ?? 0));
      setAverageTrail((prev) => push(prev, gasNow?.average ?? prev[prev.length - 1] ?? 0));
      setDieselPumpTrail((prev) => push(prev, dieselNow?.sign ?? prev[prev.length - 1] ?? 0));
      setDieselAverageTrail((prev) => push(prev, dieselNow?.average ?? prev[prev.length - 1] ?? 0));
    }, 1000 / speed);
    return () => window.clearInterval(id);
  }, [running, speed]);

  const move = (next: number) => {
    const clamped = Math.min(250, Math.max(20, next));
    replayRef.current = null;
    setReplayDate(null);
    barrelRef.current = clamped;
    setBarrel(clamped);
    setRunning(true);
  };

  const replayEpicFury = () => {
    setLoadingReplay(true);
    setNote("Loading the Cushing barrel.");
    void pullCrudeWeeks()
      .then((weeks) => {
        const play = epicFuryPlay(weeks);
        if (play.forward.length === 0) {
          setNote("Epic Fury did not load.");
          return;
        }
        const seeded = play.history.slice(-HISTORY);
        while (seeded.length < 2) seeded.unshift(play.forward[0].value);
        historyRef.current = seeded;
        setHistory(seeded);
        barrelRef.current = play.forward[0].value;
        setBarrel(play.forward[0].value);
        setReplayDate(play.forward[0].date);
        replayRef.current = {
          prices: play.forward.map((row) => row.value),
          dates: play.forward.map((row) => row.date),
          index: 1,
        };
        setDay(0);
        setRunning(true);
        setNote("Epic Fury. Cushing weekly West Texas Intermediate, held until the next week. The clock starts January 28, 2026, a month before the operation.");
      })
      .catch(() => setNote("Epic Fury did not load."))
      .finally(() => setLoadingReplay(false));
  };

  if (!week) return <p className="mt-6 text-sm text-muted">{note}</p>;

  const crudeDays = crudeLagDays(name);
  const plantDays = crudeDays + DELAY.refineryDays;
  const tripDays = productLagDays(name);
  const dieselTripDays = productLagDays(name, "diesel");
  const stationDays = plantDays + tripDays;
  const dieselStationDays = plantDays + dieselTripDays;
  const gas = tankQuote(invoicePump, name, history, barrel, week, "gasoline");
  const diesel = tankQuote(dieselPump, name, history, barrel, week, "diesel");
  const trip =
    tripDays === 0 ? "The terminal is already in this state's wholesale." : "The gallon is on the pipe from the Gulf.";

  const rows = [
    { label: "Barrel", days: 0, value: barrel, unit: "a barrel", points: laggedSeries(history, barrel, 0) },
    {
      label: "Crude at the refinery",
      days: crudeDays,
      value: barrelThen(history, barrel, crudeDays),
      unit: "a barrel",
      points: laggedSeries(history, barrel, crudeDays),
    },
    {
      label: "Out of the refinery",
      days: plantDays,
      value: barrelThen(history, barrel, plantDays),
      unit: "a barrel",
      points: laggedSeries(history, barrel, plantDays),
    },
  ];

  return (
    <section className="mt-6">
      <p className="leading-relaxed">
        Pick a state. The rows are the same barrel, delayed by the trip that state actually waits. Gasoline and
        diesel each get that state's invoice for the gallon that has arrived. The price will not fall under the
        dearest gallon still in the tank.
      </p>
      <p className="mt-3 text-sm text-muted">{note}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm">
          State{" "}
          <select
            className="ml-2 border border-line bg-paper px-2 py-2"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          >
            {names.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-muted">{replayDate ? `${replayDate} · day ${day}` : running ? `Day ${day}` : "Frozen"}</p>
        <button
          type="button"
          className="border border-line px-3 py-2 text-sm"
          disabled={!running}
          onClick={() => setRunning(false)}
        >
          Pause
        </button>
        <button
          type="button"
          className="border border-line px-3 py-2 text-sm"
          disabled={loadingReplay}
          onClick={replayEpicFury}
        >
          {loadingReplay ? "Loading" : "Replay Epic Fury"}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {SPEEDS.map((rate) => (
          <button
            key={rate}
            type="button"
            className={`border border-line px-3 py-1 text-sm ${speed === rate ? "bg-ink text-paper" : ""}`}
            onClick={() => setSpeed(rate)}
          >
            {rate} day/s
          </button>
        ))}
      </div>
      <div className="mt-4 border border-line p-4">
        <div className="flex items-center gap-3">
          <p className="text-2xl">{money(barrel)} a barrel</p>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button type="button" className="border border-line px-3 py-2 text-sm" onClick={() => move(barrel - 10)}>
            −$10
          </button>
          <input
            className="w-full accent-rust"
            type="range"
            min={20}
            max={250}
            step={0.01}
            value={barrel}
            onChange={(event) => move(Number(event.currentTarget.value))}
            onInput={(event) => move(Number(event.currentTarget.value))}
          />
          <button type="button" className="border border-line px-3 py-2 text-sm" onClick={() => move(barrel + 10)}>
            +$10
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line py-2">
            <div>
              <p>{row.label}</p>
              <p className="text-sm text-muted">{row.days === 0 ? "Today" : `${row.days} days ago`}</p>
            </div>
            <div className="flex items-center gap-3">
              <Spark points={row.points} />
              <p className="w-28 text-right">
                {money(row.value)} <span className="text-sm text-muted">{row.unit}</span>
              </p>
            </div>
          </div>
        ))}
        <p className="text-sm text-muted">
          Three days inside the refinery. {trip}{" "}
          {dieselStationDays === stationDays
            ? "Gasoline and diesel arrive together."
            : `Diesel is ${dieselTripDays - tripDays} days behind on the same pipe.`}{" "}
          Gasoline leaves the tank in {STATION.tankDays} days. Diesel sells half as fast, so its tank is{" "}
          {STATION.tankDays * DIESEL_HOLD} days.
        </p>
        <div className="mt-4 grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 border-b border-line py-2 text-sm text-muted">
          <span />
          <span>Gasoline</span>
          <span>Diesel</span>
        </div>
        <Pair
          label="Arrives"
          gasDetail={stationDays === 0 ? "Today, the barrel" : `${stationDays} days ago, the barrel`}
          dieselDetail={dieselStationDays === 0 ? "Today, the barrel" : `${dieselStationDays} days ago, the barrel`}
          gasValue={barrelThen(history, barrel, stationDays)}
          dieselValue={barrelThen(history, barrel, dieselStationDays)}
          gasTrail={null}
          dieselTrail={null}
        />
        <Pair
          label="Refill"
          gasDetail="This state's invoice"
          dieselDetail="This state's invoice"
          gasValue={gas?.refill ?? null}
          dieselValue={diesel?.refill ?? null}
          gasTrail={null}
          dieselTrail={null}
        />
        <Pair
          label="Average gallon in the tank"
          gasDetail=""
          dieselDetail=""
          gasValue={gas?.average ?? null}
          dieselValue={diesel?.average ?? null}
          gasTrail={averageTrail}
          dieselTrail={dieselAverageTrail}
        />
        <Pair
          label="Dearest gallon in the tank"
          gasDetail=""
          dieselDetail=""
          gasValue={gas?.dearest ?? null}
          dieselValue={diesel?.dearest ?? null}
          gasTrail={null}
          dieselTrail={null}
        />
        <Pair
          label="Price at the pump"
          gasDetail=""
          dieselDetail=""
          gasValue={gas?.sign ?? null}
          dieselValue={diesel?.sign ?? null}
          gasTrail={pumpTrail}
          dieselTrail={dieselPumpTrail}
          strong
        />
      </div>
    </section>
  );
}

function Pair({
  label,
  gasDetail,
  dieselDetail,
  gasValue,
  dieselValue,
  gasTrail,
  dieselTrail,
  strong,
}: {
  label: string;
  gasDetail: string;
  dieselDetail: string;
  gasValue: number | null;
  dieselValue: number | null;
  gasTrail: number[] | null;
  dieselTrail: number[] | null;
  strong?: boolean;
}) {
  return (
    <div className={`grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-3 border-b border-line py-2 ${strong ? "text-lg" : ""}`}>
      <span>{label}</span>
      <Cell detail={gasDetail} value={gasValue} trail={gasTrail} />
      <Cell detail={dieselDetail} value={dieselValue} trail={dieselTrail} />
    </div>
  );
}

function Cell({
  detail,
  value,
  trail,
}: {
  detail: string;
  value: number | null;
  trail: number[] | null;
}) {
  const shown = trail && trail.some((n) => n > 0) ? trail : trail ? Array(TRAIL).fill(value ?? 0) : null;
  return (
    <div>
      {detail ? <p className="text-sm text-muted">{detail}</p> : null}
      <div className="flex items-center gap-2">
        {shown ? <Spark points={shown} /> : null}
        <span>{value === null ? "—" : money(value)}</span>
      </div>
    </div>
  );
}

type PumpOf = (name: string, barrel: number, week: WeekInputs) => number | null;
type TankQuote = { refill: number; average: number; dearest: number; sign: number };

function tankQuote(
  pump: PumpOf,
  name: string,
  history: readonly number[],
  live: number,
  week: WeekInputs,
  fuel: "gasoline" | "diesel",
): TankQuote | null {
  const stationDays = crudeLagDays(name) + DELAY.refineryDays + productLagDays(name, fuel);
  const refill = pump(name, barrelThen(history, live, stationDays), week);
  if (refill === null) return null;
  const hold = STATION.tankDays * (fuel === "diesel" ? DIESEL_HOLD : 1);
  const prior = Array.from({ length: hold }, (_, index) => {
    const ago = stationDays + hold - index;
    return pump(name, barrelThen(history, live, ago), week) ?? refill;
  });
  return { refill, average: acquisitionCost(prior), dearest: maxGallon(prior), sign: stationSign(prior, refill) };
}
