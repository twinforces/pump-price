# Inputs and outputs

Locked 2026-09-27. The picture is still 50 states. The economics are not. Fuel shares a price inside a wartime fuel district, then a state gap. Groceries share a price inside a Census region. Milk can be a surveyed city.

The player never sees a British thermal unit. That unit exists only inside the State Energy Data System, because that book prices coal, gas, and gasoline in one heat unit. We convert to dollars per gallon before a number is an output.

## Do the fuel districts match the refineries?

Roughly, and only as logistics. A district is not a refinery.

They were drawn in World War II along the way barrels moved: where the plants were, and which pipelines and ports fed which coast. The Energy Information Administration still adds up capacity on those same lines.

As of January 1, 2026 the United States had 130 operable refineries and 18,160,493 barrels per calendar day of crude distillation. The Gulf Coast district alone had 58 of those refineries and 9,876,563 barrels per calendar day. That is about 54 percent of the stills, in one district.

A 2016 Energy Information Administration study of the East Coast and the Gulf Coast said the Gulf made just over half the country's transportation fuel and used less than a third of it, while the East Coast refined about a fifth of what it burned. The pipelines between them are the point of the map. Shutting a Gulf plant is allowed to move East Coast street prices. A grocery region has no such pipe.

So: districts correspond to refining regions, not to a plant, and not to a state. Many states have no refinery. Their street price still belongs to the district that feeds them.

## Inputs the player moves

| Input | Grain | What the lever does |
| --- | --- | --- |
| Country supply | Country, then one of four crude qualities: light sweet, light sour, heavy sweet, heavy sour | On means that country's flow into those qualities. Off means zero. A later slider can set the amount. The country-to-quality table is not written yet. |
| Refinery | Plant, sitting in a fuel district | On adds that plant's capacity and yield. Off removes them. Two closures stack. A state with no plant has no switch. |
| Fuel tax | State, and fuel (gasoline or diesel) | Cents per gallon. Moves that state's retail by the tax. Does not move the crack. |
| Fuel spec | State | Greener gasoline in California and Oregon, until a receipt adds another. Changes who can make the fuel. Not a tax. |

## Inputs the player does not move

These are the books the function reads. A missing book is not a license to invent the page.

| Book | Grain | Job |
| --- | --- | --- |
| Fuel-district membership | State | Which wartime district the state's fuel history comes from. |
| Census-region membership | State | Which grocery price the state shares. |
| Weekly federal gasoline | District, plus nine states | The shape of gasoline. The nine states are California, Colorado, Florida, Massachusetts, Minnesota, New York, Ohio, Texas, Washington. |
| Weekly federal diesel | District, plus California | The shape of diesel. Alaska and Hawaii are not in this survey. |
| GasBuddy gap | State | How far that state's gasoline sits from its district. About 10 years of charts, not a download. |
| Automobile Association gap | State | Same job for diesel, until a diesel history is in hand. Also the current cross-check for gasoline. |
| State tax table | State | The baseline cents already in the street price. |
| Refinery capacity list | Plant and district | January 1, 2026 capacity report. |
| Ground beef, bread, eggs | Census region, and national | Labor Department average prices. |
| Milk, national | Census region | The fallback when no city survey exists. |
| Milk, city | City | Agriculture Department monthly retail gallons, selected cities only. |
| Household paper | United States | An index, not a price per roll. |

## Not an input. A test.

Monthly gasoline for all states, 1983 through 2011, from retail outlets, taxes excluded. The survey then stopped. We do not feed it to the live calculator. We hold it out. After the identity exists, it has to reproduce those state months from the district logic, or we write down the miss. Fitting on the test and then celebrating the fit is cheating.

The State Energy Data System annual gasoline series, back to 1970, is a second check after we convert heat units to gallons. It is not the Friday price, and it is not the test above.

## Outputs, graded

Every output carries a grade. A number with no grade is not an output.

| Output | Where | Grade | What it is allowed to claim |
| --- | --- | --- | --- |
| Gasoline, dollars per gallon | All 50 states on the map | Federal state print, for the nine states. Otherwise: district shape, state gap from GasBuddy. Taxes in. | A state price built in public. Not six copies of one district average. |
| Diesel, dollars per gallon | All 50 states on the map | Federal state print for California only. Otherwise: district shape, state gap from the Automobile Association. | Alaska and Hawaii are not the West Coast federal number. |
| Hamburger, dollars per pound | Inspector | Census region. Same dollars for every state in that region. | Not a Wisconsin measurement. The hover names the region. |
| Bread, dollars per pound | Inspector | Census region. | Same limit. |
| Eggs, dollars per dozen | Inspector | Census region. | Same limit. Avian flu is allowed to dominate fuel. |
| Milk, dollars per gallon | Inspector | Surveyed city, named, when the Agriculture Department has one in that state. Otherwise Census region. | Do not average two cities in one state into a fake state price. |
| Toilet paper | Inspector | National index of household paper products. | Not a state price. Not a price per roll until we have one. Mostly electricity, not diesel. |
| Annotation sentence | Hover or tap on the number | States the grade in words. | Required. Short names are spelled out. |
| Graph | Beside the map | The United States series until a state is clicked, then that state's graded series. | Moves when a lever moves. Not a clock. |

## Not an output

- A state price for hamburger, bread, eggs, or toilet paper.
- A British thermal unit, on screen or in the graph.
- A fuel-district average labeled as if each state had been surveyed.
- A coefficient we have not fit. The beef story can be said in the hover. It cannot be a hardcoded 0.15 cents.

## Still missing before this list can run

The country-to-quality table, the plant yields, and the pass-through from diesel or gasoline into each grocery. Those are the price identity. This list says what that function may read and what it must return. It does not invent the function.
