import saved from "./saved-week.json" with { type: "json" };
import type { LatestWeek } from "./today";

/** The dock week shipped with this build. scripts/pull-wednesday.ts writes the file. */
export const SAVED_WEEK: LatestWeek = saved;
