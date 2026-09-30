import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
        <img src="/pfp.jpg" alt="" className="h-10 w-10 rounded-full" />
        <div className="min-w-0">
          <p className="text-lg leading-none">Pump Price</p>
          <a
            href="https://x.com/GrumpyTechBro"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted underline"
          >
            a GrumpyTechBro joint
          </a>
        </div>
        <nav className="ml-auto flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link to="/" className="underline">
            Gas Prices
          </Link>
          <Link to="/timing" className="underline">
            Gas Station Timing
          </Link>
          <Link to="/supply" className="underline">
            Supply vs. Demand
          </Link>
          <Link to="/sources" className="underline">
            Sources
          </Link>
          <Link to="/authors-note" className="underline">
            Author's Note
          </Link>
          <Link to="/receipts" className="underline">
            Receipts
          </Link>
        </nav>
      </div>
    </header>
  );
}
