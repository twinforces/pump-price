# Changelog

What / Why / How, plus the git hash when we have it. Failures stay here.

## 2026-09-27 State grain

- **What:** Map is the 50 states. Gasoline (automobile emoji) and diesel (truck emoji) on every state. Click opens the basket. Wrote [STATE-GRAIN.md](STATE-GRAIN.md). Corrected the "$4.48 vs $6.50" note: those are gasoline and diesel, not two estimates of one price.
- **Why:** A PADD map was the wrong picture. The human asked whether state prices are even possible before we invent a formula.
- **How:** Opened the EIA weekly gasoline and diesel tables, the EIA-888 sampling note, the AAA state average page, the BLS average-price factsheet, the EIA January 2026 tax note, and the refinery capacity report landing page. Did not download the plant-level workbook.
- **Finding:** AAA can fill a 50-state fuel map. EIA cannot, except 9 gasoline states and California diesel. Food and paper are regional or national. Taxes and refinery capacity are real state inputs. Alaska and Hawaii diesel must not be copied from PADD 5.
- **Hash:** this commit.

## 2026-09-27 Design lock, still no code

- **What:** Repo is public. Master design, architecture, and a receipts ledger. Calculator, not a game.
- **Why:** The goal chat was specific enough to stop guessing the product, and not specific enough to invent yields.
- **How:** Public share plus a BLS/FRED title check.
- **Hash:** 26d34c37b49daee76cbd7266e9f7ed45c90b6343

## 2026-09-27 Bootstrap

- **What:** Created private repo, then learned private was wrong. Product name Pump Price, repo `pump-price`.
- **Why:** GitHub names cannot contain a space. Code before a briefing would have frozen guesses.
- **How:** Ringmaster Architect pass from `twinforces/grokdevprompts`.
- **Hash:** 71ec8c6a3d8dc168098a52b9254ce1eeed917273
