# Architecture

Stewarded by the Architect. Implementer fills bodies only after `docs/PRICE-IDENTITY.md` exists. That file is not written yet. The constraints it has to satisfy are in [STATE-GRAIN.md](STATE-GRAIN.md).

Precedent for the folders, not for the rules: [GTB911sim](https://github.com/twinforces/GTB911sim) and [Hormuz Toll](https://github.com/twinforces/hormuzboardgame).

## Why MVVM

The user said it plainly: when we code, use MVVM and unit test the hell out of the Model and the ViewModel. It is worth it because this calculator is an argument about prices. If the argument lives in React, nobody can test it without a browser, and a pretty map can hide a bump.

## Layers

```
src/model/        scenario in, prices out. No React. No DOM. No SVG.
src/viewmodel/    lever commands, map labels, graph series, inspector. No drawing.
src/view/         header, map, graph, inspector, lever chrome.
src/routes/       thin wrappers. No economics.
```

Rules:

1. The View never constructs the engine. The ViewModel does.
2. The ViewModel never draws. It exposes commands and labels.
3. The Model never imports React, the DOM, or SVG.
4. Pixels, emoji, and the profile photo are View concerns. Dollars, barrels, and the basis flag are Model concerns.
5. Same scenario plus the same dataset returns the same prices. No clock, no randomness, unless a later note adds a seed and tests it.
6. Every coefficient that is a choice lives in one balance module, with a comment pointing at a receipt. No magic numbers in the engine.
7. A state price without a basis is not a price. The three values are `federal-state`, `station-survey`, and `allocated`.

## Header (product spec, not optional)

- Title text: `Pump Price`
- Icon: the GrumpyTechBro profile photo, icon sized. Vendor a copy in the repo when the View is built. Do not hotlink a profile image that can change or 404. Current source, as of this note: `https://pbs.twimg.com/profile_images/1965515426500411395/gzTcXSc1.jpg`
- Subtitle text: `a GrumpyTechBro joint`
- The subtitle is a link to `https://x.com/GrumpyTechBro` with `target="_blank"` and `rel="noopener noreferrer"`.

## Map and inspector

- 50 states. No DC unless asked.
- Every state label shows gasoline 🚗 and diesel 🚚.
- Click selects a state. The inspector shows hamburger, bread, eggs, milk, and toilet paper, each with its basis.
- The graph is the US vector until a state is selected, then that state. This is a ViewModel rule, tested without a map widget.

## Receipts (standing rule)

One of the deliveries is a Receipts page: an annotated bibliography of the details.

- The Model owns the entries (`src/model/receipts.ts` when code exists). The View only renders them.
- Any time research is used, it is logged in [RECEIPTS.md](RECEIPTS.md) in the same change. A number with no receipt does not ship.
- Planning-chat citations are logged as citations. They are not "verified" until someone opens the source and writes down what it actually says.
- Conflicts stay in the log. Do not delete the losing headline. Say which series won and why.

## Tests (required before a View that shows dollars)

Node. Model and ViewModel. No browser required for the economics.

Minimum, once the identity exists:

| Test | Assert |
| --- | --- |
| Determinism | Two runs, same scenario, same dataset, identical prices. |
| Tax is tax | Adding 10 cents of gasoline tax in one state adds 10 cents to that state's gasoline retail and does not move the pre-tax crack, or any other state's tax. |
| Shared barrel | A crude-supply cut moves gasoline and diesel. They are not independent dials. |
| Quality is not flavor | A heavy-sour cut and a light-sweet cut of the same barrels do not produce the same pair of prices, once yields exist. Until yields exist, this test is skipped, not stubbed to pass. |
| Stack | Two supply cuts together are not required to equal the sum of each cut alone. |
| Off means off | Disabling a country sets that inflow to zero. |
| Paper may sit still | If the fit's paper coefficient is ~0, a crude-only shock must not move toilet paper. |
| Basis | The 9 EIA gasoline states are `federal-state` at baseline. Other gasoline states are `station-survey`. Basket rows are `allocated`. California diesel is `federal-state`. |
| No cloned PADD | At the baseline fixture, two states whose AAA gasoline prices differ do not get the same gasoline price. |
| No fake Alaska diesel | Alaska and Hawaii diesel are not the PADD 5 diesel figure. |
| ViewModel | Lever commands change scenario state. Map labels, inspector, and graph match Model output, including basis. Selecting a state switches the graph off the US series. No DOM. |

A test that encodes a headline ("diesel equals 6.50") is the wrong test. A test that encodes a series fixture is the right one.

## Implementer start line (do not cross yet)

1. Price identity note, with fixtures and basis rules from STATE-GRAIN.
2. `model` types for scenario, state price vector, and basis, plus the tests above in skeletal form (skipped where the fixture is missing).
3. Only then a View: header, map, inspector, levers wired to the real function.

Auth off. Database off. `localStorage` may remember the last scenario later. It is not a reason to add accounts.
