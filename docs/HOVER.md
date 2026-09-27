# Hover copy

Standing rule: anything the user can point at that is an acronym, or a price name, has an explanation. Hover on a pointer. Tap on a phone. Same text. A title attribute is not enough, because it fails on touch and it cannot hold two sentences.

The copy lives with the Model, not in the View. The ViewModel exposes the string. A missing string is a test failure.

These are mechanisms we are willing to say out loud. They are not fitted coefficients. If a later fit contradicts one, the sentence changes and the receipt says what changed.

## Prices

| Label | Copy |
| --- | --- |
| Gasoline | Street price of regular gasoline, including taxes. Same barrel as diesel, different cut. |
| Diesel | Street price of on-highway diesel, including taxes. Trucks, farms, and a lot of food move on this fuel. |
| Hamburger | Cows use a lot of diesel. Feed, cattle, and the meat all move by truck. The grocery price can lag the fuel price. Series is BLS average price for 100% ground beef, per pound, not a patty. |
| Bread | Wheat moves by rail and truck. Milling and baking use energy. Closer to gasoline and electricity than to the diesel crack. Series is BLS white pan bread, per pound. |
| Eggs | Hens eat corn and soy that arrive by truck. The birds themselves barely move. Fuel is not the only shock: avian flu has moved this price by itself. Series is BLS grade A large, per dozen. |
| Milk | Perishable, so it rides refrigerated trucks a short way. A regional price, not a national one, is the honest grain. Series is BLS fresh whole milk, per gallon. |
| Toilet paper | Mostly electricity, not diesel. Display name only. The series is BLS household paper products (tissue, towels, napkins), US city average. |

The planning chat also said paper mills burn natural gas. The hover follows the later instruction, "mostly electricity," and does not pretend we split the mill's fuel bill.

## Geography and surveys

| Label | Copy |
| --- | --- |
| Census region | Four fixed blocks of states: Northeast, Midwest, South, West. Huge. Not a shipping zone. |
| PADD | Petroleum Administration for Defense District. EIA's fuel map. Not a state, and not a Census region. |
| EIA | U.S. Energy Information Administration. The federal fuel survey. Prints every state only for some series. |
| AAA | American Automobile Association. A station survey that does print gasoline and diesel for all 50 states. Different sample from EIA. |
| GasBuddy | Crowd-sourced station prices. Public charts hold about 10 years of gasoline, not a bulk file. We use the state-versus-donor gap, and we say so on the number. |
| BLS | Bureau of Labor Statistics. Publishes the consumer price levels. Food average prices stop at the four Census regions. |
| CPI | Consumer Price Index. A measure of price change. An average price is a level, in dollars. We use levels for the basket. |
| SEDS | EIA State Energy Data System. Annual gasoline price estimates for every state back to 1970, in dollars per million Btu, including federal and state tax. Not a weekly street price. |

## The annotation sentence

When a state fuel price is not itself an EIA state series, the hover ends with the construction:

> Wisconsin gasoline: weekly shape from EIA Midwest (PADD 2). Level shifted by the GasBuddy gap between Wisconsin and that Midwest series.

The donor is the EIA geography that contains the state. It is not a convenient state in another district. Colorado is an EIA state, and it is the wrong donor for Wisconsin. Colorado is PADD 4. Wisconsin is PADD 2. Minnesota is an EIA state inside the Midwest, so Minnesota is a legal donor if we would rather name a state than a PADD. The hover names whichever donor the identity actually uses.

If EIA already prints the state, the hover says that, and GasBuddy is a check, not the spine.
