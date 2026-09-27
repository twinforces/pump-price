# State grain

Examined 2026-09-27. The human struck the PADD proposal.

**Decision.** The map is the 50 states. Every state shows gasoline and diesel at once. A click opens an inspector with the other prices (hamburger, bread, eggs, milk, toilet paper). District of Columbia is not a state and is not on the map unless asked.

**Finding.** You can price all 50 states. You cannot observe every input in all 50. The Model is allowed to allocate. It is not allowed to hide the allocation.

## What the picture is

Default view: 50 states, each with two numbers.

- Gasoline, automobile emoji 🚗
- Diesel, truck emoji 🚚

Click a state: inspector for that state. The basket uses the emoji already chosen (🍔 🍞 🥚 🥛 🧻). The inspector also shows the basis of each number (below). Hiding the basis would let a copied regional price look like a measurement.

The graph follows the same selection. Before a click, the graph is the US series. After a click, it is that state's series. Levers recalculate immediately.

## What exists at state grain

| Input | All 50? | What we actually have |
| --- | --- | --- |
| Gasoline retail, federal survey | No. 9 states. | EIA-878 weekly regular, all formulations, including tax. States published: California, Colorado, Florida, Massachusetts, Minnesota, New York, Ohio, Texas, Washington. Everyone else is a PADD or sub-PADD. Alaska, Hawaii, and Oregon are not state rows. Table: https://www.eia.gov/dnav/pet/pet_pri_gnd_a_epmr_pte_dpgal_w.htm Week of 2026-09-21, US regular $4.478. |
| Diesel retail, federal survey | No. California only. | EIA-888 weekly on-highway diesel. Published geography is US, PADDs, West Coast less California, and California. https://www.eia.gov/dnav/pet/pet_pri_gnd_a_epd2d_pte_dpgal_w.htm Week of 2026-09-21: US $6.529, California $8.246. The survey frame drops Alaska and Hawaii. https://www.eia.gov/petroleum/supply/weekly/pdf/appendixb.pdf |
| Gasoline and diesel retail, AAA | Yes, plus DC. | AAA state averages publish regular, mid, premium, and diesel. https://gasprices.aaa.com/state-gas-price-averages/ Page dated 2026-09-27, national regular $4.4798. Same-day mirrors list all 50 and DC for both fuels. AAA is a station survey, not the federal sample. It is the baseline picture for the states EIA does not print. It is not a structural model. |
| State fuel tax | Yes. | EIA compiles state gasoline and diesel taxes and fees. As of 2026-01-01, state gasoline taxes and fees ran from 9.0 cents/gal (Alaska) to 70.9 (California). State diesel from 9 cents (Alaska) to 87.3 (California). Federal excise is 18.4 cents gasoline and 24.4 cents diesel, unchanged since October 1993. https://www.eia.gov/todayinenergy/detail.php?id=67165 |
| Refinery capacity | By state, including zeros. | EIA Refinery Capacity Report, Form EIA-820, data for 2026-01-01, released 2026-06-26. Table 1 is count and capacity by PAD district and state. Table 3 is the plant list. https://www.eia.gov/petroleum/refinerycapacity/ A state with no refinery is a real zero, not a missing cell. |
| Crude by country, and heavy/light sour/sweet | Not a state series. | National and global. A state feels crude through which refineries it has and which PADD it sits in. |
| Hamburger, bread, eggs, milk | No. | BLS average prices: about 70 foods at the US city average, and at the four Census regions when the sample is large enough. Not at state. Automotive fuels go further (cities, divisions). Foods do not. https://www.bls.gov/cpi/factsheets/average-prices.htm USDA's Food-at-Home Monthly Area Prices is 15 areas and ends in 2018. It cannot be the live state panel. https://www.ers.usda.gov/data-products/food-at-home-monthly-area-prices/documentation |
| Toilet paper | No. | `CUUR0000SEHN02` is US city average. A regional index may exist. A Wyoming price level does not. |

The old "$4.48 versus $6.50" fight was two fuels. EIA week of 2026-09-21 is $4.478 regular and $6.529 diesel. AAA on 2026-09-27 is about $4.48 regular and about $6.47 diesel. Same story, different product. Do not average them.

## How a state price is allowed to be built

Every displayed price carries a basis:

| Basis | Meaning |
| --- | --- |
| `federal-state` | EIA prints that state for that fuel. |
| `station-survey` | No EIA state row. Baseline comes from AAA for that state. |
| `allocated` | No state measurement. Built from a region, a tax, and a pass-through. Basket items start here. |

Baseline (all levers at the historical setting the fixture names):

- Gasoline in the 9 EIA states matches the EIA state print, not AAA.
- Gasoline elsewhere matches AAA, and must not be a copy of the PADD average pasted onto every state in the district. Neighbors may be close. They may not be identical unless the survey says so.
- Diesel in California matches EIA. Diesel in the other 49 matches AAA. Alaska and Hawaii diesel must not be filled with the PADD 5 number. EIA never sampled those outlets.
- Basket items match the Census region (or US, if that region series is missing), plus a pass-through from that state's fuel gap versus the region. The inspector says `allocated`.

Levers move the structural piece only:

- Tax lever: cents per gallon on that fuel in that state. Retail moves by the tax. The crack does not.
- Refinery lever: only the states (and the plants) the capacity table lists. Shutting a Gulf Coast plant can move other states through the shared barrel. It does not invent a refinery in a state that has none.
- Country lever: changes the crude buckets, then yields, then both fuels. States diverge only where tax, spec, or local capacity differs.
- Green-fuel policy: California and Oregon, as the human named them. Other states join that spec only with a receipt.

A test will fail if six states in one PADD show the same gasoline price at the baseline while AAA says they differ.

## What this does not decide

Coefficients, yields, and the pass-through magnitudes. Those belong in `docs/PRICE-IDENTITY.md`, and they have to reproduce the baseline above before any lever is interesting.

The graph-follows-selection rule is the reading of "map of fuels, inspector of the rest." Strike it if the graph should stay national while the inspector changes.
