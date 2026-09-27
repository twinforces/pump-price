# Recent goals

Short scratchpad. Older items move to CHANGELOG.md.

## Write the state price identity

- **What:** One function from scenario to 50 state price vectors, each number tagged `federal-state`, `station-survey`, or `allocated`.
- **Why:** The map is states. EIA does not print gasoline for 41 of them, or diesel for 49. The identity has to say which baseline it is matching or the map will lie.
- **How:** `docs/PRICE-IDENTITY.md`, using [STATE-GRAIN.md](STATE-GRAIN.md) as the constraint. No `src/` until the baseline tests are named against fixtures, not headlines.
- **Hash:** 14814979cf46de87d7b86d4973bc36dc03ffb564

## Done

- **What:** Examined state coverage for fuels, taxes, refineries, and the basket. Locked car and truck emoji. Struck the PADD map.
- **Why:** The human asked for this before any other modeling.
- **How:** EIA weekly tables, EIA-888 methodology, AAA state page, BLS average-price factsheet, EIA tax note, EIA refinery capacity report.
- **Hash:** 14814979cf46de87d7b86d4973bc36dc03ffb564
