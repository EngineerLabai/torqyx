// app/quality-tools/5why/page.tsx
"use client";

import { useState, ChangeEvent } from "react";
import PageShell from "@/components/layout/PageShell";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatMessage } from "@/utils/messages";
import { assertNoTurkish } from "@/utils/i18n-assert";
import { fiveWhyCopy } from "@/data/quality-tools/5why";

type WhyStep = {
  why: string;
  actionHint: string;
};

type FiveWhyForm = {
  problem: string;
  steps: WhyStep[];
};

const INITIAL_FORM: FiveWhyForm = {
  problem: "",
  steps: [
    { why: "", actionHint: "" },
    { why: "", actionHint: "" },
    { why: "", actionHint: "" },
    { why: "", actionHint: "" },
    { why: "", actionHint: "" },
  ],
};

export default function FiveWhyPage() {
  const { locale } = useLocale();
  const copy = fiveWhyCopy[locale];
  assertNoTurkish(locale, copy, "quality-tools/5why");

  const [form, setForm] = useState<FiveWhyForm>(INITIAL_FORM);

  function handleProblemChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, problem: e.target.value }));
  }

  function handleWhyChange(
    index: number,
    key: keyof WhyStep,
    e: ChangeEvent<HTMLTextAreaElement>,
  ) {
    const value = e.target.value;
    setForm((prev) => {
      const steps = [...prev.steps];
      steps[index] = { ...steps[index], [key]: value };
      return { ...prev, steps };
    });
  }

  function handleReset() {
    setForm(INITIAL_FORM);
  }

  const rootCause = getRootCause(form);
  const classification = classifyRootCause(rootCause);
  const isEmpty =
    !form.problem.trim() &&
    form.steps.every((step) => !step.why.trim() && !step.actionHint.trim());

  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {copy.badge}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
            {copy.badgeSub}
          </span>
        </div>

        <h1 className="text-lg font-semibold text-slate-900">{copy.title}</h1>
        <p className="mt-2 text-xs text-slate-600">{copy.description}</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">{copy.formTitle}</h2>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-slate-300 px-3 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
            >
              {copy.reset}
            </button>
          </div>

          <div className="mb-4 space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">{copy.problemLabel}</label>
            <textarea
              rows={3}
              value={form.problem}
              onChange={handleProblemChange}
              className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              placeholder={copy.problemPlaceholder}
            />
          </div>

          <div className="space-y-3">
            {form.steps.map((step, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <p className="mb-2 text-[11px] font-semibold text-slate-800">
                  {formatMessage(copy.stepTitle, { index: index + 1 })}
                </p>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    {formatMessage(copy.stepLabel, { index: index + 1 })}
                  </label>
                  <textarea
                    rows={2}
                    value={step.why}
                    onChange={(e) => handleWhyChange(index, "why", e)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder={index === 0 ? copy.stepPlaceholderFirst : copy.stepPlaceholderNext}
                  />
                </div>

                <div className="mt-2 space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">{copy.actionLabel}</label>
                  <textarea
                    rows={2}
                    value={step.actionHint}
                    onChange={(e) => handleWhyChange(index, "actionHint", e)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder={copy.actionPlaceholder}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-slate-500">{copy.note}</p>
        </div>

        <FiveWhySummary
          form={form}
          isEmpty={isEmpty}
          rootCause={rootCause}
          classification={classification}
          copy={copy}
        />
      </section>
    </PageShell>
  );
}

type Classification = "process" | "design" | "human" | "material" | "other";

type SummaryProps = {
  form: FiveWhyForm;
  isEmpty: boolean;
  rootCause: string | null;
  classification: Classification;
  copy: typeof fiveWhyCopy.tr;
};

function FiveWhySummary({ form, isEmpty, rootCause, classification, copy }: SummaryProps) {
  if (isEmpty) {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">{copy.summary.title}</h2>
        <p className="text-[11px] text-slate-500">{copy.summary.empty}</p>
      </aside>
    );
  }

  const badge = buildClassificationBadge(classification, copy.classification);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-slate-900">{copy.summary.title}</h2>

      {badge}

      <div className="mt-3 space-y-2 text-[11px] text-slate-700">
        {form.problem.trim() && (
          <div>
            <p className="font-semibold text-slate-900">{copy.summary.problemLabel}</p>
            <p>{form.problem.trim()}</p>
          </div>
        )}

        <div>
          <p className="mb-1 font-semibold text-slate-900">{copy.summary.chainTitle}</p>
          <ol className="list-inside list-decimal space-y-1">
            {form.steps
              .map((step) => step.why.trim())
              .filter((value) => value.length > 0)
              .map((value, idx) => (
                <li key={idx}>{value}</li>
              ))}
          </ol>
        </div>

        {rootCause && (
          <div className="mt-2 rounded-lg bg-slate-50 p-3">
            <p className="mb-1 font-semibold text-slate-900">{copy.summary.rootCauseTitle}</p>
            <p className="text-slate-800">{rootCause}</p>
          </div>
        )}

        {form.steps.some((step) => step.actionHint.trim()) && (
          <div className="mt-2">
            <p className="mb-1 font-semibold text-slate-900">{copy.summary.actionsTitle}</p>
            <ul className="list-inside list-disc space-y-1">
              {form.steps
                .map((step) => step.actionHint.trim())
                .filter((value) => value.length > 0)
                .map((value, idx) => (
                  <li key={idx}>{value}</li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <hr className="my-3 border-slate-200" />

      <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-600">
        {copy.tips.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

function getRootCause(form: FiveWhyForm): string | null {
  for (let index = form.steps.length - 1; index >= 0; index -= 1) {
    const value = form.steps[index].why.trim();
    if (value.length > 0) return value;
  }
  return null;
}

function classifyRootCause(text: string | null): Classification {
  if (!text) return "other";
  const t = text.toLowerCase();

  const includesAny = (keywords: string[]) => keywords.some((keyword) => t.includes(keyword));

  if (
    includesAny([
      "operatör",
      "operator",
      "insan",
      "human",
      "eğitim",
      "training",
      "dikkat",
      "attention",
      "awareness",
      "fatigue",
      "mistake",
      "error",
    ])
  ) {
    return "human";
  }

  if (
    includesAny([
      "proses",
      "process",
      "iş akışı",
      "workflow",
      "talimat",
      "instruction",
      "standart",
      "standard",
      "procedure",
      "kontrol planı",
      "control plan",
      "work instruction",
    ])
  ) {
    return "process";
  }

  if (
    includesAny([
      "tasarım",
      "design",
      "tolerans",
      "tolerance",
      "geometri",
      "geometry",
      "konumlandırma",
      "positioning",
      "fikstür",
      "fixture",
      "jig",
    ])
  ) {
    return "design";
  }

  if (
    includesAny([
      "malzeme",
      "material",
      "sertlik",
      "hardness",
      "kaplama",
      "coating",
      "çelik",
      "steel",
      "alüminyum",
      "aluminum",
      "ısıl işlem",
      "heat treatment",
    ])
  ) {
    return "material";
  }

  return "other";
}

function buildClassificationBadge(
  classification: Classification,
  copy: typeof fiveWhyCopy.tr.classification,
) {
  switch (classification) {
    case "human":
      return (
        <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-800">
          {copy.human}
        </div>
      );
    case "process":
      return (
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-semibold text-sky-800">
          {copy.process}
        </div>
      );
    case "design":
      return (
        <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-semibold text-indigo-800">
          {copy.design}
        </div>
      );
    case "material":
      return (
        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-800">
          {copy.material}
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-medium text-slate-700">
          {copy.other}
        </div>
      );
  }
}
