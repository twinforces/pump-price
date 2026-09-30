import { createServerFn } from "@tanstack/react-start";
import type { ImportTravel } from "../model/voyage.ts";

export type LatestWeek = {
  week: string;
  crude: number;
  gasolineSpot: number;
  dieselSpot: number;
  gasolineCrack: number;
  dieselCrack: number;
  quality: { month: string; api: number; sulfur: number } | null;
  /** Los Angeles dock minus the Gulf dock for that week. Null if those files did not load. */
  californiaDock: { gasoline: number; diesel: number } | null;
  /** Los Angeles reformulated gasoline, dollars per gallon. Null if that file did not load. */
  losAngelesGasoline: { date: string; value: number } | null;
  /** New York harbor reformulated gasoline. Null if that file did not load. */
  newYorkGasoline: { date: string; value: number } | null;
  /** New York harbor ultra-low-sulfur diesel. Null if that file did not load. */
  newYorkDiesel: { date: string; value: number } | null;
  /** Iowa ethanol plant, dollars per gallon. Null if the weekly report did not load. */
  ethanol: { date: string; dollarsPerGallon: number } | null;
  /** What the fleet ran, and what share of the crude came back as each fuel. */
  refinery: {
    week: string;
    utilization: number;
    gasolineShare: number | null;
    distillateShare: number | null;
  } | null;
  /** Gulf crack versus this week's crude, from the dock about 15 and 19 days earlier. */
  lag: {
    gasoline: { date: string; crack: number };
    diesel: { date: string; crack: number };
  } | null;
  importTravel: ImportTravel | null;
};

export const pullLatestWeek = createServerFn({ method: "GET" }).handler(async (): Promise<LatestWeek> => {
  const { loadLatestWeek } = await import("./today.server");
  return loadLatestWeek();
});

export type CrudeWeek = { date: string; value: number };

/** Cushing weekly West Texas Intermediate, from the fall before Epic Fury. */
export const pullCrudeWeeks = createServerFn({ method: "GET" }).handler(async (): Promise<CrudeWeek[]> => {
  const { loadCrudeWeeks } = await import("./today.server");
  return loadCrudeWeeks("2025-09-01");
});
