import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../view/header";

export const Route = createFileRoute("/authors-note")({ component: AuthorsNote });

function AuthorsNote() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-10 text-ink">
        <h1 className="text-3xl leading-tight">Author's Note</h1>
        <p className="mt-4 leading-relaxed">
          I set out to build a page that let you track an oil shock. Close the Strait of Hormuz,
          watch supply and demand move the barrel, watch the barrel move gasoline, and watch
          gasoline and diesel move ground beef, eggs, and milk. That was not to be.
        </p>
        <p className="mt-3 leading-relaxed">
          The first thing I found is that the oil price has nothing to do with demand. The suppliers
          pump to meet demand. Not too much, and not too little. There are wells that only pump when
          the price is above some number. Some of the wells shut in California are shut because it
          is not worth it for Chevron to pump them.
        </p>
        <img
          src="/score-world.png"
          alt="World liquid-fuels supply and demand, and the US crude price, monthly from 2015 through June 2026. Gray band is spring 2020. Tan band is spring 2026."
          className="mt-6 w-full border border-line"
        />
        <p className="mt-3 leading-relaxed">
          A supply-and-demand curve is 19th century economics. The California electricity debacle
          showed that it doesn't work in the 21st. The chart, and the argument, stay on{" "}
          <Link to="/supply" className="underline">Supply vs. Demand</Link>.
        </p>
        <p className="mt-3 leading-relaxed">
          I went to bed one night thinking the traders were just emotional, the way a stock is
          emotional. So I checked the barrel against gold, and against copper, in case the dollar
          was the weird part. Gold and crude don't even move together in an ordinary month. Copper
          does, a little. It isn't the currency. The emotion is in the barrel.
        </p>
        <p className="mt-3 leading-relaxed">
          Prices are high not because demand is outrunning supply, but because people believe the
          price should be higher if the supply is lower. And the number on the news isn't a
          delivery. It's a bet on a later month. I graded it. A contract three months out missed the
          barrel that actually showed up by about as much as the barrel moved. That's a coin flip.
          The quote is early, and it's imaginary. The tank at the station is late, and it's real.
          Maybe the supply really is lower. Maybe it isn't. There's fog on that, and it's clearing.
          You can always trust capitalists to find the holes when money is on the line.
        </p>
        <p className="mt-3 leading-relaxed">
          The barrel they quote is one grade. It isn't "oil." We run a mix. When somebody says
          we're energy independent, they mean the light stuff. Diesel wants the heavy, sour kind.
          That's why a tanker that doesn't leave the Gulf matters more than another well in Texas.
        </p>
        <p className="mt-3 leading-relaxed">
          Along the way I found another myth. The press will say Iran is 7 percent of the world's
          oil. Iran burns about half of that at home. Kharg Island handles the exports, not the
          wells. Domestic use is enough to keep the wells running, so bombing Kharg takes about 3.5
          percent of world supply off the market until the island is rebuilt. Iran doesn't have the
          leverage the coverage gives it.
        </p>
        <p className="mt-3 leading-relaxed">
          Gasoline and diesel are a mechanism you can actually follow. They come in 51 recipes. I
          researched them and put them on <Link to="/" className="underline">Gas Prices</Link>, and
          the pump tracks the barrel pretty closely. Diesel ought to be cheaper than gasoline, but we
          need it more than we need gasoline, so the price at the harbor gets bid up. That part
          really is supply and demand. Then the station marks it up again. At a regular station,
          diesel sells slow, so the pumps and the tanks have to get paid for on fewer gallons. A
          truck stop is the other way around. The person who used to manage convenience stores told
          me that.
        </p>
        <p className="mt-3 leading-relaxed">
          People complain, with varying levels of paranoia, that the sign goes up fast and comes
          down slow. That is true. The first thing to know is that many stations do not make their
          money on the gallon. They make it on cigarettes, beer, beef jerky, and boner pills. That
          is inside sales. If the inside is good, the station may even cheapen the gasoline to get
          you in the door, because the inside is about 70 percent of the profit. Note to Elon: a
          Supercharger stop should be as nice as a Buc-ee's. People spend money when they're bored.
          It isn't only greed.
        </p>
        <p className="mt-3 leading-relaxed">
          My local station has no competitor next door, and it's an independent brand, so the sign
          changes when the owner gets around to it. Sometimes it's lower than the station five miles
          down the main street. Sometimes it's higher. It's a small place. I don't think the price
          gets touched every day.
        </p>
        <p className="mt-3 leading-relaxed">
          A chain is a different machine. You tell the computer how many gallons you meant to sell,
          and what margin you want. It looks at the bill of lading and everybody else's sign, and it
          tries a nickel. If they follow you up, you try another nickel. If your gallons aren't
          moving, you keep easing it down, even if that gallon is cheaper than what you paid for it.
          Capitalism as a competitive sport. My station doesn't play. The owner gets around to it.
        </p>
        <p className="mt-3 leading-relaxed">
          A former oil executive, and that same convenience-store manager, both told me there's
          greed in it too. Owners raise fast and lower slow. I saw the price war. I didn't build it.
        </p>
        <p className="mt-3 leading-relaxed">
          What I kept, because it seems to work, is simpler. The owner posts the cost of the most
          expensive gallon still in the tank. The crude has to reach the refinery, the refinery has
          to run, and a tanker has to reach the station. That takes a while, and the wait is
          different in every state. <Link to="/timing" className="underline">Gas Station Timing</Link>{" "}
          animates that rule. It more or less tracks what you see, without having to simulate Gas
          Station Wars.
        </p>
        <p className="mt-3 leading-relaxed">
          At the end I dug into the grocery store. Diesel is in a lot of food. It is not very much of
          the price. Pennies, not dollars. No need for that page either. The sources are on{" "}
          <Link to="/receipts" className="underline">Receipts</Link>.
        </p>
      </main>
    </>
  );
}
