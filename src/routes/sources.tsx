import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../view/header";
import { sourceRows } from "../model/sources";

export const Route = createFileRoute("/sources")({ component: Sources });

function Sources() {
  const rows = sourceRows();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 text-ink">
        <h1 className="text-3xl leading-tight">Sources by State</h1>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-2 pr-3 font-medium">State</th>
                <th className="py-2 pr-3 font-medium">Refineries</th>
                <th className="py-2 pr-3 font-medium">Region</th>
                <th className="py-2 pr-3 font-medium">Wholesale on the bill</th>
                <th className="py-2 pr-3 font-medium">Crude behind the lag</th>
                <th className="py-2 font-medium">Transport per gallon</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.state} className="border-b border-line align-top">
                  <td className="py-3 pr-3">{row.state}</td>
                  <td className="py-3 pr-3">{row.refineries}</td>
                  <td className="py-3 pr-3">{row.region}</td>
                  <td className="py-3 pr-3">{row.where}</td>
                  <td className="py-3 pr-3">{row.crude}</td>
                  <td className="py-3">{row.transport}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
