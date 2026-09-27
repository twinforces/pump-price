# Architecture

Stewarded by the Architect. Implementer fills bodies only after [PRICE-IDENTITY.md](PRICE-IDENTITY.md) exists. That file is not written yet.

Precedent for the folders, not for the rules: [GTB911sim](https://github.com/twinforces/GTB911sim) and [Hormuz Toll](https://github.com/twinforces/hormuzboardgame).

## Why MVVM

The user said it plainly: when we code, use MVVM and unit test the hell out of the Model and the ViewModel. It is worth it because this calculator is an argument about prices. If the argument lives in React, nobody can test it without a browser, and a pretty map can hide a bump.

## Layers

```
src/model/        scenario in, prices out. No React. No DOM. No SVG.
src/viewmodel/    lever commands, map labels, graph series. No drawing.
src/view/         header, map, graph, lever chrome.
src/routes/       thin wrappers. No economics.
```

Rules:

1. The View never constructs the engine. The ViewModel does.
2. The ViewModel never draws. It exposes commands and labels.
3. The Model never imports React, the DOM, or SVG.
4. Pixels, emoji, and the profile photo are View concerns. Dollars and barrels are Model concerns.
5. Same scenario plus the same dataset returns the same prices. No clock, no randomness, unless a later note adds a seed and tests it.
6. Every coefficient that is a choice lives in one balance module, with a comment pointing at a receipt. No magic numbers in the engine.

## Header (product spec, not optional)

- Title text: `Pump Price`
- Icon: the GrumpyTechBro profile photo, icon sized. Vendor a copy in the repo when the View is built. Do not hotlink a profile image that can change or 404. Current source, as of this note: `https://pbs.twimg.com/profile_images/1965515426500411395/gzTcXSc1.jpg`
- Subtitle text: `a GrumpyTechBro joint`
- The subtitle is a link to `https://x.com/GrumpyTechBro` with `target="_blank"` and `rel="noopener noreferrer"`.

## Receipts (standing rule)

One of the deliveries is a Receipts page: an annotated bibliography of the details.

- The Model owns the entries (`src/model/receipts.ts` when code exists). The View only renders them. Same pattern as Hormuz.
- Any time research is used, it is logged in [RECEIPTS.md](RECEIPTS.md) in the same change. A number with no receipt does not ship.
- Planning-chat citations are logged as citations. They are not "verified" until someone opens the source and writes down what it actually says.
- Conflicts stay in the log. Do not delete the losing headline. Say which series won and why.

## Tests (required before a View that shows dollars)

Node. Model and ViewModel. No browser required for the economics.

Minimum, once the identity exists:

| Test | Assert |
| --- | --- |
| Determinism | Two runs, same scenario, same dataset, identical prices. |
| Tax is tax | Adding 10 cents of gasoline tax adds 10 cents to gasoline retail and does not move the pre-tax crack. |
| Shared barrel | A crude-supply cut moves gasoline and diesel. They are not independent dials. |
| Quality is not flavor | A heavy-sour cut and a light-sweet cut of the same barrels do not produce the same pair of prices, once yields exist. Until yields exist, this test is skipped, not stubbed to pass. |
| Stack | Two supply cuts together are not required to equal the sum of each cut alone. If someone codes `sum of bumps`, this test is how we catch it. |
| Off means off | Disabling a country sets that inflow to zero. It does not leave a hidden residual. |
| Paper may sit still | If the fit's paper coefficient is ~0, a crude-only shock must not move toilet paper. Do not write the test to demand a move. |
| ViewModel | Lever commands change scenario state. Map and graph labels match Model output. No DOM. |

A test that encodes a headline ("diesel equals 6.50") is the wrong test. A test that encodes a series fixture is the right one.

## Implementer start line (do not cross yet)

1. Price identity note, with fixtures.
2. `model` types for scenario and price vector, plus the tests above in skeletal form (skipped where the fixture is missing).
3. Only then a View: header, empty of fake dollars, levers wired to the real function.

Auth off. Database off. `localStorage` may remember the last scenario later. It is not a reason to add accounts.
