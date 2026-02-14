import { PERFORMANCE_BUDGETS } from "@/config/performance-budgets";

export const metadata = {
  title: "Performance Health",
};

export default function PerformanceHealthPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Performance Health</h1>
        <p className="mt-2 text-sm text-slate-600">
          Route budgets below are used as RUM review targets. Client metrics are posted to <code>/api/rum</code>.
        </p>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">TTFB</th>
              <th className="px-4 py-3">FCP</th>
              <th className="px-4 py-3">LCP</th>
              <th className="px-4 py-3">INP</th>
              <th className="px-4 py-3">CLS</th>
            </tr>
          </thead>
          <tbody>
            {PERFORMANCE_BUDGETS.map((budget) => (
              <tr key={budget.route} className="border-t border-slate-100">
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{budget.route}</td>
                <td className="px-4 py-3 text-slate-700">&lt;= {budget.ttfbMs} ms</td>
                <td className="px-4 py-3 text-slate-700">&lt;= {budget.fcpMs} ms</td>
                <td className="px-4 py-3 text-slate-700">&lt;= {budget.lcpMs} ms</td>
                <td className="px-4 py-3 text-slate-700">&lt;= {budget.inpMs} ms</td>
                <td className="px-4 py-3 text-slate-700">&lt;= {budget.cls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
