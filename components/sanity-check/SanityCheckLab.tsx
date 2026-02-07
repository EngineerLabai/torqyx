"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import { evaluateFormula } from "@/lib/sanityCheck/engine";
import type { LabSession } from "@/lib/sanityCheck/types";
import { decodeSession, encodeSession } from "@/lib/sanityCheck/share";
import {
  deleteSavedSession,
  readLastSession,
  readSavedSessions,
  saveSession,
  writeLastSession,
  type SavedSession,
} from "@/lib/sanityCheck/storage";
import VariableTable from "@/components/sanity-check/VariableTable";
import FormulaEditor from "@/components/sanity-check/FormulaEditor";
import ResultPanel from "@/components/sanity-check/ResultPanel";
import SweepPanel from "@/components/sanity-check/SweepPanel";
import MonteCarloPanel from "@/components/sanity-check/MonteCarloPanel";
import ClientErrorBoundary from "@/components/sanity-check/ClientErrorBoundary";
import ToolFavoriteButton from "@/components/tools/ToolFavoriteButtonLazy";
import { addRecent } from "@/utils/tool-storage";
import { withLocalePrefix } from "@/utils/locale-path";

const UNIT_OPTIONS = [
  "",
  "N",
  "kN",
  "N m",
  "Pa",
  "kPa",
  "MPa",
  "bar",
  "m",
  "mm",
  "cm",
  "kg",
  "s",
  "rad/s",
  "rpm",
  "W",
  "kW",
  "J",
  "Hz",
];

const buildDefaultSession = (locale: "tr" | "en"): LabSession => ({
  title: "",
  variables: [
    {
      id: "var-t",
      symbol: "T",
      name: locale === "tr" ? "Tork" : "Torque",
      description: locale === "tr" ? "Giriş torku" : "Input torque",
      value: 12,
      unit: "N m",
      min: 10,
      max: 14,
      distribution: "normal",
    },
    {
      id: "var-w",
      symbol: "w",
      name: locale === "tr" ? "Açısal hız" : "Angular speed",
      description: locale === "tr" ? "Açısal hız" : "Angular speed",
      value: 120,
      unit: "rad/s",
      min: 80,
      max: 150,
      distribution: "normal",
    },
  ],
  formula: "P = T * w",
  expectedUnit: "W",
  sweep: {
    variableId: "var-t",
    points: 50,
  },
  monteCarlo: {
    iterations: 1000,
  },
});

type TabKey = "sweep" | "monteCarlo";

export default function SanityCheckLab() {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const pageCopy = messages.pages.sanityCheck;
  const copy = messages.components.sanityCheck;
  const searchParams = useSearchParams();

  const defaultSession = useMemo(() => buildDefaultSession(locale), [locale]);
  const [session, setSession] = useState<LabSession>(() => defaultSession);
  const [activeTab, setActiveTab] = useState<TabKey>("sweep");
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const initialLoadRef = useRef(false);

  const result = useMemo(() => evaluateFormula(session), [session]);

  useEffect(() => {
    addRecent("sanity-check");
  }, []);

  const handleSessionTitle = (value: string) => setSession((prev) => ({ ...prev, title: value }));

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    const shared = searchParams?.get("session");
    if (shared) {
      const decoded = decodeSession(shared);
      if (decoded) {
        Promise.resolve().then(() => {
          setSession(decoded);
          setStatusMessage(copy.session.restoreNotice);
        });
      }
    } else {
      const last = readLastSession();
      if (last) {
        Promise.resolve().then(() => setSession(last));
      }
    }

    const nextSaved = readSavedSessions();
    Promise.resolve().then(() => setSavedSessions(nextSaved));
  }, [copy.session.restoreNotice, searchParams]);

  useEffect(() => {
    const id = window.setTimeout(() => writeLastSession(session), 300);
    return () => window.clearTimeout(id);
  }, [session]);

  const handleSave = (forceNew: boolean) => {
    const title = session.title?.trim() || copy.session.untitled;
    const entry = saveSession(session, title, forceNew ? undefined : selectedSessionId || undefined);
    setSavedSessions(readSavedSessions());
    setSelectedSessionId(entry.id);
    setStatusMessage(`${copy.session.lastSaved}: ${entry.updatedAt}`);
  };

  const handleLoad = () => {
    const selected = savedSessions.find((item) => item.id === selectedSessionId);
    if (!selected) return;
    setSession(selected.session);
    setStatusMessage(`${copy.session.lastSaved}: ${selected.updatedAt}`);
  };

  const handleDelete = () => {
    if (!selectedSessionId) return;
    const next = deleteSavedSession(selectedSessionId);
    setSavedSessions(next);
    setSelectedSessionId("");
  };

  const handleShare = async () => {
    const encoded = encodeSession(session);
    if (!encoded) return;
    const sharePath = withLocalePrefix("/tools/sanity-check", locale);
    const url = `${window.location.origin}${sharePath}?session=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setStatusMessage(copy.session.shareCopied);
    } catch {
      setStatusMessage(copy.session.shareFailed);
    }
  };

  const handleExport = () => {
    const encoded = encodeSession(session);
    if (!encoded) return;
    const reportPath = withLocalePrefix("/tools/sanity-check/report", locale);
    window.open(`${reportPath}?session=${encoded}`, "_blank");
  };

  const errorFallback = (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-slate-900">
      <h2 className="text-lg font-semibold">{copy.errorBoundary.title}</h2>
      <p className="mt-2 text-sm text-slate-700">{copy.errorBoundary.description}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
      >
        {copy.errorBoundary.cta}
      </button>
    </div>
  );

  return (
    <ClientErrorBoundary fallback={errorFallback}>
      <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {pageCopy.badge}
            </div>
            <h1 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{pageCopy.title}</h1>
            <p className="text-sm text-slate-600">{pageCopy.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {copy.session.titleLabel}
            </div>
            <input
              value={session.title ?? ""}
              onChange={(event) => handleSessionTitle(event.target.value)}
              className="rounded-full border border-slate-200 px-3 py-1 text-[11px]"
              placeholder={copy.session.titleLabel}
              aria-label={copy.session.titleLabel}
            />
            <ToolFavoriteButton toolId="sanity-check" toolTitle={pageCopy.title} size="sm" />
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white"
            >
              {copy.session.save}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700"
            >
              {copy.session.saveAs}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700"
            >
              {copy.session.share}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700"
            >
              {copy.session.export}
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-600">
            {copy.session.savedTitle}
          </span>
          <select
            value={selectedSessionId}
            onChange={(event) => setSelectedSessionId(event.target.value)}
            className="rounded-full border border-slate-200 px-3 py-1 text-[11px]"
          >
            <option value="">{copy.session.savedTitle}</option>
            {savedSessions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleLoad}
            className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600"
          >
            {copy.session.load}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600"
          >
            {copy.session.delete}
          </button>
          {statusMessage ? <span className="text-[11px] text-slate-500">{statusMessage}</span> : null}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-900">{pageCopy.howToTitle}</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {pageCopy.howToSteps.map((step: string, index: number) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  {index + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <VariableTable
            variables={session.variables}
            onChange={(variables) => setSession((prev) => ({ ...prev, variables }))}
            copy={copy.variableTable}
          />
          <FormulaEditor
            formula={session.formula}
            onChange={(formula) => setSession((prev) => ({ ...prev, formula }))}
            copy={copy.formulaEditor}
          />
        </div>

        <div className="space-y-4">
          <ResultPanel
            result={result}
            expectedUnit={session.expectedUnit ?? ""}
            onExpectedUnitChange={(value) => setSession((prev) => ({ ...prev, expectedUnit: value }))}
            copy={copy.resultPanel}
            locale={locale}
          />

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="sticky top-2 z-10 flex gap-2 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
              <button
                type="button"
                onClick={() => setActiveTab("sweep")}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  activeTab === "sweep"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 text-slate-600"
                }`}
              >
                {pageCopy.tabs.sweep}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("monteCarlo")}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  activeTab === "monteCarlo"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 text-slate-600"
                }`}
              >
                {pageCopy.tabs.monteCarlo}
              </button>
            </div>
            <div className="p-4">
              {activeTab === "sweep" ? (
                <SweepPanel
                  session={session}
                  onSessionChange={setSession}
                  copy={copy.sweepPanel}
                />
              ) : (
                <MonteCarloPanel
                  session={session}
                  onSessionChange={setSession}
                  copy={copy.monteCarloPanel}
                  locale={locale}
                />
              )}
            </div>
          </section>
        </div>
      </div>

        <datalist id="sanity-units">
          {UNIT_OPTIONS.filter(Boolean).map((unit) => (
            <option key={unit} value={unit} />
          ))}
        </datalist>
      </div>
    </ClientErrorBoundary>
  );
}
