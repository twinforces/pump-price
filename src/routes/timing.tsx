import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../view/header";
import { Timing } from "../view/timing";

export const Route = createFileRoute("/timing")({ component: TimingPage });

function TimingPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10 text-ink">
        <h1 className="text-3xl leading-tight">Gas Station Timing</h1>
        <Timing />
      </main>
    </>
  );
}
