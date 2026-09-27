# Master design

Pump Price is a calculator with god levers. One sitting is "move the world, read the prices." There is no turn, no opponent, and no score.

## The sentence

Gasoline and diesel come out of the same barrel, but not in the same amounts, and the barrel is not one crude. If you shut a country, a refinery, or a fuel spec, both street prices should move, differently, and a few downstream prices should follow only to the extent history says they follow.

If a lever does not change a supply, a tax, or a spec, it must not change a price.

## State the Model owns

Quality is the clearing state. Four crude buckets:

| Bucket | Why it exists |
| --- | --- |
| Light sweet | The planning chat's "expensive, more gasoline" slate. Yields are not invented here. |
| Light sour | Same gravity axis, sulfur axis separate. Do not collapse sour into heavy. |
| Heavy sweet | So heavy is not a synonym for sour. |
| Heavy sour | The planning chat's "cheap, more diesel and fuel oil" slate. Same caveat. |

Country supplies are inflows into those buckets. A country checkbox sets that inflow to zero. A slider, when we have one, sets how much. The Gulf is a source the human named; it is not "the United States" by another name until the table says so.

Refineries are conversion, not a price. Enabling one adds its capacity and its yield pattern. Disabling one removes them. Two closures stack. The price is whatever clears, not `base + n * bump`. Capacity is a state fact from EIA. Many states are zero.

Policies and taxes are separate from supply:

- A tax is cents per gallon on a named fuel in a named state. It moves that retail price by the tax. It does not move the crack.
- A policy changes a constraint: who may make a fuel, or which state is on a separate spec. The human's example is greener gasoline in California and Oregon, and the refineries that can make it.

Downstream goods are not crudes. Hamburger, bread, eggs, milk, and toilet paper each have their own pass-through. Toilet paper is the display name. The series is household paper products. If the fit says paper does not track crude, the model must be allowed to say that. Forcing it to move is faking.

State grain, and which series actually exist there, is [STATE-GRAIN.md](STATE-GRAIN.md). Short version: the map may show 50 fuel prices. It may not pretend a regional average was measured in that state.

## What the human sees

- **Header.** "Pump Price". An icon-sized copy of the GrumpyTechBro profile photo. Subtitle "a GrumpyTechBro joint", linking to https://x.com/GrumpyTechBro in a new tab.
- **Levers.** Checkboxes and sliders. Countries, refineries, policies. A tax control that is a number, not a checkbox.
- **Map.** The 50 states. Every state shows gasoline (🚗) and diesel (🚚) at once. No District of Columbia unless asked.
- **Inspector.** Click a state. The other prices: hamburger 🍔, bread 🍞, eggs 🥚, milk 🥛, toilet paper 🧻. Each number shows its basis (`federal-state`, `station-survey`, or `allocated`).
- **Graph.** US prices until a state is clicked, then that state. Recalculates with the levers. Not a simulation clock. If food has a lag, the lag is inside the equation. The picture still updates immediately.
- **Emoji.** Fuels are not words. Gasoline is the automobile. Diesel is the truck. Basket emoji unchanged.

## What we will not fake

- Yields of heavy versus light, sour versus sweet.
- A refinery's capacity or whether it is actually shut.
- A state fuel price copied from its PADD when a state survey exists.
- Alaska or Hawaii diesel copied from PADD 5. EIA does not sample those outlets.
- A state hamburger, bread, egg, milk, or toilet-paper print. Those are allocated from the region until a real state series shows up.
- Pass-through from diesel to hamburger, or from anything to paper.
- Mixing the gasoline column with the diesel column because both are "the fuel price."

Historical series are the judge. The list is [RECEIPTS.md](RECEIPTS.md).

## Out of scope until asked

Auth, accounts, a database, a score, multiplayer, animated freight, a rewind control, foods nobody named, DC on the map.
