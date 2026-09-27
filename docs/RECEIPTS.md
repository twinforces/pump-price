# Receipts

Annotated bibliography for Pump Price. Standing rule: if research touched the sim, it is written here in the same change. Status is one of:

- **verified:** we opened it for this repo and the note says what it actually claims.
- **planning-citation:** it appeared in the 2026-09-27 goal chat. Not re-opened as authority.
- **conflict:** two citations disagree. Do not pick a winner here without a series.
- **decision:** a product choice, not a fact about the world.

The Receipts page in the app will render this ledger (or the Model copy of it). Do not let the page drift from this file.

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
| EIA-888 does not sample Alaska or Hawaii | verified | https://www.eia.gov/petroleum/supply/weekly/pdf/appendixb.pdf Diesel publication cells are PADDs, with California split out of PADD 5. Gasoline survey is EIA-878. |
| AAA state fuel averages | verified | https://gasprices.aaa.com/state-gas-price-averages/ Dated 2026-09-27. National regular $4.4798. Table columns include regular, mid, premium, diesel, by state, and DC is a row. Fetched portion ran from Alaska through Tennessee. Same-day mirrors list the remaining states. First data pull must count 50 state rows before a fixture trusts "all 50." |
| EIA state motor fuel taxes | verified | https://www.eia.gov/todayinenergy/detail.php?id=67165 As of 2026-01-01. State gasoline taxes and fees: 9.0 c/gal Alaska to 70.9 California, average 33.5. State diesel: 9 c/gal Alaska to 87.3 California, average 35.5. Federal 18.4 gasoline and 24.4 diesel since October 1993. These state figures include fees, not just the statutory excise. FHWA MF-121T is a different table and was not used. |
| EIA refinery capacity by state | verified as a table that exists | https://www.eia.gov/petroleum/refinerycapacity/ Data for 2026-01-01, released 2026-06-26. Table 1 by PAD district and state. Table 3 by state and refinery. Plant rows were not transcribed this pass. |
| BLS average prices are not state food prices | verified | https://www.bls.gov/cpi/factsheets/average-prices.htm About 70 food average prices at the US level, and at the four Census regions when the sample allows. Automotive fuels also publish for cities and divisions. Foods do not publish for all 50 states. |
| USDA food area prices are not a live state panel | verified | https://www.ers.usda.gov/data-products/food-at-home-monthly-area-prices/documentation Monthly, 2012 through 2018, 15 areas (US, 4 regions, 10 metros). |
| "$4.48 vs $6.50" | verified as a mixup, not a conflict | Those are different products on the same EIA week (regular $4.478, diesel $6.529, week of 2026-09-21). AAA the following Sunday is about $4.48 regular and about $6.47 diesel. Do not reconcile them into one number. |

## Series we will fit against

Title-checked 2026-09-27 unless the note says otherwise. A title check is not a fit.

| Display | Series | Status | What it is |
| --- | --- | --- | --- |
| Hamburger | BLS `APU0000703112` | verified | Ground beef, 100% beef, US city average, $ per pound. https://fred.stlouisfed.org/series/APU0000703112 Item `703112` on the BLS factsheet. |
| Eggs | BLS `APU0000708111` | verified | Grade A large, $ per dozen. https://fred.stlouisfed.org/series/APU0000708111 |
| Milk | BLS `APU0000709112` | verified | Fresh whole fortified, $ per gallon. https://fred.stlouisfed.org/series/APU0000709112 |
| Bread | BLS `APU0000702111` | verified | White pan bread, $ per pound. Item `702111`. https://fred.stlouisfed.org/series/APU0000702111 |
| Gasoline (monthly, CPI) | BLS `APU000074714` | verified | Unleaded regular, $ per gallon, US city average. Item `74714`. https://fred.stlouisfed.org/series/APU000074714 |
| Gasoline (weekly, EIA) | FRED `GASREGW` | verified | US regular, $ per gallon, weekly, includes taxes. https://fred.stlouisfed.org/series/GASREGW |
| Diesel (monthly, CPI) | BLS item `74717` | planning-citation | Factsheet item `74717`, automotive diesel. Full id should be `APU000074717` by the `74714` pattern. Confirm before a fixture. |
| Diesel (weekly, EIA) | the weekly table above | verified | Use the EIA table, not an unchecked FRED id. US and California were read for 2026-09-21. `GASDESW` was not re-fetched. |
| Toilet paper | BLS `CUUR0000SEHN02` | planning-citation | Household paper products, CPI-U, US city average. Human accepted the series and the display name. https://data.bls.gov/timeseries/CUUR0000SEHN02 PPI ids cited only: `WPU091501233`, `WPU091501235`. |

## Claims from the goal chat that are not yet facts in this repo

| Claim | Status | Where it came from |
| --- | --- | --- |
| Heavy sour yields mostly diesel and fuel oil. Light sweet splits about half and half. | planning-citation | Needs an assay or EIA yield table. |
| 3-2-1 crack path and "diesel crack over $100." | planning-citation | Do not encode. |
| US operable refineries 130, down from 135. Named closures: LyondellBasell Houston, Phillips 66 Los Angeles, Valero Benicia. | planning-citation | https://www.eia.gov/todayinenergy/detail.php?id=67807 was in the search list and was not re-read. Confirm against the 2026-01-01 capacity tables before a checkbox exists. |
| ULSD 15 ppm from 2006. | planning-citation | Needs the EPA rule. |
| Russia diesel export ban and a 20 to 40 percent Russian refining loss. | planning-citation | Wide range. Not a supply delta yet. |
| CARB gasoline, Pacific Coast Collaborative, no Gulf pipeline, California diesel a dollar over the national average. | planning-citation | The human asked for extra green gas in California and Oregon. The rest is the assistant's story. EIA does show California diesel far above the US print ($8.246 vs $6.529 on 2026-09-21). The causes are not locked. |
| Food dollar history in the planning chat ($4 to $6.75 beef, and the egg, bread, and milk paths). | planning-citation | Check against the series ids. Do not type them into balance. |
| Beef pass-through of 0.15 cents per gallon of diesel. | planning-citation | The fit can reject it. |

## Product decisions

| Decision | Status | Note |
| --- | --- | --- |
| Display name toilet paper, series household paper products | decision | Human, goal chat. |
| Emoji: gasoline 🚗, diesel 🚚, hamburger 🍔, bread 🍞, eggs 🥚, milk 🥛, toilet paper 🧻 | decision | Human. Truck emoji taken as U+1F69A. Automobile is U+1F697. Roll of paper is U+1F9FB. |
| Map is 50 states. Fuels on the map. Basket in the inspector. | decision | This session. DC excluded. |
| Header and profile link | decision | https://x.com/GrumpyTechBro |
| Public repo | decision | Visibility set public 2026-09-27. |
