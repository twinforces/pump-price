import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../view/header";

export const Route = createFileRoute("/receipts")({ component: Receipts });

function Receipts() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-10 text-ink">
        <h1 className="text-3xl leading-tight">Receipts</h1>
        <p className="mt-4 leading-relaxed">
          The bibliography. These are the pages and files consulted while the invoices, the clock,
          and the Author's Note were being built. A link is a source. It is not an endorsement of
          the page's conclusion.
        </p>

        <h2 className="mt-10 text-xl">The barrel and the docks</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/RWTCw.xls">
            U.S. Energy Information Administration. Cushing, Oklahoma, weekly West Texas Intermediate.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/EER_EPMRU_PF4_RGC_DPGw.xls">
            Energy Information Administration. Gulf Coast conventional gasoline, weekly spot.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/EER_EPD2DXL0_PF4_RGC_DPGw.xls">
            Energy Information Administration. Gulf Coast ultra-low-sulfur diesel, weekly spot.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/EER_EPMRR_PF4_Y05LA_DPGw.xls">
            Energy Information Administration. Los Angeles reformulated gasoline, weekly spot.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/EER_EPD2DC_PF4_Y05LA_DPGw.xls">
            Energy Information Administration. Los Angeles ultra-low-sulfur diesel, weekly spot.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/EER_EPMRU_PF4_Y35NY_DPGw.xls">
            Energy Information Administration. New York Harbor reformulated gasoline, weekly spot.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/EER_EPD2DXL0_PF4_Y35NY_DPGw.xls">
            Energy Information Administration. New York Harbor ultra-low-sulfur diesel, weekly spot.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/xls/PET_PNP_CRQ_DCU_NUS_M.xls">
            Energy Information Administration. Crude quality, national monthly, gravity and sulfur.
          </Item>
          <Item href="https://www.eia.gov/petroleum/gasdiesel/">
            Energy Information Administration. Gasoline and Diesel Fuel Update, including the weekly retail survey and the federal and state tax table.
          </Item>
          <Item href="https://www.eia.gov/energyexplained/diesel-fuel/prices-and-outlook.php">
            Energy Information Administration. What is inside a gallon of diesel.
          </Item>
          <Item href="https://gasprices.aaa.com/">
            AAA. Daily state averages. The station survey on the map is this file, not GasBuddy. GasBuddy does not publish a history.
          </Item>
          <Item href="https://www.statista.com/statistics/616129/breakdown-of-the-united-states-gasoline-price-by-expense/">
            Statista, from the Energy Information Administration. Share of the national gasoline price in crude, refining, distribution and marketing, and taxes, 2020 through 2025.
          </Item>
        </ul>

        <h2 className="mt-10 text-xl">Refineries, the pipe, and what a barrel becomes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
          <Item href="https://www.eia.gov/petroleum/refinerycapacity/">
            Energy Information Administration. Refinery Capacity Report. The operable plants, by state.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/WPULEUS3w.xls">
            Energy Information Administration. Weekly refinery utilization.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/WCRRIUS2w.xls">
            Energy Information Administration. Weekly crude oil input to refineries.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/WGFRPUS2w.xls">
            Energy Information Administration. Weekly finished gasoline production.
          </Item>
          <Item href="https://www.eia.gov/dnav/pet/hist_xls/WDIRPUS2w.xls">
            Energy Information Administration. Weekly distillate production.
          </Item>
          <Item href="https://www.eia.gov/tools/faqs/faq.php?id=327&t=9">
            Energy Information Administration. Gallons of gasoline and distillate from one barrel.
          </Item>
          <Item href="https://www.ams.usda.gov/mnreports/ams_3616.pdf">
            U.S. Department of Agriculture, Agricultural Marketing Service. Iowa ethanol plant prices, weekly.
          </Item>
          <Item href="https://dr.lib.iastate.edu/bitstreams/554eee50-ac2f-4e5f-9782-ab1b281fd475/download">
            Iowa State University. Ethanol rail rates, 2013. About 13 cents a gallon of ethanol to New York, 14 to Houston, 19 to 25 to Los Angeles.
          </Item>
          <Item href="https://www.instituteforenergyresearch.org/wp-content/uploads/2026/08/RFS-Policy-Brief-IER-2026.pdf">
            Institute for Energy Research, August 2026. The Renewable Fuel Standard credit, about 37 cents a gallon at a credit near $2.40.
          </Item>
          <Item href="https://www.eia.gov/todayinenergy/detail.php?id=67765">
            Energy Information Administration, June 10, 2026. Higher blending targets and the price of the credits.
          </Item>
          <Item href="https://x.com/US_OGA/status/2107604987652300892">
            US Oil and Gas Association, October 6, 2026. The credit at about 34 cents a gallon, against July 2008.
          </Item>
          <Item href="https://investorvalero.com/financials/">
            Valero, second quarter 2026. Refining cash cost $4.70 a barrel of throughput, depreciation $2.36, operating income $16.56.
          </Item>
          <Item href="https://files.constantcontact.com/6ddc9aab901/d3ac27a3-d4d4-44f3-9a3b-f91f88735d11.pdf">
            Michael A. Mische, University of Southern California, May 5, 2025. California's blend at 15 cents a gallon for the 2024 standard. An advocacy paper. Cap and trade and the low-carbon standard are separate lines in that paper.
          </Item>
          <Item href="https://ww2.arb.ca.gov/sites/default/files/classic/isd/fuels/gasoline/pub/cbgbkgr2.pdf">
            California Air Resources Board. Cleaner-burning gasoline costs 5 to 15 cents more a gallon to produce, from the refiners, when the rule was new.
          </Item>
          <Item href="https://www.epa.gov/gasoline-standards">
            Environmental Protection Agency. Gasoline standards, including which cities require reformulated gasoline.
          </Item>
        </ul>

        <h2 className="mt-10 text-xl">California</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
          <Item href="https://www.energy.ca.gov/estimated-gasoline-price-breakdown-and-margins">
            California Energy Commission. Estimated gasoline price breakdown and margins. Cap and trade, the low-carbon fuel standard, the tank fee, and the excise tax.
          </Item>
          <Item href="https://www.energy.ca.gov/what-drives-californias-gasoline-prices">
            California Energy Commission. Why California gasoline costs more: the isolated market, the blend, the programs, and the tax.
          </Item>
        </ul>

        <h2 className="mt-10 text-xl">The station</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
          <Item href="https://gasstationcompliancehub.com/tools/rack-to-street-margin">
            Gas Station Compliance Hub. A worked rack-to-street example: landed cost, tax, overhead, the card fee, and a target dime.
          </Item>
          <Item href="https://19january2021snapshot.epa.gov/sites/static/files/2020-09/documents/about_ust_finder_-_fact_sheet_final_9-24-2020_508.pdf">
            Environmental Protection Agency. Underground storage tanks are registered by location. A tank can be 5,000, 7,000, 10,000, or 20,000 gallons.
          </Item>
        </ul>

        <h2 className="mt-10 text-xl">Supply, the strait, and the war</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
          <Item href="https://www.eia.gov/outlooks/steo/">
            Energy Information Administration. Short-Term Energy Outlook. World liquids supply and demand.
          </Item>
          <Item href="https://www.energypolicy.columbia.edu/us-israeli-attacks-on-iran-and-global-energy-impacts/">
            Columbia University, Center on Global Energy Policy. The 2026 war, Hormuz, and the barrel.
          </Item>
          <Item href="https://www.everycrsreport.com/changes/2026-03-11_R45281_70874465f4435fd92357ac85f4af8f89300419a0__2026-08-07_R45281_f0a6d43cfd16b2461049a1c77774974a288dadbf.html">
            Congressional Research Service, R45281. The Strait of Hormuz, through August 7, 2026.
          </Item>
          <Item href="https://x.com/BurggrabenH/status/2104361288000221497">
            BurggrabenH, on X. A note on the barrels still moving.
          </Item>
          <Item href="https://x.com/Recon_One7/status/2104399152759103691">
            Recon_One7, on X. A note sent in while the strait was being counted.
          </Item>
        </ul>

        <h2 className="mt-10 text-xl">Food</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
          <Item href="https://www.ers.usda.gov/data-products/food-dollar/summary-findings">
            U.S. Department of Agriculture, Economic Research Service. The food dollar, 2024. The farm's share, and the shares for eggs, beef, and milk.
          </Item>
          <Item href="https://www.ers.usda.gov/data-products/food-dollar">
            Economic Research Service. Food Dollar data product.
          </Item>
          <Item href="https://www.ers.usda.gov/data-products/food-dollar-series/documentation/">
            Economic Research Service. How the food dollar is counted. Energy was 4.3 cents of the 2023 dollar. Freight was 3.5.
          </Item>
          <Item href="https://ers.usda.gov/media/20837/err-357.pdf">
            Baker and Zachary, Economic Research Service, report 357, 2026. A more detailed food dollar.
          </Item>
          <Item href="https://www.ers.usda.gov/data-products/farm-income-and-wealth-statistics/production-expenses">
            Economic Research Service. National farm expenses. Fuel, diesel, and fertilizer.
          </Item>
          <Item href="https://www.ers.usda.gov/data-products/commodity-costs-and-returns">
            Economic Research Service. Cost to grow corn, wheat, milk, hogs, and a calf, by year.
          </Item>
          <Item href="https://www.ers.usda.gov/data-products/meat-price-spreads">
            Economic Research Service. Monthly farm, wholesale, and retail values for beef, pork, chicken, and eggs.
          </Item>
          <Item href="https://www.ers.usda.gov/data-products/price-spreads-from-farm-to-consumer">
            Economic Research Service. Farm-to-retail spreads, including milk.
          </Item>
          <Item href="https://ers.usda.gov/media/8557/err-112.pdf">
            Economic Research Service, report 112. How long a cattle-price move takes to reach the grocery case.
          </Item>
          <Item href="https://www.nass.usda.gov/Publications/Todays_Reports/reports/fpex0726.pdf">
            National Agricultural Statistics Service. Farm production expenditures, 2025.
          </Item>
          <Item href="https://farms.extension.wisc.edu/articles/milk-hauling-quick-reference/">
            University of Wisconsin. What a farm pays to haul milk, and how little of a diesel spike gets passed through.
          </Item>
          <Item href="https://fmma30.com/StaffPapers/StaffPaper--25-03.pdf">
            Federal Milk Marketing Order 30. Hauling charges, May 2025. Staff paper 25-03.
          </Item>
          <Item href="https://www.eggindustrycenter.org/media/cms/Specialty_Egg_Cost_and_Prices_Decem_B9F63370709FA.pdf">
            Egg Industry Center. Specialty egg costs, 2024. Feed per dozen, and what an extra 25 miles of feed hauling costs.
          </Item>
          <Item href="https://www.nationalbeefwire.com/in-the-cattle-markets-the-changing-cost-of-cattle-transportation">
            National Beef Wire. What it costs to truck a finished steer to the plant.
          </Item>
          <Item href="https://cheesereporter.com/news/2025/06/02/farm-to-retail-price-spread-for-dairy-products-declined-in-2024-farm-value-rose/">
            Cheese Reporter, from the Economic Research Service. Whole milk in 2024: $3.98 at the store, $1.97 at the farm.
          </Item>
          <Item href="https://uaex.uada.edu/farm-ranch/crops-commercial-horticulture/wheat/2024%20WRVP%20Annual%20Report_CE_JK_BW_%20Final.pdf">
            University of Arkansas. 2024 wheat fields. Diesel was about $13 an acre.
          </Item>
          <Item href="https://farmdocdaily.illinois.edu/2025/04/are-us-crop-production-costs-high.html">
            University of Illinois, farmdoc daily. Crop costs since 1975, from the Economic Research Service series.
          </Item>
          <Item href="https://www.agrinews-pubs.com/opinion/columnists/2026/04/14/follow-your-food-dollars-beyond-the-farm-gate/">
            AgriNews, citing the 2024 food dollar by product. Eggs 69 cents, beef 52, fresh milk 51.
          </Item>
        </ul>
      </main>
    </>
  );
}

function Item({ href, children }: { href: string; children: string }) {
  return (
    <li>
      <a href={href} className="underline" target="_blank" rel="noreferrer">
        {children}
      </a>
    </li>
  );
}
