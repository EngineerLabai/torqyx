"use client";

import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import ComparePanel from "@/components/tools/ComparePanel";
import ToolHistory from "@/components/tools/ToolHistory";
import type { ToolDefinition } from "@/tools/_shared/types";
import { trackEvent } from "@/utils/analytics";

type ToolPageProps<TInput, TResult> = {
  tool: ToolDefinition<TInput, TResult>;
  initialDocs?: ComponentProps<typeof ToolDocTabs>["initialDocs"];
};

const safeDecode = <TInput,>(value: string | null): TInput | null => {
  if (!value) return null;
  try {
    const decoded = JSON.parse(decodeURIComponent(value)) as TInput;
    return decoded;
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

export default function ToolPage<TInput, TResult>({ tool, initialDocs }: ToolPageProps<TInput, TResult>) {
  const [input, setInput] = useState<TInput>(tool.initialInput);
  const result = useMemo(() => tool.calculate(input), [input, tool]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string>("");
  const calculateTimeout = useRef<number | null>(null);
  const hasTrackedInitial = useRef(false);

  useEffect(() => {
    const historyId = searchParams?.get("historyId");
    const shared = searchParams?.get("input");

    if (shared) {
      const decoded = safeDecode<TInput>(shared);
      if (decoded) {
        Promise.resolve().then(() => setInput(decoded));
        return;
      }
    }

    if (!historyId || historyId === loadedHistoryId) return;

    try {
      const stored = localStorage.getItem(`tool-history:${tool.id}`);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Array<{ id: string; input: TInput }>;
      const match = parsed.find((entry) => entry.id === historyId);
      if (!match) return;
      Promise.resolve().then(() => {
        setInput(match.input);
        setLoadedHistoryId(historyId);
      });
    } catch {
      // ignore invalid storage data
    }
  }, [searchParams, tool.id, loadedHistoryId]);

  useEffect(() => {
    if (!hasTrackedInitial.current) {
      hasTrackedInitial.current = true;
      return;
    }

    if (calculateTimeout.current) {
      window.clearTimeout(calculateTimeout.current);
    }

    calculateTimeout.current = window.setTimeout(() => {
      trackEvent("calculate_click", { tool_id: tool.id, tool_title: tool.title });
    }, 600);

    return () => {
      if (calculateTimeout.current) {
        window.clearTimeout(calculateTimeout.current);
      }
    };
  }, [input, tool.id, tool.title]);

  const handleCopyLink = async () => {
    if (!pathname) return;
    const encoded = safeEncode(input);
    const url = `${window.location.origin}${pathname}?input=${encoded}`;

    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Link kopyalandi.");
    } catch {
      setShareMessage("Kopyalama basarisiz. Linki manuel kopyalayabilirsin.");
    }

    window.setTimeout(() => setShareMessage(""), 2000);
  };

  const InputSection = tool.InputSection;
  const ResultSection = tool.ResultSection;
  const VisualizationSection = tool.VisualizationSection;
  const CompareVisualizationSection = tool.CompareVisualizationSection;

  return (
    <PageShell>
      <ToolDocTabs slug={tool.id} initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <p className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              Hesaplayici
            </p>
            <h1 className="text-lg font-semibold text-slate-900">{tool.title}</h1>
            <p className="text-sm text-slate-600">{tool.description}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <InputSection input={input} onChange={setInput} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <ResultSection result={result} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <VisualizationSection input={input} result={result} />
        </section>

        <ComparePanel
          toolId={tool.id}
          initialInput={tool.initialInput}
          baseInput={input}
          calculate={tool.calculate}
          InputSection={InputSection}
          compareMetrics={tool.compareMetrics}
          CompareVisualizationSection={CompareVisualizationSection}
        />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ToolHistory toolId={tool.id} toolTitle={tool.title} input={input} result={result} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">Paylasilabilir Link</h2>
            <p className="text-xs text-slate-500">
              Parametreleri URL icine ekleyerek ayni sonucu baskalariyla paylasabilirsin.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
            >
              Linki Kopyala
            </button>
            {shareMessage ? <span className="text-[11px] text-slate-500">{shareMessage}</span> : null}
          </div>
        </section>
      </ToolDocTabs>
    </PageShell>
  );
}
