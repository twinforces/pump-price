import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { recipeFor } from "./recipes.ts";

describe("recipes", () => {
  it("leaves a plain state as boil and separate", () => {
    const recipe = recipeFor("Montana");
    assert.equal(recipe.boilAndSeparate, true);
    assert.match(recipe.lines[0], /Boil and separate/);
  });

  it("calls out California and does not turn the programs into a price", () => {
    const recipe = recipeFor("California");
    assert.equal(recipe.boilAndSeparate, false);
    assert.match(recipe.lines.join(" "), /reformulated gasoline/);
  });

  it("keeps Houston reformulated and the rest of Texas ordinary", () => {
    const recipe = recipeFor("Texas");
    assert.match(recipe.lines.join(" "), /Houston/);
    assert.match(recipe.lines.join(" "), /Not the rest/);
  });
});
