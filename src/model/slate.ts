/** Four kinds of crude. A picture of the slate, not a measured world pie, and not a price. */
export const SLATE = ["lightSweet", "lightSour", "heavySweet", "heavySour"] as const;

export type SlateKind = (typeof SLATE)[number];

export const SLATE_NAME: Record<SlateKind, string> = {
  lightSweet: "Light sweet",
  lightSour: "Light sour",
  heavySweet: "Heavy sweet",
  heavySour: "Heavy sour",
};

export type SlateShares = Record<SlateKind, number>;

export const EVEN_SLATE: SlateShares = {
  lightSweet: 25,
  lightSour: 25,
  heavySweet: 25,
  heavySour: 25,
};

/** Move one share and scale the others so the four still add to 100. Integers, so the thumb does not fight itself. */
export function setShare(shares: SlateShares, kind: SlateKind, next: number): SlateShares {
  if (!Number.isFinite(next)) return shares;
  const clamped = Math.round(Math.min(100, Math.max(0, next)));
  const others = SLATE.filter((item) => item !== kind);
  const otherSum = others.reduce((sum, item) => sum + shares[item], 0);
  const rest = 100 - clamped;
  const out: SlateShares = { ...shares, [kind]: clamped };
  if (otherSum === 0) {
    const even = Math.floor(rest / others.length);
    let spare = rest - even * others.length;
    for (const item of others) {
      out[item] = even + (spare > 0 ? 1 : 0);
      spare -= 1;
    }
    return out;
  }
  const raw = others.map((item) => (shares[item] / otherSum) * rest);
  const floors = raw.map((value) => Math.floor(value));
  let spare = rest - floors.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, frac: value - floors[index] }))
    .sort((a, b) => b.frac - a.frac);
  for (const item of order) {
    if (spare <= 0) break;
    floors[item.index] += 1;
    spare -= 1;
  }
  others.forEach((item, index) => {
    out[item] = floors[index];
  });
  return out;
}

/** What the slate is built for. Not a yield, and not a cents figure. */
export function slateNote(shares: SlateShares): string {
  const light = shares.lightSweet + shares.lightSour;
  const heavy = shares.heavySweet + shares.heavySour;
  if (heavy > light + 5) {
    return "More of this slate is heavy. Diesel plants are built for that. It does not change the dock price.";
  }
  if (shares.lightSweet > shares.lightSour && shares.lightSweet > shares.heavySweet && shares.lightSweet > shares.heavySour) {
    return "Light sweet is the biggest slice. That is the news barrel. It favors gasoline. It does not change the dock price.";
  }
  return "A mixed slate. The dock price is still the extra slider. We have not measured a cents-per-share.";
}
