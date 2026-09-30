import { useEffect, useState } from "react";
import { pullLatestWeek } from "../lib/today";
import { SAVED_WEEK } from "../lib/saved-week";
import { IOWA_ETHANOL } from "../model/state-invoice";
import { PriceMap } from "./us-map";
import { inputsFromWeek, type WeekInputs } from "./week-inputs";

function money(dollars: number): string {
  return `$${dollars.toFixed(2)}`;
}

export function StationFlow() {
  const [week, setWeek] = useState<WeekInputs | null>(null);
  const [note, setNote] = useState("Loading the latest week.");

  useEffect(() => {
    let live = true;
    void pullLatestWeek()
      .then((pulled) => {
        if (!live) return;
        const next = inputsFromWeek(pulled);
        if (!next) {
          setNote("The latest week did not load.");
          return;
        }
        setWeek(next);
        setNote(
          pulled.stale
            ? `The live file did not load. Showing the week of ${next.week}.`
            : `Week of ${next.week}. Gulf gasoline at the dock ${money(pulled.gasolineSpot)}, diesel ${money(pulled.dieselSpot)}.`,
        );
      })
      .catch(() => {
        if (!live) return;
        const next = inputsFromWeek(SAVED_WEEK);
        if (!next) {
          setNote("The latest week did not load.");
          return;
        }
        setWeek(next);
        setNote(`The live file did not load. Showing the week of ${next.week}.`);
      });
    return () => {
      live = false;
    };
  }, []);

  if (!week) return <p className="mt-6 text-sm text-muted">{note}</p>;

  return (
    <section className="mt-6">
      <p className="leading-relaxed">
        Click a state. Gasoline and diesel each get one invoice, at this week's barrel. The map color is
        the station survey.
      </p>
      <p className="mt-3 text-sm text-muted">{note}</p>
      <p className="mt-3 text-2xl">{money(week.crude)} a barrel</p>
      <PriceMap
        gulfBarrel={week.crude}
        gulfCrack={week.gasCrack}
        gulfDieselCrack={week.dieselCrack}
        losAngelesGasolineCrack={week.losAngelesCrack}
        losAngelesDieselCrack={week.losAngelesDiesel}
        newYorkGasolineCrack={week.newYorkCrack}
        newYorkDieselCrack={week.newYorkDiesel}
        crackAnchor={week.crude}
        laggedGasolineCrack={week.laggedGas}
        laggedDieselCrack={week.laggedDiesel}
        ethanolPerGallon={week.ethanol ?? IOWA_ETHANOL}
        importTravel={week.importTravel}
      />
    </section>
  );
}
