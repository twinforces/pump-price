# State grain

Examined 2026-09-27, updated the same day for GasBuddy differentials and Census regions.

**Decision.** The map is the 50 states. Every state shows gasoline and diesel at once. A click opens an inspector with the other prices. Those other prices are Census-region prices, and the inspector says so. District of Columbia is not on the map.

**Finding.** You can price all 50 states. You cannot observe every input in all 50. The Model may allocate. It may not hide the allocation. The hover says which donor and which differential.

## What the picture is

Default view: 50 states, each with gasoline (automobile) and diesel (truck).

Click a state: inspector for hamburger, bread, eggs, milk, and toilet paper, plus the basis of every number. Basket prices are the state's Census region, not a pretend state print.

The graph follows the selection. Before a click, the US series. After a click, that state. Levers recalculate immediately.

Hover or tap on any acronym or price name. Copy is [HOVER.md](HOVER.md).

## Census regions are not UPS zones

BLS food average prices publish at the US and, when the sample is big enough, at the four Census regions. That is the grain we will show. Official names: Northeast, Midwest, South, West. They are statistical groupings, not markets and not delivery areas. State lists are the Census Bureau file `reg_div.txt`.

| Region | States | How wide |
| --- | --- | --- |
| Northeast | Connecticut, Maine, Massachusetts, New Hampshire, New Jersey, New York, Pennsylvania, Rhode Island, Vermont | Nine states. Maine and Pennsylvania share one beef price. |
| Midwest | Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, North Dakota, Ohio, South Dakota, Wisconsin | Twelve states. Ohio and the Dakotas share one milk price. |
| South | Alabama, Arkansas, Delaware, Florida, Georgia, Kentucky, Louisiana, Maryland, Mississippi, North Carolina, Oklahoma, South Carolina, Tennessee, Texas, Virginia, West Virginia. DC is in this region and not on our map. | Sixteen states plus DC. Delaware and Texas share one bread price. |
| West | Alaska, Arizona, California, Colorado, Hawaii, Idaho, Montana, Nevada, New Mexico, Oregon, Utah, Washington, Wyoming | Thirteen states. Honolulu and Denver share one egg price. |

There are also nine Census divisions inside these regions. The BLS average-price factsheet commits food levels to the four regions, not the nine divisions. We do not invent division prices.

UPS zones are a different object. A zone is a distance band from the shipper's own ZIP code to the destination, roughly 2 through 8 in the lower 48, with Alaska and Hawaii farther out. Move the warehouse and every zone number changes. A Census region does not. Wisconsin to Minnesota can be a short UPS haul and still the same Census region as Wisconsin to Ohio. The inspector must not say "regional, like a shipping zone."

## What exists at state grain

| Input | All 50? | What we actually have |
| --- | --- | --- |
| Gasoline retail, federal weekly | No. 9 states. | EIA-878. California, Colorado, Florida, Massachusetts, Minnesota, New York, Ohio, Texas, Washington. Week of 2026-09-21, US regular $4.478. |
| Diesel retail, federal weekly | No. California only. | EIA-888. US, PADDs, West Coast less California, California. Alaska and Hawaii are outside the sample. Week of 2026-09-21: US $6.529, California $8.246. |
| Gasoline, all states, annual | Yes, a different price. | EIA SEDS, code MGACD, back to 1970, dollars per million Btu, federal and state tax included, local tax excluded. Not a weekly street price. |
| Gasoline, all states, monthly | Stopped. | EIA retail by state, excluding taxes, 1983 through 2011. Collection suspended in 2011. Do not extend it. |
| Gasoline and diesel, AAA, current | Yes, plus DC. | A station survey. Baseline cross-section, not a long history. |
| Gasoline, GasBuddy | Chart, not a file. | About 10 years, US states, DC, and Canada. The charts page describes gasoline versus crude. No CSV found. Diesel not mentioned. Fine as the differential, if the hover names it. |
| State fuel tax | Yes. | EIA, as of 2026-01-01. |
| Refinery capacity | By state, including zeros. | EIA-820, 2026-01-01. |
| Hamburger, bread, eggs, milk | Census region. | BLS average prices. |
| Toilet paper | US index. | CUUR0000SEHN02. The inspector still names the Census region and says the index is national. |

## How a state fuel price is built

Every displayed price carries a basis: `federal-state`, `station-survey`, or `allocated`.

Donor rule:

1. If EIA prints that state for that fuel, that series is the history. GasBuddy or AAA is a check.
2. If EIA does not, the shape comes from the EIA area that contains the state (the PADD or sub-PADD, or an EIA state inside that same area). The level is shifted so the state's gap versus the donor matches a named cross-section. GasBuddy for gasoline. AAA for diesel, until a GasBuddy diesel history is actually in hand.
3. The hover states the donor and the differential. No silent borrow from another district.

Legal: "Wisconsin gasoline: weekly shape from EIA Midwest (PADD 2). Level shifted by the GasBuddy gap between Wisconsin and that Midwest series."

Illegal: the same sentence with Colorado as the donor. Colorado is PADD 4. Wisconsin is PADD 2. Minnesota is a legal state donor inside the Midwest.

Alaska and Hawaii diesel must not be copied from PADD 5. EIA never sampled those outlets.

Basket items are `allocated` from the Census region. The hover names the region.

## What this does not decide

The size of any GasBuddy gap, the yields, and the pass-throughs. Those wait for `docs/PRICE-IDENTITY.md`. Pulling GasBuddy's chart into a file is a data task with a receipt, not a reason to invent the gap.
