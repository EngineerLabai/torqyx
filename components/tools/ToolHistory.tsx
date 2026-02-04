"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatMessage, getMessages } from "@/utils/messages";
import { trackEvent } from "@/utils/analytics";

export type StoredCalculation<TInput, TResult> = {
  id: string;
  toolId: string;
  toolTitle: string;
  createdAt: string;
  input: TInput;
  result: TResult;
};

type ToolHistoryProps<TInput, TResult> = {
  toolId: string;
  toolTitle: string;
  input: TInput;
  result: TResult;
};

const MAX_ENTRIES = 20;

const getStorageKey = (toolId: string) => `tool-history:${toolId}`;

const safeParse = <TInput, TResult>(value: string | null): StoredCalculation<TInput, TResult>[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as StoredCalculation<TInput, TResult>[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatDate = (value: string, locale: "tr" | "en") => {
  try {
    return new Date(value).toLocaleString(locale === "en" ? "en-US" : "tr-TR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
};

const hasError = (result: unknown) => {
  if (!result || typeof result !== "object") return false;
  return "error" in result && Boolean((result as { error?: string }).error);
};

export default function ToolHistory<TInput, TResult>({ toolId, toolTitle, input, result }: ToolHistoryProps<TInput, TResult>) {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.toolHistory;
  const [entries, setEntries] = useState<StoredCalculation<TInput, TResult>[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const storageKey = useMemo(() => getStorageKey(toolId), [toolId]);
  const resultHasError = hasError(result);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = safeParse<TInput, TResult>(localStorage.getItem(storageKey));
    Promise.resolve().then(() => {
      setEntries(stored);
      setIsLoaded(true);
    });
  }, [storageKey]);

  const persist = (next: StoredCalculation<TInput, TResult>[]) => {
    setEntries(next);
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setFeedback({ type: "error", text: copy.feedback.storeError });
    }
  };

  const handleSave = () => {
    const nextEntry: StoredCalculation<TInput, TResult> = {
      id: createId(),
      toolId,
      toolTitle,
      createdAt: new Date().toISOString(),
      input,
      result,
    };

    const next = [nextEntry, ...entries].slice(0, MAX_ENTRIES);
    try {
      persist(next);
      setFeedback({ type: "success", text: copy.feedback.saveSuccess });
      trackEvent("save_result", { tool_id: toolId, tool_title: toolTitle });
    } catch {
      setFeedback({ type: "error", text: copy.feedback.saveError });
    }
    window.setTimeout(() => setFeedback(null), 2000);
  };

  const handleClear = () => {
    try {
      persist([]);
      setFeedback({ type: "success", text: copy.feedback.clearSuccess });
    } catch {
      setFeedback({ type: "error", text: copy.feedback.clearError });
    }
    window.setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
        <p className="text-xs text-slate-500">
          {formatMessage(copy.description, { count: MAX_ENTRIES })}
        </p>
        <Link href="/saved-calculations" className="text-[11px] font-semibold text-slate-700 underline">
          {copy.viewAll}
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={resultHasError}
          className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {copy.save}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
        >
          {copy.clear}
        </button>
        {resultHasError ? (
          <span className="text-[11px] text-slate-500">{copy.errorNoResult}</span>
        ) : (
          <span className="text-[11px] text-slate-500">{copy.hintSave}</span>
        )}
        {feedback ? (
          <span
            className={
              feedback.type === "success"
                ? "text-[11px] text-emerald-600"
                : "text-[11px] text-red-600"
            }
          >
            {feedback.text}
          </span>
        ) : null}
      </div>

      {!isLoaded ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {copy.loading}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {copy.empty}
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <details key={entry.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <summary className="cursor-pointer text-xs font-semibold text-slate-700">
                {formatDate(entry.createdAt, locale)} - {entry.toolTitle}
              </summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-medium text-slate-500">{copy.inputs}</p>
                  <pre className="mt-1 max-h-48 overflow-auto text-[11px] text-slate-700">
                    {JSON.stringify(entry.input, null, 2)}
                  </pre>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-[11px] font-medium text-slate-500">{copy.outputs}</p>
                  <pre className="mt-1 max-h-48 overflow-auto text-[11px] text-slate-700">
                    {JSON.stringify(entry.result, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
