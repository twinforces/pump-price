import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../view/header";

export const Route = createFileRoute("/supply")({ component: Supply });

function Supply() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-10 text-ink">
      <h1 className="mt-8 text-3xl leading-tight">Supply vs. Demand</h1>
      <p className="mt-4 leading-relaxed">
        We looked. Supply tracks demand. The price does not follow either one. This page stays as it is.
      </p>
      <p className="mt-3 leading-relaxed">
        World supply and world demand are each about 100 million barrels a day. Producers pump about
        what the world uses. The gap is usually under 3 million barrels a day.
      </p>
      <p className="mt-3 leading-relaxed">
        The US crude price does not follow those lines. From 2015 through the months before the
        strait, a higher month of demand was not a higher month of price. A change in supply barely
        moved the price either. The lines and the price drifted up together into 2022. Take that
        shared drift out and the link is gone.
      </p>
      <p className="mt-3 leading-relaxed">
        Two holes are real, and they are not the ordinary month. In spring 2020 demand fell to about
        80 million barrels a day and crude went to $17. In the published balance for spring 2026,
        supply fell to about 95 million barrels a day while demand stayed near 100, and crude rose
        from about $60 to about $100. That stretch is still being revised. Set it aside and the
        ordinary month is still producers tracking what gets used, and a price that arrives from
        somewhere else.
      </p>
      <p className="mt-3 leading-relaxed">
        That is why <Link to="/" className="underline">Gas Prices</Link> takes the barrel as an input.
        The story is the <Link to="/authors-note" className="underline">Author's Note</Link>.
        The bibliography is <Link to="/receipts" className="underline">Receipts</Link>.
      </p>
      <img
        src="/score-world.png"
        alt="World liquid-fuels supply and demand, and the US crude price, monthly from 2015 through June 2026. Gray band is spring 2020. Tan band is spring 2026."
        className="mt-6 w-full border border-line"
      />
    </main>
    </>
  );
}
