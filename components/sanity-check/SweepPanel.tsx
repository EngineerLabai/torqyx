"use client";

import { useMemo, useState } from "react";
import ChartCanvas from "@/components/sanity-check/ChartCanvas";
import { runSweep } from "@/lib/sanityCheck/engine";
import type { LabSession, SweepResult } from "@/lib/sanityCheck/types";

const buildAxisLabel = (label: string, unit: string) => (unit ? `${label} (${unit})` : label);

type SweepPanelCopy = {
  title: string;
  description: string;
  variableLabel: string;
  pointsLabel: string;
  run: string;
  chartTitle: string;
  resultLabel: string;
  empty: string;
  rangeMissing: string;
};

type SweepPanelProps = {
  session: LabSession;
  onSessionChange: (next: LabSession) => void;
  copy: SweepPanelCopy;
};

export default function SweepPanel({ session, onSessionChange, copy }: SweepPanelProps) {
  const [result, setResult] = useState<SweepResult | null>(null);

  const variables = session.variables;
  const selectedId = session.sweep.variableId ?? variables[0]?.id;
  const selectedVar = variables.find((variable) => variable.id === selectedId);

  const handleRun = () => {
    const next = runSweep(session, selectedId);
    setResult(next);
  };

  const chartConfig = useMemo(() => {
    if (!result || result.points.length === 0) return null;
    return {
      type: "line" as const,
      datasets: [
        {
          label: copy.chartTitle,
          data: result.points.map((point) => ({ x: point.x, y: point.y })),
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14,165,233,0.2)",
        },
      ],
      xLabel: buildAxisLabel(selectedVar?.symbol ?? "x", result.xUnit),
      yLabel: buildAxisLabel(copy.resultLabel, result.yUnit),
    };
  }, [copy.chartTitle, copy.resultLabel, result, selectedVar]);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">{copy.title}</h3>
        <p className="text-xs text-slate-500">{copy.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-600">{copy.variableLabel}</label>
          <select
            value={selectedId ?? ""}
            onChange={(event) =>
              onSessionChange({
                ...session,
                sweep: { ...session.sweep, variableId: event.target.value },
              })
            }
            className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
          >
            {variables.map((variable) => (
              <option key={variable.id} value={variable.id}>
                {variable.symbol} - {variable.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-600">{copy.pointsLabel}</label>
          <input
            type="number"
            value={session.sweep.points}
            min={2}
            max={200}
            onChange={(event) =>
              onSessionChange({
                ...session,
                sweep: { ...session.sweep, points: Number(event.target.value) || 50 },
              })
            }
            className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleRun}
        className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
      >
        {copy.run}
      </button>

      {result?.error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {copy.rangeMissing}
        </div>
      ) : null}

      {chartConfig ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="h-56">
            <ChartCanvas config={chartConfig} className="h-full w-full" />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          {copy.empty}
        </div>
      )}
    </div>
  );
}
