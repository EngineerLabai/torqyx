"use client";

import { useEffect, useRef, useState } from "react";
import { useBillingStatus } from "@/hooks/useBillingStatus";
import type { Locale } from "@/utils/locale";

const STORAGE_PREFIX = "torqyx:ai_explain_history:";
const USAGE_PREFIX = "torqyx:ai_explain_usage:";

const LABELS = {
  tr: {
    title: "Bu sonucu açıkla",
    badgePremium: "Premium",
    badgeFree: "Ücretsiz 3/gün",
    firstFree: "İlk açıklama ücretsiz.",
    start: "Açıklamayı Başlat",
    asking: "Yanıt hazırlanıyor...",
    askMore: "Daha fazla sor",
    placeholder: "Bu sonucun ne anlama geldiğini sor...",
    noExplanation: "Henüz açıklama yok.",
    reset: "Sohbeti Sıfırla",
    feedback: "Açıklama faydalı mıydı?",
    feedbackUp: "Faydalı olarak işaretle",
    feedbackDown: "Faydalı değil olarak işaretle",
    thanks: "Geri bildiriminiz için teşekkürler.",
    error: "Açıklama şu anda alınamıyor.",
    premiumNote: "Premium kullanıcılar için sınırsız açıklama.",
    freeNote: "Ücretsiz kullanıcılar için günde üç açıklama limiti.",
  },
  en: {
    title: "Explain this result",
    badgePremium: "Premium",
    badgeFree: "Free 3/day",
    firstFree: "First explanation is free.",
    start: "Start explanation",
    asking: "Preparing answer...",
    askMore: "Ask a follow-up",
    placeholder: "Ask what this result means...",
    noExplanation: "No explanation yet.",
    reset: "Reset conversation",
    feedback: "Was this explanation helpful?",
    feedbackUp: "Mark explanation as helpful",
    feedbackDown: "Mark explanation as not helpful",
    thanks: "Thanks for your feedback.",
    error: "Explanation could not be loaded.",
    premiumNote: "Unlimited explanations for premium users.",
    freeNote: "Free users are limited to three explanations per day.",
  },
} as const;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderMarkdownToHtml = (markdown: string) => {
  const lines = markdown.split(/\r?\n/);
  const blocks: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${paragraph.join(" ")}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(`<ul>${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`);
    listItems = [];
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
      blocks.push(`<h${level}>${escapeHtml(headingMatch[2])}</h${level}>`);
      continue;
    }

    const listMatch = /^[-*]\s+(.+)$/.exec(trimmed);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1]);
      continue;
    }

    paragraph.push(escapeHtml(trimmed));
  }

  flushParagraph();
  flushList();

  return blocks.join("");
};

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type ExplainResultPanelProps = {
  locale: Locale;
  toolId: string;
  toolName: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  auditTrail?: unknown;
};

const getStorageKey = (toolId: string) => `${STORAGE_PREFIX}${toolId}`;
const getUsageKey = (toolId: string) => {
  const today = new Date().toISOString().slice(0, 10);
  return `${USAGE_PREFIX}${toolId}:${today}`;
};

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const safeWriteJson = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

export default function ExplainResultPanel({ locale, toolId, toolName, inputs, outputs, auditTrail }: ExplainResultPanelProps) {
  const labels = LABELS[locale];
  const { status } = useBillingStatus();
  const [history, setHistory] = useState<ConversationMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  const isPremium = status.effectivePlan === "pro" || status.trial.isActive;
  const hasFreeQuota = isPremium || usageCount < 3;
  const isFirstUse = !isPremium && usageCount === 0;

  useEffect(() => {
    setHistory(safeReadJson<ConversationMessage[]>(getStorageKey(toolId), []));
    setUsageCount(safeReadJson<number>(getUsageKey(toolId), 0));
  }, [toolId]);

  useEffect(() => {
    safeWriteJson(getStorageKey(toolId), history);
  }, [history, toolId]);

  useEffect(() => {
    safeWriteJson(getUsageKey(toolId), usageCount);
  }, [usageCount, toolId]);

  const displayBadge = isPremium ? labels.badgePremium : labels.badgeFree;
  const badgeTitle = isPremium ? labels.premiumNote : labels.freeNote;

  const streamExplanation = async (overrideQuestion?: string) => {
    if (!hasFreeQuota) {
      setError(labels.error);
      return;
    }

    const questionText = overrideQuestion ?? labels.askMore;
    const userMessage: ConversationMessage = { role: "user", content: questionText };
    const nextHistory = [...history, userMessage];
    setHistory(nextHistory);
    setResponseText("");
    setError(null);
    setIsLoading(true);

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch("/api/ai/explain-result", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          locale,
          toolId,
          toolName,
          inputs,
          outputs,
          auditTrail,
          history: nextHistory,
          question: questionText,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message ?? labels.error;
        throw new Error(message);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error(labels.error);
      }

      const decoder = new TextDecoder();
      let accumulator = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulator += decoder.decode(value, { stream: true });
        setResponseText(accumulator);
      }

      if (!isPremium) {
        setUsageCount((current) => Math.min(3, current + 1));
      }

      setHistory((current) => [...current, { role: "assistant", content: accumulator }]);
    } catch (error_) {
      if ((error_ as Error).name === "AbortError") {
        return;
      }
      setError((error_ as Error).message || labels.error);
    } finally {
      setIsLoading(false);
      controllerRef.current = null;
    }
  };

  const startExplanation = () => {
    const initialQuestion = locale === "tr"
      ? "Bu hesaplamanın hangi değerler tarafından yönetildiğini, marjını ve mühendislikte ne anlama geldiğini açıkla."
      : "Explain which values drive this calculation result, whether the margin is safe or tight, and what it means in engineering practice.";
    void streamExplanation(initialQuestion);
  };

  const handleFeedback = async (type: "up" | "down") => {
    setFeedback(type);
    
    try {
      await fetch("/api/ai/explain-feedback", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          toolId,
          feedbackType: type,
          question: history.find((msg) => msg.role === "user")?.content,
          response: explanationContent,
        }),
      });
    } catch {
      // silently fail; feedback is best-effort
    }
  };

  const resetConversation = () => {
    setHistory([]);
    setResponseText("");
    setError(null);
    setFeedback(null);
  };

  const handleFollowUp = () => {
    if (question.trim()) {
      void streamExplanation(question);
      setQuestion("");
    }
  };

  const explanationContent = responseText || (history.find((item) => item.role === "assistant")?.content ?? "");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{labels.title}</h2>
          <p className="text-xs text-slate-500">{badgeTitle}</p>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {displayBadge}
        </span>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={startExplanation}
          disabled={isLoading || (!hasFreeQuota && !isPremium)}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? labels.asking : labels.start}
        </button>

        {!isPremium ? (
          <p className="text-xs text-slate-500">
            {isFirstUse ? labels.firstFree : `${labels.freeNote} ${3 - usageCount} kaldı.`}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="explain-followup">
            {labels.askMore}
          </label>
          <input
            id="explain-followup"
            aria-label={labels.askMore}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={labels.placeholder}
            className="min-w-0 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          <button
            type="button"
            onClick={handleFollowUp}
            disabled={isLoading || !question.trim() || (!hasFreeQuota && !isPremium)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {labels.askMore}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {error ? (
            <p className="text-rose-600">{labels.error}</p>
          ) : explanationContent ? (
            <div
              className="prose prose-slate max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(explanationContent) }}
            />
          ) : (
            <p className="text-slate-500">{labels.noExplanation}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-500">{labels.feedback}</span>
          <button
            type="button"
            aria-label={labels.feedbackUp}
            onClick={() => handleFeedback("up")}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${feedback === "up" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}
          >
            👍
          </button>
          <button
            type="button"
            aria-label={labels.feedbackDown}
            onClick={() => handleFeedback("down")}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${feedback === "down" ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700"}`}
          >
            👎
          </button>
          <button
            type="button"
            onClick={resetConversation}
            className="ml-auto rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {labels.reset}
          </button>
        </div>

        {feedback ? <p className="text-xs text-slate-500">{labels.thanks}</p> : null}
      </div>
    </section>
  );
}
