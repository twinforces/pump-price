# Receipts

Annotated bibliography for Pump Price. Standing rule: if research touched the sim, it is written here in the same change. Status is one of:

- **verified:** we opened it for this repo and the note says what it actually claims.
- **planning-citation:** it appeared in the 2026-09-27 goal chat. Not re-opened as authority.
- **conflict:** two citations disagree. Do not pick a winner here without a series.
- **decision:** a product choice, not a fact about the world.

The Receipts page in the app will render this ledger (or the Model copy of it). Do not let the page drift from this file.

## How to read the planning chat

The goal share searched the web and stated a lot of numbers. Several of those numbers conflict inside one answer. Treat the chat as a map of where to look, not as data.

| Item | Status | Note |
| --- | --- | --- |
| Goal share | verified | https://grok.com/share/bGVnYWN5_3397e417-2d45-47e9-9b1b-9e91146a6122 Title: Sim Planning for Next Project. Conversation `d242a5b4-6f13-4016-a92a-e587e6aa7165`. 42 messages. Human lines are the spec. Fetched 2026-09-27. |
| Private chat URL | verified | https://grok.com/c/d242a5b4-6f13-4016-a92a-e587e6aa7165 did not return a transcript without a management key. Same conversation as the share. |

## Series we will fit against

These ids were checked against a BLS factsheet or a FRED series page on 2026-09-27, except where the note says otherwise. Pulling the numbers is still future work. A title check is not a fit.

| Display | Series | Status | What it is |
| --- | --- | --- | --- |
| Hamburger | BLS `APU0000703112` via FRED | verified | Average price, ground beef, 100% beef, US city average, $ per pound. Not chuck, not patties. https://fred.stlouisfed.org/series/APU0000703112 and https://www.bls.gov/cpi/factsheets/average-prices.htm item `703112`. |
| Eggs | BLS `APU0000708111` | verified | Grade A large, $ per dozen, US city average. https://fred.stlouisfed.org/series/APU0000708111 |
| Milk | BLS `APU0000709112` | verified | Fresh whole fortified milk, $ per gallon, US city average. https://fred.stlouisfed.org/series/APU0000709112 |
| Bread | BLS `APU0000702111` | verified | White pan bread, $ per pound, US city average. https://fred.stlouisfed.org/series/APU0000702111 Item code `702111` on the BLS average-price factsheet. |
| Gasoline (monthly, CPI) | BLS `APU000074714` | verified | Unleaded regular, $ per gallon, US city average. https://fred.stlouisfed.org/series/APU000074714 Item `74714`. |
| Gasoline (weekly, EIA) | FRED `GASREGW` | verified | US regular all formulations, $ per gallon, weekly Monday, includes taxes. EIA via FRED. https://fred.stlouisfed.org/series/GASREGW |
| Diesel (monthly, CPI) | BLS item `74717` | planning-citation | Factsheet lists automotive diesel fuel, per gallon, item `74717`. Full id should be `APU000074717` by the same pattern as `74714` -> `APU000074714`. Confirm the id exists before a fixture uses it. https://www.bls.gov/cpi/factsheets/average-prices.htm |
| Diesel (weekly, EIA) | FRED `GASDESW` | planning-citation | Usual FRED id for EIA on-highway diesel. Not re-fetched this pass (request failed). Confirm before a fixture. |
| Toilet paper | BLS `CUUR0000SEHN02` | planning-citation | Household paper products, CPI-U, US city average, not seasonally adjusted. Human accepted this series and the display name "toilet paper." There is no toilet-paper-only CPI. https://data.bls.gov/timeseries/CUUR0000SEHN02 Cited in the goal chat. PPI side, also only cited: `WPU091501233`, `WPU091501235`. |
| EIA retail table | EIA petroleum prices | planning-citation | https://www.eia.gov/dnav/pet/pet_pri_gnd_dcus_nus_a.htm and the weekly gasoline and diesel update https://www.eia.gov/petroleum/gasdiesel/ Regional (PADD) columns live here. This is why the map-grain proposal is PADD and not a guess. |

## Claims from the goal chat that are not yet facts in this repo

| Claim | Status | Where it came from |
| --- | --- | --- |
| Heavy sour yields mostly diesel and fuel oil. Light sweet splits about half and half. | planning-citation | Assistant summary. Needs an assay or EIA yield table before the Model uses it. |
| 3-2-1 crack: about $71/bbl in May 2022, under $2 in April 2020, about $74 in late August 2026. Diesel crack over $100, gasoline crack around $50, "right now." | planning-citation | Assistant summary during the share. Do not encode. |
| National diesel around $6.50 and also around $4.48 in the same September 2026 search. | conflict | Goal-chat search hits included AAA, EIA, and news pages that did not agree. Examples: https://gasprices.aaa.com/ https://www.eia.gov/petroleum/gasdiesel/ https://www.hngn.com/articles/273106/20260907/oil-nears-97-us-diesel-hits-record-hormuz-traffic-thins.htm No winner until we read one primary table. |
| US operable refineries 130, down from 135. Capacity down about 4% since 2020. | planning-citation | https://www.eia.gov/todayinenergy/detail.php?id=67807 was in the search list. Not re-read. |
| Closures: LyondellBasell Houston, Phillips 66 Los Angeles, Valero Benicia. California lost about a quarter of capacity. | planning-citation | Named in the assistant reply. Secondary roundup https://eco3min.fr/en/us-refinery-closures-since-2020-2 Confirm plant by plant before a checkbox exists. |
| ULSD 15 ppm hydrotreating, mandate from 2006, is the diesel cost story rather than "diesel is harder to refine." | planning-citation | Assistant reply. Needs the EPA rule, not a blog. |
| Russia banned diesel exports in July. Ukrainian strikes removed 20 to 40 percent of Russian refining. | planning-citation | News-shaped. Wide range. Not a supply delta until a quantity and a date have a source. |
| West Coast is a fuel island. CARB gasoline. Oregon and Washington follow via the Pacific Coast Collaborative. No pipeline from the Gulf. California diesel a dollar or more over the national average. | planning-citation | Human asked for extra green gas in California and Oregon. The rest is the assistant's CARB story. Verify before the policy toggle hard-codes a dollar. |
| Ground beef about $4/lb in 2020 to $6.75 by mid-2026. Eggs $6.23 in March 2025 then $2.27. Bread $1.35 to $1.82. Milk $3.25 to $4.23. | planning-citation | Assistant summary. The series ids above are how we check them. Do not type these into balance. |
| Beef pass-through about 0.15 cents per gallon of diesel. Eggs and bread near zero. Paper tracks natural gas. | planning-citation | Sketch. The fit can reject every one of these. |

## Product decisions (not facts)

| Decision | Status | Note |
| --- | --- | --- |
| Display name toilet paper, series household paper products | decision | Human, goal chat. |
| Emoji: 🥛 🍞 🥚 🍔 🧻 | decision | Human asked for emoji. Roll of paper is Unicode U+1F9FB. https://emojipedia.org/roll-of-paper was in the chat's search list. |
| Header and profile link | decision | This session. Profile https://x.com/GrumpyTechBro |
| Public repo | decision | Private costs money. Visibility set public 2026-09-27. |
