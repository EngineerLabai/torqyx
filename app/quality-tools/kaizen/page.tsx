// app/quality-tools/kaizen/page.tsx
"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { assertNoTurkish } from "@/utils/i18n-assert";
import { kaizenCopy } from "@/data/quality-tools/kaizen";

type ActionStatus = "planned" | "inProgress" | "done";

type ActionRow = {
  id: string;
  task: string;
  owner: string;
  due: string;
  status: ActionStatus;
};

type KaizenForm = {
  title: string;
  area: string;
  problem: string;
  currentState: string;
  targetState: string;
  rootCause: string;
  metricsBefore: string;
  metricsAfter: string;
  gains: string;
  lessons: string;
  risks: string;
};

const INITIAL_FORM: KaizenForm = {
  title: "",
  area: "",
  problem: "",
  currentState: "",
  targetState: "",
  rootCause: "",
  metricsBefore: "",
  metricsAfter: "",
  gains: "",
  lessons: "",
  risks: "",
};

const STATUS_OPTIONS: ActionStatus[] = ["planned", "inProgress", "done"];

function uuid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function KaizenPage() {
  const { locale } = useLocale();
  const copy = kaizenCopy[locale];
  assertNoTurkish(locale, copy, "quality-tools/kaizen");

  const [form, setForm] = useState<KaizenForm>(INITIAL_FORM);
  const [actions, setActions] = useState<ActionRow[]>([
    {
      id: uuid(),
      task: "",
      owner: "",
      due: "",
      status: "planned",
    },
  ]);

  function handleFormChange(key: keyof KaizenForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleActionChange(id: string, key: keyof ActionRow, value: string) {
    setActions((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    );
  }

  function addAction() {
    setActions((prev) => [
      ...prev,
      { id: uuid(), task: "", owner: "", due: "", status: "planned" },
    ]);
  }

  function removeAction(id: string) {
    setActions((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setActions([{ id: uuid(), task: "", owner: "", due: "", status: "planned" }]);
  }

  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {copy.badges.title}
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-medium text-emerald-700">
            {copy.badges.beta}
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">{copy.title}</h1>
        <p className="mt-2 text-xs text-slate-600">{copy.description}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">{copy.basics.title}</h2>
          <button
            onClick={handleReset}
            className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
          >
            {copy.basics.reset}
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label={copy.basics.fields.title.label}
            value={form.title}
            onChange={(value) => handleFormChange("title", value)}
            placeholder={copy.basics.fields.title.placeholder}
          />
          <Field
            label={copy.basics.fields.area.label}
            value={form.area}
            onChange={(value) => handleFormChange("area", value)}
            placeholder={copy.basics.fields.area.placeholder}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{copy.problem.title}</h3>
          <div className="space-y-3">
            <TextArea
              label={copy.problem.fields.problem.label}
              value={form.problem}
              onChange={(value) => handleFormChange("problem", value)}
              placeholder={copy.problem.fields.problem.placeholder}
            />
            <TextArea
              label={copy.problem.fields.rootCause.label}
              value={form.rootCause}
              onChange={(value) => handleFormChange("rootCause", value)}
              placeholder={copy.problem.fields.rootCause.placeholder}
            />
            <TextArea
              label={copy.problem.fields.targetState.label}
              value={form.targetState}
              onChange={(value) => handleFormChange("targetState", value)}
              placeholder={copy.problem.fields.targetState.placeholder}
            />
            <TextArea
              label={copy.problem.fields.metricsBefore.label}
              value={form.metricsBefore}
              onChange={(value) => handleFormChange("metricsBefore", value)}
              placeholder={copy.problem.fields.metricsBefore.placeholder}
            />
            <TextArea
              label={copy.problem.fields.metricsAfter.label}
              value={form.metricsAfter}
              onChange={(value) => handleFormChange("metricsAfter", value)}
              placeholder={copy.problem.fields.metricsAfter.placeholder}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{copy.gains.title}</h3>
          <div className="space-y-3">
            <TextArea
              label={copy.gains.fields.gains.label}
              value={form.gains}
              onChange={(value) => handleFormChange("gains", value)}
              placeholder={copy.gains.fields.gains.placeholder}
              rows={6}
            />
            <TextArea
              label={copy.gains.fields.risks.label}
              value={form.risks}
              onChange={(value) => handleFormChange("risks", value)}
              placeholder={copy.gains.fields.risks.placeholder}
              rows={4}
            />
            <TextArea
              label={copy.gains.fields.lessons.label}
              value={form.lessons}
              onChange={(value) => handleFormChange("lessons", value)}
              placeholder={copy.gains.fields.lessons.placeholder}
              rows={4}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{copy.actions.title}</h3>
            <p className="text-[11px] text-slate-600">{copy.actions.description}</p>
          </div>
          <button
            onClick={addAction}
            className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
          >
            {copy.actions.add}
          </button>
        </div>

        <div className="space-y-3">
          {actions.map((row) => (
            <div
              key={row.id}
              className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_150px_120px]"
            >
              <input
                type="text"
                value={row.task}
                onChange={(event) => handleActionChange(row.id, "task", event.target.value)}
                placeholder={copy.actions.placeholders.task}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
              <input
                type="text"
                value={row.owner}
                onChange={(event) => handleActionChange(row.id, "owner", event.target.value)}
                placeholder={copy.actions.placeholders.owner}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
              <input
                type="text"
                value={row.due}
                onChange={(event) => handleActionChange(row.id, "due", event.target.value)}
                placeholder={copy.actions.placeholders.due}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
              <div className="flex items-center gap-2">
                <select
                  value={row.status}
                  onChange={(event) =>
                    handleActionChange(row.id, "status", event.target.value as ActionStatus)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {copy.status[option]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeAction(row.id)}
                  className="rounded-full border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100"
                  title={copy.actions.removeTitle}
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">{copy.checklist.title}</h3>
        <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
          {copy.checklist.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
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
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
      />
    </label>
  );
}
