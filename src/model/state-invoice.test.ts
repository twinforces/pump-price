import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { REFINING_FIT, applyDieselMarketFactor, approximateDieselInvoice, approximateStateInvoice, barrelMatchingSurvey, barrelOnThisBill, bulkWholesaleCents, crudeDaysAgo, importTravelPerGallon, splitGallon, unnamedVersusSurvey } from "./state-invoice.ts";
import { VOYAGES, voyageFor, type ImportTravel, type VoyageId } from "./voyage.ts";

function fitCents(barrel: number, fit: { constant: number; oil: number }): number {
  return Math.round((fit.constant + fit.oil * barrel) * 100);
}

function cents(invoice: { lines: { label: string; cents: number }[] } | null, label: string): number {
  const line = invoice?.lines.find((item) => item.label === label);
  if (!line) throw new Error(label);
  return line.cents;
}

function has(invoice: { lines: { label: string }[] } | null, label: string): boolean {
  return Boolean(invoice?.lines.some((item) => item.label === label));
}

describe("state invoice", () => {
  it("adds the lines, and the pump falls when the barrel falls", () => {
    const dear = approximateStateInvoice("Texas", 84, 0.4, null, null, null, 4, 84);
    const cheap = approximateStateInvoice("Texas", 42, 0.4, null, null, null, 4, 84);
    assert.ok(dear && cheap);
    assert.equal(dear.lines.reduce((sum, line) => sum + line.cents, 0), dear.totalCents);
    assert.equal(has(dear, "Inferred, location"), false);
    assert.equal(cents(dear, "Oil") - cents(cheap, "Oil"), 100);
    assert.equal(cents(dear, "Refining, Gulf dock"), 40);
    const refiningDrop = 40 - cents(cheap, "Refining, Gulf dock");
    const cardDrop = cents(dear, "Card fees") - cents(cheap, "Card fees");
    assert.ok(refiningDrop > 25);
    assert.ok(Math.abs(dear.totalCents - cheap.totalCents - (100 + refiningDrop + cardDrop)) < 1e-6);
    assert.ok(Math.abs(unnamedVersusSurvey(cheap.totalCents, 3.92) - unnamedVersusSurvey(dear.totalCents, 3.92) - (100 + refiningDrop + cardDrop)) < 1e-6);
    assert.equal(cents(dear, "Station Profit"), 10);
    assert.equal(cents(dear, "Detergent"), 0.5);
    assert.equal(cents(dear, "Card fees"), Math.round((dear.totalCents - cents(dear, "Card fees")) * 0.03 / 0.97));
    assert.ok(dear.unpublished.some((line) => line.includes("3 percent")));
    assert.ok(dear.unpublished.some((line) => line.includes("Smokes and Natties")));
  });

  it("prices Oregon at the Puget Sound wholesale, plus Oregon's own clean-fuels line", () => {
    const oregon = approximateStateInvoice("Oregon", 84, 0.4, null, 0.5, null);
    const washington = approximateStateInvoice("Washington", 84, 0.4, null, 0.5, null);
    assert.ok(oregon && washington);
    assert.equal(oregon.lines.reduce((sum, line) => sum + line.cents, 0), oregon.totalCents);
    assert.equal(has(oregon, "Refining, Gulf dock"), false);
    assert.equal(has(oregon, "Refiner's sale over the spot"), false);
    assert.equal(cents(oregon, "Clean Fuels Program"), 9);
    assert.equal(has(oregon, "Crude transport"), false);
    assert.equal(has(washington, "Crude transport"), true);
    assert.equal(cents(oregon, "Oil"), cents(washington, "Oil") + cents(washington, "Crude transport"));
    assert.equal(cents(oregon, "Refining, Puget Sound"), cents(washington, "Refining, Puget Sound"));
    assert.equal(has(oregon, "Clean Fuel Standard"), false);
  });

  it("prices New York harbor and the Linden pipe", () => {
    const york = approximateStateInvoice("New York", 84, 0.4, null, 0.5, null);
    assert.ok(york);
    assert.equal(cents(york, "Refining, New York harbor") + cents(york, "Pipeline, Houston to Linden"), 50);
    assert.equal(york.lines.reduce((sum, line) => sum + line.cents, 0), york.totalCents);
  });

  it("brings every harbor state up Colonial without charging the harbor twice", () => {
    const mass = approximateStateInvoice("Massachusetts", 84, 0.4, null, 0.5, null, 4, null, 0.25);
    const york = approximateStateInvoice("New York", 84, 0.4, null, 0.5, null);
    assert.ok(mass && york);
    const harbor = (bill: NonNullable<typeof mass>) =>
      cents(bill, "Refining, New York harbor") + cents(bill, "Pipeline, Houston to Linden") + (bill.lines.some((line) => line.label === "Pipeline travel lag") ? cents(bill, "Pipeline travel lag") : 0);
    assert.equal(harbor(mass), harbor(york));
    assert.equal(cents(mass, "Pipeline travel lag"), -15);
    for (const state of ["Connecticut", "Pennsylvania", "Florida"]) {
      const bill = approximateStateInvoice(state, 84, 0.4, null, 0.5, null);
      assert.ok(bill);
      assert.equal(harbor(bill), 50);
    }
  });

  it("charges the Rockies less for crude than the Gulf", () => {
    const colorado = approximateStateInvoice("Colorado", 84, 0.4, null, null, null);
    const texas = approximateStateInvoice("Texas", 84, 0.4, null, null, null);
    assert.ok(colorado && texas);
    assert.ok(cents(colorado, "Oil") < cents(texas, "Oil"));
    assert.equal(has(colorado, "Refining, Gulf dock"), false);
  });

  it("prices California from the fitted Los Angeles dock", () => {
    const california = approximateStateInvoice("California", 84, 0.4, null, null, null);
    assert.ok(california);
    assert.equal(cents(california, "Refining, Los Angeles"), fitCents(84, REFINING_FIT.losAngelesGasoline));
    assert.equal(cents(california, "Tanker stop, $100 a trip"), 1.2);
    assert.equal(cents(california, "Tanker surcharge, diesel above $3, 33 miles each way"), 0.1);
    assert.equal(has(california, "Inferred, location"), false);
    assert.equal(california.lines.reduce((sum, line) => sum + line.cents, 0), california.totalCents);
    const sales = cents(california, "State and local sales tax");
    assert.ok(Math.abs(sales - Math.round(california.totalCents * 0.022)) <= 1);
    assert.equal(cents(california, "Station Profit"), 10);
    assert.ok(cents(california, "Card fees") > 8);
  });

  it("charges a higher card fee when the barrel is higher", () => {
    const then = approximateStateInvoice("Texas", 42, 0.4, null, null, null);
    const now = approximateStateInvoice("Texas", 84, 0.4, null, null, null);
    assert.ok(then && now);
    assert.ok(cents(now, "Card fees") > cents(then, "Card fees"));
    assert.equal(cents(now, "Card fees"), Math.round((now.totalCents - cents(now, "Card fees")) * 0.03 / 0.97));
  });

  it("puts ethanol on the gallon and does not charge oil for that tenth", () => {
    const texas = approximateStateInvoice("Texas", 84, 0.4, null, null, 1.6);
    assert.ok(texas);
    assert.equal(cents(texas, "Oil"), 200);
    assert.equal(cents(texas, "Oil replaced by ethanol"), -20);
    assert.equal(cents(texas, "Ethanol, 10 percent"), 16);
    assert.equal(
      cents(texas, "Oil") + cents(texas, "Oil replaced by ethanol") + cents(texas, "Ethanol, 10 percent") + cents(texas, "Refining, Gulf dock"),
      236,
    );
    assert.equal(bulkWholesaleCents(texas.lines), 237);
    const dear = approximateStateInvoice("Texas", 126, 0.4, null, null, 1.6);
    assert.ok(cents(dear, "Oil replaced by ethanol") < cents(texas, "Oil replaced by ethanol"));
  });

  it("uses the same lines for diesel and does not copy the gasoline recipe", () => {
    const texas = approximateDieselInvoice("Texas", 84, 0.5, null, null);
    assert.equal(texas.lines.reduce((sum, line) => sum + line.cents, 0), texas.totalCents);
    assert.equal(has(texas, "Inferred, location"), false);
    assert.equal(cents(texas, "Oil"), 200);
    assert.equal(cents(texas, "Refining, Gulf dock"), 50);
    assert.equal(cents(texas, "Federal tax"), 24);
    assert.equal(cents(texas, "Station Profit"), 20);
    assert.equal(has(texas, "Detergent"), false);
    assert.equal(cents(texas, "Store"), 12);
    assert.equal(cents(texas, "Building"), 4);
    assert.equal(has(texas, "Ethanol, 10 percent"), false);
    const cheaper = approximateDieselInvoice("Texas", 42, 0.5, null, null, 4, 84);
    const dearDiesel = approximateDieselInvoice("Texas", 84, 0.5, null, null, 4, 84);
    const dieselDrop = cents(dearDiesel, "Refining, Gulf dock") - cents(cheaper, "Refining, Gulf dock");
    const cardDrop = cents(dearDiesel, "Card fees") - cents(cheaper, "Card fees");
    assert.ok(dieselDrop > 40);
    assert.ok(Math.abs(dearDiesel.totalCents - cheaper.totalCents - (100 + dieselDrop + cardDrop)) < 1e-6);
    const oregon = approximateDieselInvoice("Oregon", 84, 0.5, null, null);
    const washingtonDiesel = approximateDieselInvoice("Washington", 84, 0.5, null, null);
    assert.equal(has(oregon, "Clean Fuels Program"), false);
    assert.equal(has(oregon, "Refining, Gulf dock"), false);
    assert.equal(has(oregon, "Crude transport"), false);
    assert.equal(cents(oregon, "Oil"), cents(washingtonDiesel, "Oil") + cents(washingtonDiesel, "Crude transport"));
    assert.equal(cents(oregon, "Refining, Puget Sound"), cents(washingtonDiesel, "Refining, Puget Sound"));
    const newYork = approximateDieselInvoice("New York", 84, 0.5, null, 0.6);
    assert.equal(cents(newYork, "Refining, New York harbor") + cents(newYork, "Pipeline, Houston to Linden"), 60);
  });

  it("sets diesel refining to gasoline refining plus the hydrotreater", () => {
    const gasoline = approximateStateInvoice("Texas", 84, 0.4, null, null, null);
    const diesel = approximateDieselInvoice("Texas", 84, 0.9, null, null);
    assert.ok(gasoline);
    const split = applyDieselMarketFactor(diesel, gasoline);
    assert.equal(cents(split, "Refining, Gulf dock"), cents(gasoline, "Refining, Gulf dock") + 5);
    assert.equal(cents(split, "Refining, Gulf dock") + cents(split, "Market factor"), cents(diesel, "Refining, Gulf dock"));
    assert.equal(split.lines.reduce((sum, line) => sum + line.cents, 0), diesel.totalCents);
    assert.equal(split.totalCents, diesel.totalCents);
  });

  it("charges California diesel the tank fee and 13 percent sales tax, not the bundled state total", () => {
    const california = approximateDieselInvoice("California", 70, 0.48, 0.48, null);
    assert.equal(cents(california, "Underground tank fee"), 2);
    assert.equal(cents(california, "State excise tax"), 48);
    assert.equal(has(california, "State tax"), false);
    const gasoline = approximateStateInvoice("California", 70, 0.4, 0.48, null, null);
    assert.equal(cents(california, "Other distribution"), cents(gasoline, "Other distribution"));
    const sales = cents(california, "State and local sales tax");
    const base = california.lines
      .filter((line) => !["State and local sales tax", "State excise tax", "Underground tank fee", "Card fees"].includes(line.label))
      .reduce((sum, line) => sum + line.cents, 0);
    assert.ok(Math.abs(sales - Math.round(base * 0.13)) <= 1);
    const dear = approximateDieselInvoice("California", 112, 0.48, 0.48, null);
    assert.ok(cents(dear, "State and local sales tax") > sales);
  });

  it("adds the gross-receipts taxes the state-tax total leaves out, and does not add a tank fee twice", () => {
    const connecticut = approximateStateInvoice("Connecticut", 84, 0.4, null, 0.5, null);
    assert.ok(connecticut);
    const dock =
      (cents(connecticut, "Oil") + cents(connecticut, "Refining, New York harbor") + cents(connecticut, "Pipeline, Houston to Linden")) / 100;
    assert.equal(cents(connecticut, "Gross earnings tax, first sale"), Math.round(dock * 0.081 * 100));
    assert.equal(has(connecticut, "Underground tank fee"), false);
    const ohio = approximateDieselInvoice("Ohio", 84, 0.5, null, null);
    const oil = (cents(ohio, "Oil") + cents(ohio, "Refining")) / 100;
    assert.equal(cents(ohio, "Petroleum activity tax"), Math.round(oil * 0.0065 * 100));
    const york = approximateStateInvoice("New York", 84, 0.4, null, 0.5, null);
    assert.equal(cents(york, "State sales tax"), 8);
    const texas = approximateStateInvoice("Texas", 84, 0.4, null, null, null);
    assert.equal(has(texas, "Gross earnings tax, first sale"), false);
    assert.equal(has(texas, "Underground tank fee"), false);
    assert.ok(texas?.unpublished.some((line) => line.startsWith("Tank fees")));
  });

  it("breaks the non-oil part into taxes, the station, and the rest", () => {
    const texas = approximateStateInvoice("Texas", 84, 0.4, null, null, null);
    assert.ok(texas);
    const split = splitGallon(texas.lines);
    assert.equal(split.oilCents, cents(texas, "Oil"));
    const truck = texas.lines.filter((line) => line.label.startsWith("Tanker")).reduce((sum, line) => sum + line.cents, 0);
    assert.equal(split.stationCents, truck + cents(texas, "Card fees") + 6 + 2 + 10);
    assert.equal(split.taxCents, cents(texas, "Federal tax") + cents(texas, "State tax"));
    assert.equal(split.oilCents + split.taxCents + split.stationCents + split.otherCents, texas.totalCents);
  });

  it("charges the truck for the miles in that state, and the diesel it burns", () => {
    const oregon = approximateStateInvoice("Oregon", 84, 0.4, null, null, null, 3);
    const texas = approximateStateInvoice("Texas", 84, 0.4, null, null, null, 3);
    const dear = approximateStateInvoice("Oregon", 84, 0.4, null, null, null, 6);
    assert.ok(oregon && texas && dear);
    const oregonContract = oregon.lines.find((line) => line.label.startsWith("Tanker contract"));
    const texasContract = texas.lines.find((line) => line.label.startsWith("Tanker contract"));
    const dearContract = dear.lines.find((line) => line.label.startsWith("Tanker contract"));
    const oregonSurcharge = oregon.lines.find((line) => line.label.startsWith("Tanker surcharge"));
    const dearSurcharge = dear.lines.find((line) => line.label.startsWith("Tanker surcharge"));
    assert.equal(oregonContract?.label, "Tanker contract, 55 miles each way");
    assert.equal(texasContract?.label, "Tanker contract, 20 miles each way");
    assert.equal(oregonContract?.cents, dearContract?.cents);
    assert.equal(oregonSurcharge?.cents, 0);
    assert.ok((dearSurcharge?.cents ?? 0) > 0);
    assert.ok((oregonContract?.cents ?? 0) > (texasContract?.cents ?? 0));
  });

  it("gives every line a constant, an oil coefficient, and a diesel coefficient", () => {
    const texas = approximateStateInvoice("Texas", 84, 0.4, null, null, null, 4);
    assert.ok(texas);
    const tax = texas.lines.find((line) => line.label === "State tax");
    const surcharge = texas.lines.find((line) => line.label.startsWith("Tanker surcharge"));
    const oil = texas.lines.find((line) => line.label === "Oil");
    assert.equal(tax?.oil, 0);
    assert.equal(tax?.diesel, 0);
    assert.ok((tax?.constant ?? 0) > 0);
    assert.ok((surcharge?.constant ?? 0) < 0);
    assert.equal(surcharge?.oil, 0);
    assert.ok((surcharge?.diesel ?? 0) > 0);
    assert.equal(oil?.diesel, 0);
    assert.equal(oil?.oil, 1 / 42);
    const summed = texas.lines.reduce(
      (total, line) => ({
        constant: total.constant + line.constant,
        oil: total.oil + line.oil,
        diesel: total.diesel + line.diesel,
      }),
      { constant: 0, oil: 0, diesel: 0 },
    );
    assert.ok(Math.abs(summed.constant - texas.aggregate.constant) < 1e-9);
    assert.ok(Math.abs(summed.oil - texas.aggregate.oil) < 1e-9);
    assert.ok(Math.abs(summed.diesel - texas.aggregate.diesel) < 1e-9);
    const connecticut = approximateStateInvoice("Connecticut", 84, 0.4, null, 0.5, null, 4);
    const gross = connecticut?.lines.find((line) => line.label === "Gross earnings tax, first sale");
    assert.ok((gross?.oil ?? 0) > 0);
    const maine = approximateStateInvoice("Maine", 84, 0.4, null, null, null);
    const texasNote = approximateStateInvoice("Texas", 84, 0.4, null, null, null);
    assert.ok(maine?.unpublished.some((line) => line.includes("60 degrees")));
    assert.equal(texasNote?.unpublished.some((line) => line.includes("60 degrees")), false);
  });

  it("solves for the barrel that would match a survey, and gives up when the bill does not move", () => {
    const texas = barrelMatchingSurvey("Texas", 3.92, "gasoline", 0.39, 0.48);
    const diesel = barrelMatchingSurvey("Texas", 5.86, "diesel", 0.39, 0.48);
    assert.ok(texas !== null && texas > 40 && texas < 200);
    assert.ok(diesel !== null && diesel > texas);
    const oregonBarrel = barrelMatchingSurvey("Oregon", 5.07, "gasoline", 0.39, 0.48);
    assert.ok(oregonBarrel !== null && oregonBarrel > 40 && oregonBarrel < 400);
  });

  it("reads the barrel off this bill, and the market factor does not move it", () => {
    const gasoline = approximateStateInvoice("Texas", 103.54, 0.4, null, null, 1.96);
    const diesel = approximateDieselInvoice("Texas", 103.54, 0.9, null, null);
    assert.ok(gasoline);
    const split = applyDieselMarketFactor(diesel, gasoline);
    const barrel = barrelOnThisBill(split, 5.86, 103.54);
    assert.equal(barrel, barrelOnThisBill(diesel, 5.86, 103.54));
    assert.ok(barrel !== null && barrel > 103);
  });

  it("lags the Gulf crack only where the fuel left the Gulf", () => {
    const texas = approximateStateInvoice("Texas", 103.54, 1.423, null, null, null, 4, 103.54, 1.2);
    const idaho = approximateStateInvoice("Idaho", 103.54, 1.423, null, null, null, 4, 103.54, 1.2);
    const york = approximateStateInvoice("New York", 103.54, 1.423, null, 0.99, null, 4, 103.54, 1.2);
    assert.equal(cents(texas, "Refining, Gulf dock"), 142);
    assert.equal(cents(idaho, "Refining"), 120);
    assert.equal(
      cents(york, "Refining, New York harbor") + cents(york, "Pipeline, Houston to Linden") + cents(york, "Pipeline travel lag"),
      99,
    );
    const oregon = approximateStateInvoice("Oregon", 103.54, 1.423, null, null, null, 4, 103.54, 1.2);
    assert.equal(has(oregon, "Clean Fuels Program"), true);
  });

  it("puts import travel on the West Coast and keeps the wholesale", () => {
    const weeks = [
      { date: "2026-08-14", value: 84.05 },
      { date: "2026-08-28", value: 84.62 },
      { date: "2026-09-04", value: 91.18 },
      { date: "2026-09-11", value: 99.08 },
      { date: "2026-09-18", value: 103.54 },
    ];
    const price = (days: number) => crudeDaysAgo(weeks, "2026-09-18", 103.54, days);
    const travel = Object.fromEntries(
      (Object.keys(VOYAGES) as VoyageId[]).map((id) => [id, importTravelPerGallon(VOYAGES[id], 103.54, price)]),
    ) as ImportTravel;
    for (const id of Object.keys(VOYAGES) as VoyageId[]) {
      const share = VOYAGES[id].reduce((sum, leg) => sum + leg.share, 0);
      assert.ok(Math.abs(share - 1) < 0.01, id);
      assert.ok(Number.isFinite(travel[id]));
    }
    assert.ok(travel.california < -0.08 && travel.california > -0.14);
    assert.ok(travel.washington < travel.california);
    assert.ok(travel.midwest < travel.gulf);
    assert.equal(voyageFor("Oregon"), "washington");
    assert.equal(voyageFor("Georgia"), "gulf");
    assert.equal(voyageFor("Pennsylvania"), "east");
    assert.equal(voyageFor("Illinois"), "midwest");
    assert.equal(voyageFor("Colorado"), "rockies");
    assert.equal(voyageFor("Alaska"), "alaska");
    const plain = approximateStateInvoice("California", 103.54, 1.42, 1.6, null, null);
    const moved = approximateStateInvoice("California", 103.54, 1.42, 1.6, null, null, 4, null, null, travel);
    assert.ok(plain && moved);
    assert.equal(moved.totalCents, plain.totalCents);
    assert.ok(cents(moved, "Refining, Los Angeles") > cents(plain, "Refining, Los Angeles"));
    const texasPlain = approximateStateInvoice("Texas", 103.54, 1.42, null, null, null, 4);
    const texas = approximateStateInvoice("Texas", 103.54, 1.42, null, null, null, 4, null, null, travel);
    assert.ok(texasPlain && texas);
    assert.equal(texas.totalCents, texasPlain.totalCents);
    assert.equal(has(texas, "Import pricing lag"), true);
    const washington = approximateStateInvoice("Washington", 103.54, 1.42, null, null, null, 4, null, null, travel);
    const california = approximateStateInvoice("California", 103.54, 1.42, null, null, null, 4, null, null, travel);
    const illinois = approximateStateInvoice("Illinois", 103.54, 1.42, null, null, null, 4, null, null, travel);
    const georgia = approximateStateInvoice("Georgia", 103.54, 1.42, null, 0.5, null, 4, null, null, travel);
    assert.ok(washington && california && illinois && georgia);
    assert.ok(cents(washington, "Import pricing lag") < cents(california, "Import pricing lag"));
    assert.equal(cents(georgia, "Import pricing lag"), cents(texas, "Import pricing lag"));
    assert.ok(cents(illinois, "Import pricing lag") < cents(texas, "Import pricing lag"));
    const oregon = approximateStateInvoice("Oregon", 84, 0.4, null, null, null, 4, null, null, travel);
    const washingtonAtSameBarrel = approximateStateInvoice("Washington", 84, 0.4, null, null, null, 4, null, null, travel);
    assert.ok(oregon && washingtonAtSameBarrel);
    assert.ok(Number.isFinite(cents(washington, "Import pricing lag")));
    assert.equal(cents(oregon, "Import pricing lag"), cents(washington, "Import pricing lag"));
    assert.equal(cents(oregon, "Refining, Puget Sound"), cents(washingtonAtSameBarrel, "Refining, Puget Sound"));
    assert.equal(cents(oregon, "Clean Fuels Program"), 9);
    assert.ok(oregon.lines.every((line) => Number.isFinite(line.cents)));
  });
});
