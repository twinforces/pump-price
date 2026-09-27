# Briefing

**Role:** Architect.  
**Status:** problem is clear enough to design. Not clear enough to code a price.

## Goal chat

The `/goal` link is a public share of the conversation this repo was supposed to start from.

- Share: https://grok.com/share/bGVnYWN5_3397e417-2d45-47e9-9b1b-9e91146a6122
- Title: Sim Planning for Next Project
- Conversation: `d242a5b4-6f13-4016-a92a-e587e6aa7165`
- Fetched 2026-09-27 from `GET /rest/app-chat/share_links/bGVnYWN5_3397e417-2d45-47e9-9b1b-9e91146a6122` (42 messages). The earlier private URL of the same chat did not load.

The share is a voice planning session. The human lines are the spec. The assistant lines are research leads and pitches. Pitches the human did not adopt are not requirements. Dollar figures in that chat are not calibration until [RECEIPTS.md](RECEIPTS.md) says a series was pulled.

## What the human locked, across that chat and this session

1. Subject is gasoline and diesel prices, plus consumer prices. Minimum fuels are both, from one shared crude barrel. Not gasoline alone.
2. This is a calculator. God levers, not a win condition.
3. Levers: enable or disable refineries, change policies, adjust fuel taxes, enable or disable country supplies. Also sliders and checkboxes (planning chat).
4. Turning a supply off changes American prices because the model recomputes. Events stack. They edit supply and demand. They do not add a fixed price bump. Human: "Exactly what I'm thinking about."
5. Crude quality matters: heavy, light, sour, sweet. Historical data is how the equations get made.
6. Geography the human named: a map of the United States. Country examples: Venezuela, Gulf, Saudi, Iranian. Regional fuel spec: extra green gasoline in California and Oregon, and that it hits refineries.
7. Consumer basket the human named: hamburger (per pound), bread, eggs, milk, and toilet paper. Toilet paper means the BLS household-paper-products series, displayed under that name. Emojis are wanted so the basket is readable.
8. Output: prices on the US map, and a graph of those prices that moves as the levers move.
9. Header, tests, receipts, public repo: see [ARCHITECTURE.md](ARCHITECTURE.md). Those came in this session, not the share.

## Explicitly not adopted

The planning assistant pitched these. The human moved on. They are not in v1 unless asked:

- Map pulsing red when the diesel crack crosses $100.
- Animated trucks and trains that slow down.
- A rewind button. The levers are the what-if.
- Cheese, or a generic box emoji for foods nobody named.
- A minimum build of one fuel.
- Pass-through numbers such as "0.15 cents of beef per gallon of diesel." That was a sketch. The fit decides.
- Any single "diesel is $6.50 today" headline. The same search disagreed with itself. See receipts.

## Still open

These block a honest Model. They do not block the shape of the app.

1. **Price identity.** Which series, which lags, which coefficients. Next Architect note, then tests. Not a View.
2. **Map grain.** Proposal: PADDs for the fuel surface, with California and Oregon (and Washington only if the Pacific Coast spec claim survives a receipt) able to split off when the green-fuel policy is on. Strike this if you want states on day one.
3. **Refinery list.** Individual plants versus regional capacity. The planning chat named LyondellBasell Houston, Phillips 66 Los Angeles, and Valero Benicia. Those names are not toggles until a receipt confirms status and capacity.
4. **Policy catalog.** Seed is fuel tax plus the green West Coast spec. Other policies (export bans, Hormuz) enter as supply edits with a receipt, not as flavor text.
5. **Country-to-quality table.** Countries are switches. Quality buckets are what the market clears. The mapping is data.

## Handoff

Not ready for Implementer. A shell with a fake curve would teach the wrong lesson and the tests would lock the fake.

Next Architect artifact: `docs/PRICE-IDENTITY.md`. One page. The function, the series it must track, and the tests that fail if someone replaces it with a bump.
