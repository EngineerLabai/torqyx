"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import { downloadReportPdf } from "@/utils/report-export";
import { evaluateFormula, runMonteCarlo, runSweep } from "@/lib/sanityCheck/engine";
import type { LabSession } from "@/lib/sanityCheck/types";
import ChartCanvas from "@/components/sanity-check/ChartCanvas";

const formatNumber = (value: number | null, locale: "tr" | "en") => {
  if (value === null) return "-";
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "tr-TR", { maximumFractionDigits: 6 }).format(value);
};

export default function ReportView({ session }: { session: LabSession }) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.sanityCheck;

  const result = useMemo(() => evaluateFormula(session), [session]);
  const sweep = useMemo(() => runSweep(session, session.sweep.variableId), [session]);
  const monteCarlo = useMemo(() => runMonteCarlo(session), [session]);
  const pdfTitle = copy.report.title;

  const sweepConfig = useMemo(() => {
    if (!sweep.points.length) return null;
    return {
      type: "line" as const,
      datasets: [
        {
          label: copy.report.sweepTitle,
          data: sweep.points.map((point) => ({ x: point.x, y: point.y })),
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14,165,233,0.2)",
        },
      ],
    };
  }, [copy.report.sweepTitle, sweep.points]);

  const histogramConfig = useMemo(() => {
    if (!monteCarlo.histogram.length) return null;
    return {
      type: "bar" as const,
      labels: monteCarlo.histogram.map((bin) => `${bin.x0.toFixed(2)}-${bin.x1.toFixed(2)}`),
      datasets: [
        {
          label: copy.report.monteCarloTitle,
          data: monteCarlo.histogram.map((bin) => bin.count),
          backgroundColor: "rgba(16,185,129,0.4)",
          borderColor: "#10b981",
        },
      ],
    };
  }, [copy.report.monteCarloTitle, monteCarlo.histogram]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">{copy.report.title}</h1>
        <div className="no-print flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
          >
            {copy.report.print}
          </button>
          <button
            type="button"
            onClick={() => downloadReportPdf("report-area", pdfTitle)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
          >
            {copy.report.downloadPdf}
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">{copy.report.variablesTitle}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">{copy.variableTable.symbol}</th>
                <th className="px-3 py-2">{copy.variableTable.name}</th>
                <th className="px-3 py-2">{copy.variableTable.value}</th>
                <th className="px-3 py-2">{copy.variableTable.unit}</th>
                <th className="px-3 py-2">{copy.variableTable.min}</th>
                <th className="px-3 py-2">{copy.variableTable.max}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {session.variables.map((variable) => (
                <tr key={variable.id}>
                  <td className="px-3 py-2 font-semibold text-slate-900">{variable.symbol}</td>
                  <td className="px-3 py-2">{variable.name}</td>
                  <td className="px-3 py-2">{formatNumber(variable.value, locale)}</td>
                  <td className="px-3 py-2">{variable.unit || copy.resultPanel.dimensionless}</td>
                  <td className="px-3 py-2">{formatNumber(variable.min ?? null, locale)}</td>
                  <td className="px-3 py-2">{formatNumber(variable.max ?? null, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">{copy.report.formulaTitle}</h2>
        <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {session.formula}
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">{copy.report.resultTitle}</h2>
        <div className="mt-3 text-xl font-semibold text-slate-900">
          {formatNumber(result.value, locale)}
          <span className="ml-2 text-sm text-slate-500">{result.unit || copy.resultPanel.dimensionless}</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">{copy.report.sweepTitle}</h2>
        <div className="mt-3 h-56">
          {sweepConfig ? (
            <ChartCanvas config={sweepConfig} className="h-full w-full" />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
              {copy.sweepPanel.empty}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">{copy.report.monteCarloTitle}</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-[11px] font-semibold text-slate-600">{copy.monteCarloPanel.statsTitle}</div>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>{copy.monteCarloPanel.mean}</span>
                <span className="font-semibold text-slate-900">{formatNumber(monteCarlo.stats.mean, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{copy.monteCarloPanel.stdev}</span>
                <span className="font-semibold text-slate-900">{formatNumber(monteCarlo.stats.stdev, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{copy.monteCarloPanel.p05}</span>
                <span className="font-semibold text-slate-900">{formatNumber(monteCarlo.stats.p05, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{copy.monteCarloPanel.p50}</span>
                <span className="font-semibold text-slate-900">{formatNumber(monteCarlo.stats.p50, locale)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{copy.monteCarloPanel.p95}</span>
                <span className="font-semibold text-slate-900">{formatNumber(monteCarlo.stats.p95, locale)}</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-[11px] font-semibold text-slate-600">{copy.monteCarloPanel.chartTitle}</div>
            <div className="mt-2 h-48">
              {histogramConfig ? (
                <ChartCanvas config={histogramConfig} className="h-full w-full" />
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-xs text-slate-500">
                  {copy.monteCarloPanel.empty}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
