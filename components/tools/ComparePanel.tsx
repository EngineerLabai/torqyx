"use client";

import type { ComponentType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import type {
  ToolCompareMetric,
  ToolCompareScenario,
  ToolCompareVisualizationProps,
  ToolInputProps,
} from "@/tools/_shared/types";

type ScenarioState<TInput> = {
  id: "a" | "b" | "c";
  title: "A" | "B" | "C";
  label: string;
  input: TInput;
};

type ComparePanelProps<TInput, TResult> = {
  toolId: string;
  initialInput: TInput;
  baseInput?: TInput;
  calculate: (input: TInput) => TResult;
  InputSection: ComponentType<ToolInputProps<TInput>>;
  compareMetrics?: ToolCompareMetric<TInput, TResult>[];
  CompareVisualizationSection?: ComponentType<ToolCompareVisualizationProps<TInput, TResult>>;
};

const SCENARIO_IDS: Array<ScenarioState<unknown>["id"]> = ["a", "b", "c"];
const SCENARIO_TITLES: Record<ScenarioState<unknown>["id"], ScenarioState<unknown>["title"]> = {
  a: "A",
  b: "B",
  c: "C",
};
const SCENARIO_COLORS: Record<ScenarioState<unknown>["id"], string> = {
  a: "#10b981",
  b: "#0ea5e9",
  c: "#f59e0b",
};

const safeDecode = <TInput,>(value: string | null): TInput | null => {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as TInput;
  } catch {
    return null;
  }
};

const safeEncode = <TInput,>(value: TInput) => {
  try {
    return encodeURIComponent(JSON.stringify(value));
  } catch {
    return "";
  }
};

const toLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());

const isPrimitive = (value: unknown) =>
  value === null ||
  value === undefined ||
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean";

export default function ComparePanel<TInput, TResult>({
  toolId,
  initialInput,
  baseInput,
  calculate,
  InputSection,
  compareMetrics,
  CompareVisualizationSection,
}: ComparePanelProps<TInput, TResult>) {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.components.comparePanel;
  const common = messages.common;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [shareMessage, setShareMessage] = useState("");
  const didInit = useRef(false);
  const defaultInput = baseInput ?? initialInput;

  const [scenarios, setScenarios] = useState<Array<ScenarioState<TInput>>>(() => [
    { id: "a", title: "A", label: "", input: defaultInput },
    { id: "b", title: "B", label: "", input: defaultInput },
  ]);

  useEffect(() => {
    if (didInit.current) return;
    const sharedA = safeDecode<TInput>(searchParams?.get("a") ?? null);
    const sharedB = safeDecode<TInput>(searchParams?.get("b") ?? null);
    const sharedC = safeDecode<TInput>(searchParams?.get("c") ?? null);
    const base = defaultInput;
    const nextScenarios: Array<ScenarioState<TInput>> = [
      { id: "a", title: "A", label: "", input: sharedA ?? base },
      { id: "b", title: "B", label: "", input: sharedB ?? base },
    ];
    if (sharedC) {
      nextScenarios.push({ id: "c", title: "C", label: "", input: sharedC });
    }
    setScenarios(nextScenarios);
    didInit.current = true;
  }, [searchParams, defaultInput]);

  const scenarioResults = useMemo(
    () =>
      scenarios.map<ToolCompareScenario<TInput, TResult>>((scenario) => ({
        ...scenario,
        result: calculate(scenario.input),
        color: SCENARIO_COLORS[scenario.id],
      })),
    [scenarios, calculate],
  );

  const metrics = useMemo(() => {
    if (compareMetrics && compareMetrics.length > 0) return compareMetrics;
    const keys = new Set<string>();
    const ordered: string[] = [];
    scenarioResults.forEach((scenario) => {
      if (!scenario.result || typeof scenario.result !== "object") return;
      Object.entries(scenario.result as Record<string, unknown>)
        .filter(([, value]) => isPrimitive(value))
        .forEach(([key]) => {
          if (!keys.has(key)) {
            keys.add(key);
            ordered.push(key);
          }
        });
    });
    return ordered.map((key) => ({
      key,
      label: toLabel(key),
      getValue: (result: TResult) => (result as Record<string, unknown>)[key] as string | number | boolean | null,
    }));
  }, [compareMetrics, scenarioResults]);

  const formatValue = (value: string | number | boolean | null | undefined) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") {
      return value ? common.yes : common.no;
    }
    if (typeof value === "number") {
      if (!Number.isFinite(value)) return "-";
      return value.toLocaleString(locale === "en" ? "en-US" : "tr-TR", { maximumFractionDigits: 4 });
    }
    return value;
  };

  const handleScenarioChange = (id: ScenarioState<TInput>["id"], nextInput: TInput) => {
    setScenarios((prev) =>
      prev.map((scenario) => (scenario.id === id ? { ...scenario, input: nextInput } : scenario)),
    );
  };

  const handleLabelChange = (id: ScenarioState<TInput>["id"], nextLabel: string) => {
    setScenarios((prev) =>
      prev.map((scenario) => (scenario.id === id ? { ...scenario, label: nextLabel } : scenario)),
    );
  };

  const handleAddScenario = () => {
    setScenarios((prev) => {
      if (prev.length >= 3) return prev;
      const nextId = SCENARIO_IDS[prev.length] as ScenarioState<TInput>["id"];
      return [
        ...prev,
        { id: nextId, title: SCENARIO_TITLES[nextId], label: "", input: prev[0]?.input ?? defaultInput },
      ];
    });
  };

  const handleRemoveScenario = () => {
    setScenarios((prev) => (prev.length > 2 ? prev.slice(0, prev.length - 1) : prev));
  };

  const handleReset = () => {
    setScenarios((prev) =>
      prev.map((scenario) => ({
        ...scenario,
        label: "",
        input: defaultInput,
      })),
    );
  };

  const handleShare = async () => {
    if (!pathname) return;
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const scenarioMap = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
    SCENARIO_IDS.forEach((id) => {
      const scenario = scenarioMap.get(id as ScenarioState<TInput>["id"]);
      if (!scenario) {
        params.delete(id);
        return;
      }
      const encoded = safeEncode(scenario.input);
      if (encoded) {
        params.set(id, encoded);
      } else {
        params.delete(id);
      }
    });
    const query = params.toString();
    const url = query
      ? `${window.location.origin}${pathname}?${query}`
      : `${window.location.origin}${pathname}`;

    try {
      await navigator.clipboard.writeText(url);
      setShareMessage(copy.shareSuccess);
    } catch {
      setShareMessage(copy.shareFail);
    }

    window.setTimeout(() => setShareMessage(""), 2000);
  };

  const headingFor = (scenario: { title: string; label?: string }) =>
    scenario.label ? `${scenario.title}${copy.separator}${scenario.label}` : scenario.title;

  return (
    <section
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      data-tool-id={toolId}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
          <p className="text-xs text-slate-500">{copy.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAddScenario}
            disabled={scenarios.length >= 3}
            aria-label={copy.add}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {copy.add}
          </button>
          <button
            type="button"
            onClick={handleRemoveScenario}
            disabled={scenarios.length <= 2}
            aria-label={copy.remove}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {copy.remove}
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label={copy.reset}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300"
          >
            {copy.reset}
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label={copy.share}
            className="rounded-full border border-slate-900 bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-slate-800"
          >
            {copy.share}
          </button>
          {shareMessage ? <span className="text-[11px] text-slate-500">{shareMessage}</span> : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: SCENARIO_COLORS[scenario.id] }}
                >
                  {scenario.title}
                </span>
                <div className="text-xs font-semibold text-slate-700">{copy.scenario}</div>
              </div>
              <input
                type="text"
                value={scenario.label}
                onChange={(event) => handleLabelChange(scenario.id, event.target.value)}
                placeholder={copy.label}
                aria-label={`${copy.scenario} ${scenario.title} ${copy.label}`}
                className="w-full min-w-[140px] rounded-lg border border-slate-200 px-3 py-1 text-[11px] text-slate-700 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 sm:w-auto"
              />
            </div>
            <div className="mt-4">
              <InputSection input={scenario.input} onChange={(next) => handleScenarioChange(scenario.id, next)} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.tableTitle}</h3>
        {metrics.length === 0 ? (
          <p className="mt-2 text-xs text-slate-500">{copy.emptyMetrics}</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[11px] text-slate-600">
              <thead>
                <tr>
                  <th className="pb-2 text-slate-500">{copy.metricLabel}</th>
                  {scenarioResults.map((scenario) => (
                    <th key={scenario.id} className="pb-2 text-slate-700">
                      {headingFor(scenario)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.key} className="border-t border-slate-200">
                    <td className="py-2 font-medium text-slate-600">{metric.label}</td>
                    {scenarioResults.map((scenario) => (
                      <td key={scenario.id} className="py-2 font-mono text-slate-900">
                        {formatValue(metric.getValue(scenario.result, scenario.input))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {CompareVisualizationSection ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <CompareVisualizationSection scenarios={scenarioResults} />
        </div>
      ) : null}
    </section>
  );
}
