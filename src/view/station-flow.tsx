import { SAVED_WEEK } from "../lib/saved-week";
import { IOWA_ETHANOL } from "../model/state-invoice";
import { SURVEY_AS_OF } from "../model/survey";
import { PriceMap } from "./us-map";
import { inputsFromWeek } from "./week-inputs";

function money(dollars: number): string {
  return `$${dollars.toFixed(2)}`;
}

const WEEK = inputsFromWeek(SAVED_WEEK);

export function StationFlow() {
  if (!WEEK) return <p className="mt-6 text-sm text-muted">The Wednesday snapshot did not load.</p>;

  return (
    <section className="mt-6">
      <p className="leading-relaxed">
        Click a state. Gasoline and diesel each get one invoice, at this week's barrel. The map color is
        the station survey.
      </p>
      <p className="mt-3 text-sm text-muted">
        Dock week of {WEEK.week}. Gulf gasoline at the dock {money(SAVED_WEEK.gasolineSpot)}, diesel{" "}
        {money(SAVED_WEEK.dieselSpot)}. Station survey {SURVEY_AS_OF}.
      </p>
      <p className="mt-3 text-2xl">{money(WEEK.crude)} a barrel</p>
      <PriceMap
        gulfBarrel={WEEK.crude}
        gulfCrack={WEEK.gasCrack}
        gulfDieselCrack={WEEK.dieselCrack}
        losAngelesGasolineCrack={WEEK.losAngelesCrack}
        losAngelesDieselCrack={WEEK.losAngelesDiesel}
        newYorkGasolineCrack={WEEK.newYorkCrack}
        newYorkDieselCrack={WEEK.newYorkDiesel}
        crackAnchor={WEEK.crude}
        laggedGasolineCrack={WEEK.laggedGas}
        laggedDieselCrack={WEEK.laggedDiesel}
        ethanolPerGallon={WEEK.ethanol ?? IOWA_ETHANOL}
        importTravel={WEEK.importTravel}
      />
    </section>
  );
}
