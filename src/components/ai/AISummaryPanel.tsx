"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { stableHash } from "@/src/lib/ai/stableHash";
import AIDeterministicDisclaimer from "@/src/components/ai/AIDeterministicDisclaimer";
import type { ToolSummaryResponse } from "@/src/lib/ai/types";
import type { Locale } from "@/utils/locale";

type AISummaryPanelProps = {
  locale: Locale;
  toolId: string;
  toolName: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
};

type SummaryApiSuccess = {
  ok: true;
  mode?: string;
  provider?: string;
  cached?: boolean;
  fallback?: boolean;
  message?: string;
  data?: ToolSummaryResponse;
};

type SummaryApiFailure = {
  ok?: false;
  error?: string;
  message?: string;
};

type SummaryApiResponse = SummaryApiSuccess | SummaryApiFailure;

type SummaryCacheRecord = {
  savedAt: number;
  payloadHash: string;
  data: ToolSummaryResponse;
};

type PanelState = "idle" | "loading" | "ready" | "error";

const STORAGE_PREFIX = "aielab:ai_summary:";

const LABELS = {
  tr: {
    titleButton: "AI Özeti",
    closeButton: "Kapat",
    loading: "AI özeti hazırlanıyor...",
    error: "AI özeti şu anda yüklenemedi.",
    retry: "Tekrar Dene",
    assumptions: "Varsayımlar",
    warnings: "Uyarılar",
    nextSteps: "Sonraki Adımlar",
    disclaimer: "Sorumluluk Reddi",
    fallback: "AI sağlayıcısı şu anda sınırlı olabilir. Bu nedenle varsayılan bilgilendirme özeti gösteriliyor.",
  },
  en: {
    titleButton: "AI Summary",
    closeButton: "Close",
    loading: "Preparing AI summary...",
    error: "AI summary could not be loaded right now.",
    retry: "Retry",
    assumptions: "Assumptions",
    warnings: "Warnings",
    nextSteps: "Next Steps",
    disclaimer: "Disclaimer",
    fallback: "AI provider may currently be limited. A fallback informational summary is shown.",
  },
} as const;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isToolSummaryResponse = (value: unknown): value is ToolSummaryResponse => {
  if (!isObject(value)) return false;
  return (
    typeof value.summaryMd === "string" &&
    typeof value.disclaimerMd === "string" &&
    isStringArray(value.assumptions) &&
    isStringArray(value.warnings) &&
    isStringArray(value.nextSteps)
  );
};

const safeReadStorage = (key: string): SummaryCacheRecord | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SummaryCacheRecord;
    if (!parsed || typeof parsed !== "object") return null;
    if (!isToolSummaryResponse(parsed.data)) return null;
    if (typeof parsed.savedAt !== "number") return null;
    if (typeof parsed.payloadHash !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
};

const safeWriteStorage = (key: string, payloadHash: string, data: ToolSummaryResponse) => {
  if (typeof window === "undefined") return;
  const record: SummaryCacheRecord = {
    savedAt: Date.now(),
    payloadHash,
    data,
  };
  try {
    window.localStorage.setItem(key, JSON.stringify(record));
  } catch {
    // ignore storage quota and security errors
  }
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderInlineMarkdown = (value: string) => {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  output = output.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  return output;
};

const renderMarkdownToHtml = (markdown: string) => {
  const lines = markdown.split(/\r?\n/);
  const blocks: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (list.length === 0) return;
    const listItems = list.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("");
    blocks.push(`<ul>${listItems}</ul>`);
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    const listMatch = /^[-*]\s+(.+)$/.exec(trimmed);
    if (listMatch) {
      flushParagraph();
      list.push(listMatch[1]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return blocks.join("");
};

const MarkdownBlock = ({ value }: { value: string }) => (
  <div
    className="ai-summary-markdown text-sm text-slate-700 [&_a]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:mb-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-4"
    dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(value) }}
  />
);

const isAbortError = (value: unknown) =>
  value instanceof DOMException && value.name === "AbortError";

export default function AISummaryPanel({
  locale,
  toolId,
  toolName,
  inputs,
  outputs,
}: AISummaryPanelProps) {
  const labels = LABELS[locale];
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<PanelState>("idle");
  const [summary, setSummary] = useState<ToolSummaryResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFallbackNotice, setShowFallbackNotice] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);
  const loadedHashRef = useRef<string | null>(null);
  const inFlightHashRef = useRef<string | null>(null);

  const requestPayload = useMemo(
    () => ({
      locale,
      toolId,
      toolName,
      inputs,
      outputs,
    }),
    [inputs, locale, outputs, toolId, toolName],
  );

  const requestBody = useMemo(() => JSON.stringify(requestPayload), [requestPayload]);
  const payloadHash = useMemo(() => stableHash(requestPayload), [requestPayload]);
  const storageKey = `${STORAGE_PREFIX}${payloadHash}`;

  useEffect(() => {
    if (!open) return;
    if (loadedHashRef.current === payloadHash) return;
    if (inFlightHashRef.current === payloadHash) return;

    const abortController = new AbortController();
    let isMounted = true;

    const loadSummary = async () => {
      inFlightHashRef.current = payloadHash;
      setState("loading");
      setErrorMessage("");
      setShowFallbackNotice(false);

      const cached = safeReadStorage(storageKey);
      if (cached && cached.payloadHash === payloadHash && isToolSummaryResponse(cached.data)) {
        if (!isMounted) return;
        loadedHashRef.current = payloadHash;
        inFlightHashRef.current = null;
        setSummary(cached.data);
        setState("ready");
        return;
      }

      try {
        const response = await fetch("/api/ai/tool-summary", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: requestBody,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`http_${response.status}`);
        }

        const payload = (await response.json()) as SummaryApiResponse;
        const data = isObject(payload) && "data" in payload ? payload.data : null;

        if (!isToolSummaryResponse(data)) {
          throw new Error("invalid_summary_response");
        }

        if (!isMounted) return;
        loadedHashRef.current = payloadHash;
        inFlightHashRef.current = null;
        setSummary(data);
        setState("ready");
        setShowFallbackNotice(Boolean(isObject(payload) && "fallback" in payload && payload.fallback));
        safeWriteStorage(storageKey, payloadHash, data);
      } catch (error) {
        if (!isMounted || isAbortError(error)) return;
        inFlightHashRef.current = null;
        setState("error");
        setErrorMessage(labels.error);
      }
    };

    void loadSummary();

    return () => {
      isMounted = false;
      if (inFlightHashRef.current === payloadHash) {
        inFlightHashRef.current = null;
      }
      abortController.abort();
    };
  }, [labels.error, open, payloadHash, requestBody, retryNonce, storageKey]);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const retry = () => {
    loadedHashRef.current = null;
    inFlightHashRef.current = null;
    setState("idle");
    setSummary(null);
    setErrorMessage("");
    setRetryNonce((prev) => prev + 1);
  };

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button
          type="button"
          onClick={toggleOpen}
          className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 hover:border-sky-300 hover:bg-sky-100"
        >
          {open ? labels.closeButton : labels.titleButton}
        </button>
        <AIDeterministicDisclaimer locale={locale} compact className="max-w-xl" />
      </div>

      {open ? (
        <div className="mt-4 space-y-4">
          {state === "loading" ? (
            <p className="text-xs text-slate-500">{labels.loading}</p>
          ) : null}

          {state === "error" ? (
            <div className="space-y-2 rounded-xl border border-rose-200 bg-rose-50 p-3">
              <p className="text-xs text-rose-700">{errorMessage || labels.error}</p>
              <button
                type="button"
                onClick={retry}
                className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
              >
                {labels.retry}
              </button>
            </div>
          ) : null}

          {state === "ready" && summary ? (
            <div className="space-y-4">
              {showFallbackNotice ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  {labels.fallback}
                </div>
              ) : null}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <MarkdownBlock value={summary.summaryMd} />
              </div>

              <SummaryList title={labels.assumptions} items={summary.assumptions} tone="slate" />
              <SummaryList title={labels.warnings} items={summary.warnings} tone="amber" />
              <SummaryList title={labels.nextSteps} items={summary.nextSteps} tone="sky" />

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  {labels.disclaimer}
                </p>
                <MarkdownBlock value={summary.disclaimerMd} />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function SummaryList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "slate" | "amber" | "sky";
}) {
  if (items.length === 0) return null;

  const styleMap = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    sky: "border-sky-200 bg-sky-50 text-sky-800",
  } as const;

  return (
    <div className={`rounded-xl border p-3 ${styleMap[tone]}`}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide">{title}</p>
      <ul className="list-inside list-disc space-y-1 text-xs">
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
