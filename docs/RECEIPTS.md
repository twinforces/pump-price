# Receipts

Annotated bibliography for Pump Price. If research touched the sim, it is written here in the same change.

Plain-language versions of the fuel districts and the state energy ledger are in [PLAIN-LANGUAGE.md](PLAIN-LANGUAGE.md).

## Grocery specificity (2026-09-27)

| Item | Status | Note |
| --- | --- | --- |
| Fuel districts, state lists | verified | [PLAIN-LANGUAGE.md](PLAIN-LANGUAGE.md). Wikipedia "Petroleum Administration for Defense Districts," checked against the Energy Information Administration Petroleum Supply Monthly appendix, August 2026. |
| Retail milk by city | verified | Agriculture Department, Agricultural Marketing Service, Retail Milk Prices, September 24, 2026. https://www.ams.usda.gov/mnreports/ams_3356.pdf Selected cities. Three outlets. Conventional whole milk. United States simple average $3.97 a gallon. Not every state. |
| Regional price parities | verified | Bureau of Economic Analysis. https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area An index versus the country, not a gallon. 2024 overall: California 110.7, Arkansas 86.9. Goods are a separate index and still not groceries alone. |
| Numbeo city prices | verified as crowdsourced | https://www.numbeo.com/cost-of-living/city_price_rankings_main Milk per liter, bread per 500 grams, eggs per dozen, beef per kilogram. Wrong packages for our series. Not a sample survey. |
| Self.inc grocery article | opened | https://www.self.inc/info/grocery-prices-by-state/ Walmart.com near one ZIP per state, one moment. |
| What's the Grocery Bill | do not use yet | https://whatsthegrocerybill.com/ Says state food prices come from the Labor Department. The Labor Department factsheet says food average prices are national and regional, not by state. |
| Milk city, other foods regional | decision | If the milk report surveys a city in the state, use that city and name it. Otherwise the Census region. Hamburger, bread, and eggs stay on the region. Toilet paper stays national. |

## Donor, regions, hover (2026-09-27, later)

| Item | Status | Note |
| --- | --- | --- |
| GasBuddy charts | verified | https://www.gasbuddy.com/charts About 10 years of gasoline. No download on that page. Diesel not mentioned. |
| All-state annual gasoline | verified | https://www.eia.gov/tools/faqs/faq.php?id=26&t=10 State Energy Data System, every state, from 1970, code MGACD, dollars per million British thermal units. Monthly all-state pump prices excluding taxes ran 1983 through 2011, then stopped. |
| Four Census regions | verified | https://www.census.gov/programs-surveys/popest/guidance-geographies/terms-and-definitions.html and https://www2.census.gov/geo/docs/maps-data/maps/reg_div.txt |
| Shipping zones are not regions | verified | A zone is distance from the shipper. https://www.ups.com/assets/resources/media/daily_rates.pdf |
| Hover copy | decision | [HOVER.md](HOVER.md). |
| Donor rule | decision | Shape from the fuel district that contains the state. Gap from GasBuddy for gasoline. American Automobile Association for diesel until a diesel history is in hand. |

## State grain

| Item | Status | Note |
| --- | --- | --- |
| Weekly regular gasoline, nine states | verified | https://www.eia.gov/dnav/pet/pet_pri_gnd_a_epmr_pte_dpgal_w.htm California, Colorado, Florida, Massachusetts, Minnesota, New York, Ohio, Texas, Washington. Week of 2026-09-21, United States $4.478. |
| Weekly highway diesel | verified | https://www.eia.gov/dnav/pet/pet_pri_gnd_a_epd2d_pte_dpgal_w.htm California plus the districts. Week of 2026-09-21: United States $6.529, California $8.246. Alaska and Hawaii are outside the sample. https://www.eia.gov/petroleum/supply/weekly/pdf/appendixb.pdf |
| Automobile Association state averages | verified | https://gasprices.aaa.com/state-gas-price-averages/ 2026-09-27. National regular $4.4798. |
| State fuel taxes | verified | https://www.eia.gov/todayinenergy/detail.php?id=67165 As of 2026-01-01. |
| Refinery capacity by state | verified as a table that exists | https://www.eia.gov/petroleum/refinerycapacity/ Data for 2026-01-01. Plants not transcribed. |
| Food average prices are not by state | verified | https://www.bls.gov/cpi/factsheets/average-prices.htm |
| Scanner food prices, 15 areas, 2012-2018 | verified | https://www.ers.usda.gov/data-products/food-at-home-monthly-area-prices/documentation |
| "$4.48 vs $6.50" | mixup | Regular versus diesel on the same federal week. |

## Series

| Display | Series | Status |
| --- | --- | --- |
| Hamburger | `APU0000703112` | verified. Ground beef, per pound. |
| Eggs | `APU0000708111` | verified. Grade A large, per dozen. |
| Milk, national | `APU0000709112` | verified. Fresh whole, per gallon. City survey overrides this where it exists. |
| Bread | `APU0000702111` | verified. White pan bread, per pound. |
| Gasoline, monthly | `APU000074714` | verified. |
| Gasoline, weekly national | `GASREGW` | verified. |
| Diesel, monthly | item `74717` | planning-citation. Confirm the full id. |
| Toilet paper | `CUUR0000SEHN02` | planning-citation. Household paper products. https://data.bls.gov/timeseries/CUUR0000SEHN02 |

## Goal chat, not yet facts

Yields, crack-spread dollars, named refinery closures, the 15-parts-per-million sulfur rule, the Russia stories, and a beef pass-through of 0.15 cents per gallon are planning-chat claims. The hover may say diesel moves meat. The coefficient is not locked. The human did ask for greener gasoline in California and Oregon.

Goal share: https://grok.com/share/bGVnYWN5_3397e417-2d45-47e9-9b1b-9e91146a6122

## Product decisions

| Decision | Note |
| --- | --- |
| Map | 50 states. Gasoline and diesel on the map. Inspector for the rest. No District of Columbia. |
| Basket grain | Census region, except milk when a surveyed city exists. |
| Public repo | Set public 2026-09-27. |
