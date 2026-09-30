import type { LatestWeek } from "../lib/today";
import { regionalBarrel } from "../model/haul";
import type { ImportTravel } from "../model/voyage";

/** The latest published week, shaped the way an invoice asks for it. */
export type WeekInputs = {
  week: string;
  crude: number;
  gasCrack: number;
  dieselCrack: number;
  losAngelesCrack: number | null;
  losAngelesDiesel: number | null;
  newYorkCrack: number | null;
  newYorkDiesel: number | null;
  ethanol: number | null;
  laggedGas: number | null;
  laggedDiesel: number | null;
  importTravel: ImportTravel | null;
};

export function inputsFromWeek(week: LatestWeek): WeekInputs | null {
  if (!Number.isFinite(week.crude) || !Number.isFinite(week.gasolineCrack) || !Number.isFinite(week.dieselCrack)) {
    return null;
  }
  const losAngelesCrack = week.losAngelesGasoline
    ? week.losAngelesGasoline.value - regionalBarrel(week.crude, "california") / 42
    : null;
  const newYorkCrack = week.newYorkGasoline
    ? week.newYorkGasoline.value - regionalBarrel(week.crude, "east") / 42
    : null;
  const losAngelesDiesel = week.californiaDock
    ? week.dieselSpot + week.californiaDock.diesel - regionalBarrel(week.crude, "california") / 42
    : null;
  const newYorkDiesel = week.newYorkDiesel
    ? week.newYorkDiesel.value - regionalBarrel(week.crude, "east") / 42
    : null;
  return {
    week: week.week,
    crude: week.crude,
    gasCrack: week.gasolineCrack,
    dieselCrack: week.dieselCrack,
    losAngelesCrack,
    losAngelesDiesel,
    newYorkCrack,
    newYorkDiesel,
    ethanol: week.ethanol?.dollarsPerGallon ?? null,
    laggedGas: week.lag?.gasoline.crack ?? null,
    laggedDiesel: week.lag?.diesel.crack ?? null,
    importTravel: week.importTravel,
  };
}
