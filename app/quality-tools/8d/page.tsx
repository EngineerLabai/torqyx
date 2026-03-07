"use client";

// app/quality-tools/8d/page.tsx
import { useState, useCallback, useRef } from "react";
import PageShell from "@/components/layout/PageShell";
import ReportActions from "@/components/report/ReportActions";
import { QualityToolStatusBadge } from "@/components/quality-tools/QualityToolStatusBadge";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getQualityToolById } from "@/data/quality-tools/registry";
import { assertNoTurkish } from "@/utils/i18n-assert";
import { eightDCopy } from "@/data/quality-tools/8d";
import { qualityReportActionsCopy } from "@/data/quality-tools/report-actions";
import { useAutosaveDraft } from "@/hooks/useAutosaveDraft";

type StepId =
  | "d0"
  | "d1"
  | "d2"
  | "d3"
  | "d4"
  | "d5"
  | "d6"
  | "d7"
  | "d8"
  | "risks"
  | "metrics"
  | "signoff";

type Step = {
  id: StepId;
  title: string;
  subtitle?: string;
  guidance: string[];
  placeholder: string;
};

type FormState = {
  caseId: string;
  customer: string;
  product: string;
  lot: string;
  owner: string;
  team: string;
  startDate: string;
  targetDate: string;
} & Record<StepId, string>;

const INITIAL_FORM: FormState = {
  caseId: "",
  customer: "",
  product: "",
  lot: "",
  owner: "",
  team: "",
  startDate: "",
  targetDate: "",
  d0: "",
  d1: "",
  d2: "",
  d3: "",
  d4: "",
  d5: "",
  d6: "",
  d7: "",
  d8: "",
  risks: "",
  metrics: "",
  signoff: "",
};

type EightDSnapshot = {
  form: FormState;
};

const DRAFT_KEY = "aielab:quality:8d:draft";

const DEMO_FORM: FormState = {
  caseId: "Q-2026-024",
  customer: "OEM North Plant",
  product: "ABC123 Bracket Rev.07",
  lot: "26A-04",
  owner: "E. Sahin / Quality",
  team: "Quality, Production, Process, Maintenance, Supplier Quality",
  startDate: "02/16/2026",
  targetDate: "02/28/2026",
  d0: "Shipment hold applied for lot 26A-04, 100% sort started in warehouse and customer site.",
  d1: "Cross-functional team formed with daily 20-minute stand-up and one decision owner.",
  d2: "Customer detected oversized hole issue at incoming inspection; 420 parts affected.",
  d3: "Containment: inline gauge added, outgoing final check tightened to 100% for 5 days.",
  d4: "Root cause: drill wear threshold too high and PFMEA not updated after tolerance revision.",
  d5: "Permanent action: lower tool life limit, add automatic counter stop, update control plan.",
  d6: "Verification: 3 pilot lots passed, Cpk improved to 1.41, customer confirmed zero repeat.",
  d7: "Spread action deployed to similar operations OP35 and OP42 with updated PFMEA revisions.",
  d8: "Closure approved by quality manager and customer SQE; lessons shared in weekly review.",
  risks: "Possible supplier delay on spare counter modules; interim stock secured for 3 weeks.",
  metrics: "PPM from 34,000 to < 500 target, response SLA within 48h for containment.",
  signoff: "Customer SQE sign-off on 02/27/2026, internal QA and Production signatures completed.",
};

export default function EightDPage() {
  const { locale } = useLocale();
  const copy = eightDCopy[locale];
  const toolStatus = getQualityToolById("8d", locale)?.status ?? "beta";
  const actionsCopy = qualityReportActionsCopy[locale];
  assertNoTurkish(locale, copy, "quality-tools/8d");

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const reportRootRef = useRef<HTMLElement | null>(null);
  const steps = copy.steps as Step[];

  const restoreDraft = useCallback((draft: EightDSnapshot) => {
    setForm(normalizeEightDForm(draft?.form));
  }, []);

  const { clearDraft } = useAutosaveDraft<EightDSnapshot>({
    storageKey: DRAFT_KEY,
    value: { form },
    onRestore: restoreDraft,
  });

  function handleFieldChange(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    clearDraft();
  }

  function handleDemoFill() {
    setForm(DEMO_FORM);
  }

  function handleLoadData(snapshot: EightDSnapshot) {
    setForm(normalizeEightDForm(snapshot?.form));
  }

  return (
    <PageShell>
      <ReportActions
        toolKey="8d"
        currentData={{ form }}
        onLoadData={handleLoadData}
        onDemoFill={handleDemoFill}
        onReset={handleReset}
        reportRootRef={reportRootRef}
        copy={actionsCopy}
      />

      <section id="report-root" ref={reportRootRef} className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {copy.badges.report}
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            {copy.badges.level}
          </span>
          <QualityToolStatusBadge locale={locale} status={toolStatus} className="px-3 py-1 text-[10px] font-medium" />
        </div>
        <h1 className="text-lg font-semibold text-slate-900">{copy.title}</h1>
        <p className="mt-2 text-xs text-slate-600">{copy.description}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">{copy.caseTitle}</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label={copy.fields.caseId.label}
            value={form.caseId}
            onChange={(value) => handleFieldChange("caseId", value)}
            placeholder={copy.fields.caseId.placeholder}
          />
          <Field
            label={copy.fields.customer.label}
            value={form.customer}
            onChange={(value) => handleFieldChange("customer", value)}
            placeholder={copy.fields.customer.placeholder}
          />
          <Field
            label={copy.fields.product.label}
            value={form.product}
            onChange={(value) => handleFieldChange("product", value)}
            placeholder={copy.fields.product.placeholder}
          />
          <Field
            label={copy.fields.lot.label}
            value={form.lot}
            onChange={(value) => handleFieldChange("lot", value)}
            placeholder={copy.fields.lot.placeholder}
          />
          <Field
            label={copy.fields.owner.label}
            value={form.owner}
            onChange={(value) => handleFieldChange("owner", value)}
            placeholder={copy.fields.owner.placeholder}
          />
          <Field
            label={copy.fields.team.label}
            value={form.team}
            onChange={(value) => handleFieldChange("team", value)}
            placeholder={copy.fields.team.placeholder}
          />
          <Field
            label={copy.fields.startDate.label}
            value={form.startDate}
            onChange={(value) => handleFieldChange("startDate", value)}
            placeholder={copy.fields.startDate.placeholder}
          />
          <Field
            label={copy.fields.targetDate.label}
            value={form.targetDate}
            onChange={(value) => handleFieldChange("targetDate", value)}
            placeholder={copy.fields.targetDate.placeholder}
          />
        </div>
        </section>

        <section className="space-y-4">
        {steps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            value={form[step.id]}
            onChange={(value) => handleFieldChange(step.id, value)}
            guidanceTitle={copy.guidanceTitle}
          />
        ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{copy.checklist.title}</h3>
            <p className="text-[11px] text-slate-600">{copy.checklist.description}</p>
          </div>
          <button
            onClick={handleReset}
            className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
          >
            {copy.checklist.reset}
          </button>
        </div>
        <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
          {copy.checklist.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        </section>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        placeholder={placeholder}
       aria-label={placeholder}/>
    </label>
  );
}

function StepCard({
  step,
  value,
  onChange,
  guidanceTitle,
}: {
  step: Step;
  value: string;
  onChange: (value: string) => void;
  guidanceTitle: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {step.title}
            </span>
            {step.subtitle && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                {step.subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={5}
            placeholder={step.placeholder}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
           aria-label={step.placeholder}/>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="mb-2 text-[11px] font-semibold text-slate-800">{guidanceTitle}</p>
          <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
            {step.guidance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function normalizeEightDForm(source: unknown): FormState {
  if (!source || typeof source !== "object") {
    return INITIAL_FORM;
  }

  const candidate = source as Partial<FormState>;
  const next: FormState = { ...INITIAL_FORM };

  (Object.keys(INITIAL_FORM) as (keyof FormState)[]).forEach((key) => {
    const value = candidate[key];
    next[key] = typeof value === "string" ? value : INITIAL_FORM[key];
  });

  return next;
}
