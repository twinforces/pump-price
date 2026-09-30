/**
 * Operation Epic Fury began February 28, 2026.
 * The barrel is Cushing West Texas Intermediate, a weekly price held until the next week.
 */
export const EPIC_FURY = "2026-02-28";
/** A month before the operation, so the clock shows the run-up instead of starting on the day. */
export const EPIC_FURY_CLOCK = "2026-01-28";

export type DatedPrice = { date: string; value: number };

function dayNumber(iso: string): number {
  return Math.round(Date.parse(`${iso}T00:00:00Z`) / 86400000);
}

function isoDay(day: number): string {
  return new Date(day * 86400000).toISOString().slice(0, 10);
}

/** One row per day. Each weekly price is held until the next week, and one week after the last. */
export function dailyBarrels(weeks: readonly DatedPrice[]): DatedPrice[] {
  if (weeks.length === 0) return [];
  const ordered = [...weeks].sort((a, b) => a.date.localeCompare(b.date));
  const out: DatedPrice[] = [];
  for (let i = 0; i < ordered.length; i += 1) {
    const start = dayNumber(ordered[i].date);
    const end = i + 1 < ordered.length ? dayNumber(ordered[i + 1].date) : start + 7;
    for (let day = start; day < end; day += 1) out.push({ date: isoDay(day), value: ordered[i].value });
  }
  return out;
}

/** The days before January 28, then every day through the last week. The clock starts a month before February 28. */
export function epicFuryPlay(
  weeks: readonly DatedPrice[],
  prerollDays = 120,
): { history: number[]; forward: DatedPrice[] } {
  const daily = dailyBarrels(weeks);
  const start = daily.findIndex((row) => row.date >= EPIC_FURY_CLOCK);
  if (start < 0) return { history: daily.slice(-prerollDays).map((row) => row.value), forward: [] };
  return {
    history: daily.slice(Math.max(0, start - prerollDays), start).map((row) => row.value),
    forward: daily.slice(start),
  };
}
