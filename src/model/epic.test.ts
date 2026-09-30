import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EPIC_FURY_CLOCK, dailyBarrels, epicFuryPlay } from "./epic.ts";

describe("Epic Fury", () => {
  it("holds a weekly price across the days until the next week", () => {
    const days = dailyBarrels([
      { date: "2026-02-20", value: 70 },
      { date: "2026-02-27", value: 90 },
    ]);
    assert.equal(days[0].date, "2026-02-20");
    assert.equal(days[6].date, "2026-02-26");
    assert.equal(days[6].value, 70);
    assert.equal(days[7].value, 90);
    assert.equal(days.length, 14);
  });

  it("starts the clock a month before the operation and keeps the earlier days for the tank", () => {
    const weeks = [
      { date: "2026-01-23", value: 60 },
      { date: "2026-01-30", value: 70 },
      { date: "2026-02-27", value: 90 },
    ];
    const play = epicFuryPlay(weeks, 5);
    assert.equal(play.history.length, 5);
    assert.equal(play.history[0], 60);
    assert.equal(play.forward[0].date, EPIC_FURY_CLOCK);
    assert.equal(play.forward[0].value, 60);
    assert.equal(play.forward.at(-1)?.value, 90);
  });
});
