"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import type { Locale } from "@/utils/locale";
import { COMMISSIONING_COPY, COMMISSIONING_STEPS, type ChecklistItem } from "./copy";

type ChecklistState = Record<string, boolean>;

const STORAGE_KEY = "project-hub-commissioning-v2";

const makeItemKey = (stepId: string, item: ChecklistItem) => `${stepId}:${item.id}`;

const readStorage = (): ChecklistState => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export default function CommissioningClient({ locale, heroImage }: { locale: Locale; heroImage: string }) {
  const copy = COMMISSIONING_COPY[locale];
  const steps = COMMISSIONING_STEPS[locale];
  const [checked, setChecked] = useState<ChecklistState>(() => readStorage());
  const hasPersistedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasPersistedRef.current) {
      hasPersistedRef.current = true;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const allItems = useMemo(
    () =>
      steps.flatMap((step) =>
        step.items.map((item) => ({
          key: makeItemKey(step.id, item),
          item,
          stepId: step.id,
        })),
      ),
    [steps],
  );

  const completedCount = allItems.filter((entry) => checked[entry.key]).length;
  const totalCount = allItems.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const toggleItem = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const resetChecklist = () => {
    setChecked({});
  };

  return (
    <PageShell>
      <PageHero
        title={copy.hero.title}
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        imageSrc={heroImage}
        imageAlt={copy.hero.imageAlt}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.progressLabel}</p>
            <p className="mt-1 text-sm text-slate-600">
              {completedCount} / {totalCount} {copy.completedLabel}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetChecklist}
              className="rounded-full border border-slate-300 px-4 py-2 text-[11px] font-semibold text-slate-700 hover:border-slate-400"
            >
              {copy.resetLabel}
            </button>
            <button
              type="button"
              disabled
              className="rounded-full border border-amber-300 px-4 py-2 text-[11px] font-semibold text-amber-700 opacity-70"
            >
            {copy.exportLabel} - {copy.exportSoon}
            </button>
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-slate-500">{copy.storageNote}</p>
      </section>

      <section className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{copy.checklistTitle}</h2>
        </div>

        {steps.map((step) => {
          const stepItems = step.items.map((item) => ({
            item,
            key: makeItemKey(step.id, item),
          }));
          const stepDone = stepItems.filter((entry) => checked[entry.key]).length;
          return (
            <section key={step.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
                  {stepDone} / {stepItems.length}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {stepItems.map(({ item, key }) => (
                  <details key={key} className="group rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-slate-900">
                      <span className="flex items-center gap-2">
                        <span
                          className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                            checked[key] ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"
                          }`}
                        >
                          {checked[key] ? (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          ) : null}
                        </span>
                        {item.title}
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleItem(key);
                        }}
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                          checked[key]
                            ? "bg-emerald-600 text-white"
                            : "border border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        {checked[key] ? copy.completedLabel : copy.markDoneLabel}
                      </button>
                    </summary>
                    <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </PageShell>
  );
}
