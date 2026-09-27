# Receipts

Annotated bibliography for Pump Price. Standing rule: if research touched the sim, it is written here in the same change. Status is one of:

- **verified:** we opened it for this repo and the note says what it actually claims.
- **planning-citation:** it appeared in the 2026-09-27 goal chat. Not re-opened as authority.
- **conflict:** two citations disagree. Do not pick a winner here without a series.
- **decision:** a product choice, not a fact about the world.

The Receipts page in the app will render this ledger (or the Model copy of it). Do not let the page drift from this file.

## Donor, regions, hover (2026-09-27, later)

| Item | Status | Note |
| --- | --- | --- |
| GasBuddy charts | verified | https://www.gasbuddy.com/charts About 10 years of gasoline, chart on the page, up to three areas, US and Canada. No CSV on that page. Diesel is not mentioned. |
| EIA all-state gasoline history | verified | https://www.eia.gov/tools/faqs/faq.php?id=26&t=10 SEDS annual, every state, from 1970, code MGACD, dollars per million Btu, federal and state tax in, local tax out. Monthly all-state retail excluding taxes ran 1983 through 2011, then stopped. Not diesel. |
| Four Census regions | verified | Names on https://www.census.gov/programs-surveys/popest/guidance-geographies/terms-and-definitions.html Membership in https://www2.census.gov/geo/docs/maps-data/maps/reg_div.txt |
| UPS zones are not those regions | verified | A zone is looked up from the shipper's origin to the destination. https://www.ups.com/assets/resources/media/daily_rates.pdf section "Determine the Zone." |
| Hover copy | decision | [HOVER.md](HOVER.md). Hamburger says diesel. Toilet paper says mostly electricity. The planning chat also named natural gas at the paper mill. The hover does not split that bill. |
| Donor rule | decision | Shape from the EIA area that contains the state. Gap from GasBuddy for gasoline, from AAA for diesel until a diesel history is in hand. Colorado is not a donor for Wisconsin. |

## How to read the planning chat

The goal share searched the web and stated a lot of numbers. Treat the chat as a map of where to look, not as data.

| Item | Status | Note |
| --- | --- | --- |
| Goal share | verified | https://grok.com/share/bGVnYWN5_3397e417-2d45-47e9-9b1b-9e91146a6122 Title: Sim Planning for Next Project. Conversation `d242a5b4-6f13-4016-a92a-e587e6aa7165`. 42 messages. Human lines are the spec. Fetched 2026-09-27. |
| Private chat URL | verified | https://grok.com/c/d242a5b4-6f13-4016-a92a-e587e6aa7165 did not return a transcript without a management key. Same conversation as the share. |

## State grain (2026-09-27)

| Item | Status | Note |
| --- | --- | --- |
| EIA weekly regular gasoline by area | verified | https://www.eia.gov/dnav/pet/pet_pri_gnd_a_epmr_pte_dpgal_w.htm State rows: California, Colorado, Florida, Massachusetts, Minnesota, New York, Ohio, Texas, Washington. Not Alaska, Hawaii, or Oregon. Week of 2026-09-21, US $4.478/gal. |
| EIA weekly on-highway diesel by area | verified | https://www.eia.gov/dnav/pet/pet_pri_gnd_a_epd2d_pte_dpgal_w.htm State row: California only, plus US, PADDs, and West Coast less California. Week of 2026-09-21: US $6.529, California $8.246. |
| EIA-888 does not sample Alaska or Hawaii | verified | https://www.eia.gov/petroleum/supply/weekly/pdf/appendixb.pdf |
| AAA state fuel averages | verified | https://gasprices.aaa.com/state-gas-price-averages/ Dated 2026-09-27. National regular $4.4798. |
| EIA state motor fuel taxes | verified | https://www.eia.gov/todayinenergy/detail.php?id=67165 As of 2026-01-01. Gasoline fees 9.0 c/gal Alaska to 70.9 California. Diesel 9 to 87.3 California. Federal 18.4 and 24.4 since October 1993. |
| EIA refinery capacity by state | verified as a table that exists | https://www.eia.gov/petroleum/refinerycapacity/ Data for 2026-01-01. Plant rows not transcribed. |
| BLS food average prices | verified | https://www.bls.gov/cpi/factsheets/average-prices.htm US, and the four Census regions when the sample allows. Not 50 states. |
| USDA food area prices | verified | https://www.ers.usda.gov/data-products/food-at-home-monthly-area-prices/documentation 15 areas, 2012 through 2018. Not a live panel. |
| "$4.48 vs $6.50" | verified as a mixup | Regular $4.478 and diesel $6.529 on the EIA week of 2026-09-21. |

## Series we will fit against

| Display | Series | Status | What it is |
| --- | --- | --- | --- |
| Hamburger | BLS `APU0000703112` | verified | 100% ground beef, US city average, $ per pound. |
| Eggs | BLS `APU0000708111` | verified | Grade A large, per dozen. |
| Milk | BLS `APU0000709112` | verified | Fresh whole, per gallon. |
| Bread | BLS `APU0000702111` | verified | White pan bread, per pound. |
| Gasoline monthly CPI | BLS `APU000074714` | verified | Unleaded regular, US city average. |
| Gasoline weekly US | FRED `GASREGW` | verified | EIA via FRED. |
| Diesel monthly CPI | BLS item `74717` | planning-citation | Likely `APU000074717`. Confirm before a fixture. |
| Diesel weekly EIA | the weekly table above | verified | US and California read for 2026-09-21. |
| Toilet paper | BLS `CUUR0000SEHN02` | planning-citation | Household paper products, US city average. https://data.bls.gov/timeseries/CUUR0000SEHN02 |

## Claims from the goal chat that are not yet facts

| Claim | Status | Where it came from |
| --- | --- | --- |
| Heavy sour versus light sweet yields. | planning-citation | Needs an assay. |
| Crack-spread dollar path, including a diesel crack over $100. | planning-citation | Do not encode. |
| 130 refineries, down from 135. Named closures. | planning-citation | Confirm on the 2026-01-01 capacity tables before a checkbox exists. |
| ULSD 15 ppm from 2006. Russia export ban. 20 to 40 percent of Russian refining. | planning-citation | Not a supply delta yet. |
| CARB, Pacific Coast Collaborative, no Gulf pipeline. | planning-citation | Human did ask for greener gasoline in California and Oregon. |
| Beef pass-through of 0.15 cents per gallon of diesel. | planning-citation | The hover may say diesel moves the meat. The coefficient is not 0.15 until a fit says so. |

## Product decisions

| Decision | Status | Note |
| --- | --- | --- |
| Toilet paper is the display name | decision | Series is household paper products. |
| Emoji | decision | Gasoline automobile, diesel truck, then hamburger, bread, eggs, milk, roll of paper. |
| Map is 50 states. Fuels on the map. Basket in the inspector, by Census region. | decision | DC off the map. |
| Header | decision | https://x.com/GrumpyTechBro |
| Public repo | decision | Set public 2026-09-27. |
