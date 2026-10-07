/**
 * What the gallon is, by state. A different recipe is part of the bill.
 * The words are called out. Nothing here is added into a price.
 * Reformulated areas are from EPA's current covered-area list. California is its own fuel.
 */
export type Recipe = {
  state: string;
  /** True only when the whole state is boil and separate, with no extra recipe. */
  boilAndSeparate: boolean;
  lines: readonly string[];
};

const REFORMULATED: Record<string, string> = {
  Colorado: "Denver and the northern Front Range. Not the whole state.",
  Connecticut: "Most of the state, including the New York suburbs. Not every town.",
  Delaware: "The whole state is in a reformulated area.",
  "District of Columbia": "The whole district.",
  Illinois: "Chicago and the Illinois side of St. Louis. Not downstate.",
  Indiana: "Lake and Porter counties, next to Chicago. Not the rest of the state.",
  Maryland: "Baltimore, Washington suburbs, and the Eastern Shore counties in the program. Not the whole state.",
  Massachusetts: "The whole state.",
  "New Hampshire": "The southeast counties: Hillsborough, Merrimack, Rockingham, and Strafford.",
  "New Jersey": "Across the state.",
  "New York": "The city and its suburbs, plus Dutchess County. Not upstate.",
  Pennsylvania: "Philadelphia and its suburbs. Not the rest of the state.",
  "Rhode Island": "The whole state.",
  Texas: "Houston and Dallas–Fort Worth. Not the rest of the state.",
  Virginia: "Northern Virginia, Richmond, and Hampton Roads. Not the rest of the state.",
  Wisconsin: "Milwaukee and the counties around it. Not the rest of the state.",
};

function reformulated(state: string): Recipe {
  return {
    state,
    boilAndSeparate: false,
    lines: [
      "More than boil and separate.",
      `Federal reformulated gasoline: ${REFORMULATED[state]}`,
      "Called out. Not added.",
    ],
  };
}

const NAMED: Record<string, Recipe> = {
  California: {
    state: "California",
    boilAndSeparate: false,
    lines: [
      "Not boil and separate. California reformulated gasoline, statewide.",
    ],
  },
  Arizona: {
    state: "Arizona",
    boilAndSeparate: false,
    lines: [
      "Most of the state is boil and separate.",
      "Phoenix uses Arizona Cleaner Burning Gasoline in the summer. Arizona has not published the extra cents, so there is no line for it.",
    ],
  },
  Oregon: {
    state: "Oregon",
    boilAndSeparate: false,
    lines: [
      "No refinery in Oregon. More than 90 percent of the gasoline and the diesel is made at four refineries on Puget Sound and comes down the Olympic Pipeline to Portland. The wholesale price is Washington's.",
      "Clean Fuels Program, 2025: 9.35 cents a gallon of gasoline with 10 percent ethanol. Oregon's own standard. It is its own line on the approximate invoice.",
    ],
  },
  Washington: {
    state: "Washington",
    boilAndSeparate: false,
    lines: [
      "Five refineries. The oil slider is the Gulf barrel. West Coast refiners paid $3.45 a barrel more, median, 2015 through 2025. That extra is the crude into this coast, not a ship tariff by itself.",
      "Clean Fuel Standard, 2024: the state estimates 0.59 cents a gallon. It is its own line on the approximate invoice.",
    ],
  },
};

export function recipeFor(state: string): Recipe {
  if (NAMED[state]) return NAMED[state];
  if (REFORMULATED[state]) return reformulated(state);
  return {
    state,
    boilAndSeparate: true,
    lines: ["Boil and separate.", "Federal tax and this state's tax. No extra recipe."],
  };
}
