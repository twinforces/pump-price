import { createFileRoute } from "@tanstack/react-router";
import { StationFlow } from "../view/station-flow";
import { Header } from "../view/header";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-10 text-ink">
        <h1 className="text-3xl leading-tight">Gas Prices</h1>
        <StationFlow />
      </main>
    </>
  );
}