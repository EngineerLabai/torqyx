// app/quality-tools/poka-yoke/page.tsx
"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { assertNoTurkish } from "@/utils/i18n-assert";
import { pokaYokeCopy } from "@/data/quality-tools/poka-yoke";

type StatusOption = "planned" | "inProgress" | "done";
type IdeaType = "prevention" | "detection" | "warning";
type Principle = "physicalGuide" | "interlock" | "sensor" | "counter" | "labelColor";

type ActionRow = {
  id: string;
  task: string;
  owner: string;
  due: string;
  status: StatusOption;
};

type PokaYokeForm = {
  title: string;
  process: string;
  station: string;
  part: string;
  owner: string;
  date: string;
  problem: string;
  failureMode: string;
  currentControl: string;
  severity: string;
  occurrence: string;
  detection: string;
  idea: string;
  ideaType: IdeaType;
  principle: Principle;
  expectedEffect: string;
  feasibility: string;
  cost: string;
  risk: string;
  validation: string;
};

const INITIAL_FORM: PokaYokeForm = {
  title: "",
  process: "",
  station: "",
  part: "",
  owner: "",
  date: "",
  problem: "",
  failureMode: "",
  currentControl: "",
  severity: "",
  occurrence: "",
  detection: "",
  idea: "",
  ideaType: "prevention",
  principle: "physicalGuide",
  expectedEffect: "",
  feasibility: "",
  cost: "",
  risk: "",
  validation: "",
};

const STATUS_OPTIONS: StatusOption[] = ["planned", "inProgress", "done"];

function uuid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function PokaYokePage() {
  const { locale } = useLocale();
  const copy = pokaYokeCopy[locale];
  assertNoTurkish(locale, copy, "quality-tools/poka-yoke");

  const [form, setForm] = useState<PokaYokeForm>(INITIAL_FORM);
  const [actions, setActions] = useState<ActionRow[]>([
    { id: uuid(), task: "", owner: "", due: "", status: "planned" },
  ]);

  function handleChange<K extends keyof PokaYokeForm>(key: K, value: PokaYokeForm[K]) {
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
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            {copy.badges.subtitle}
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
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label={copy.basics.fields.title.label}
            value={form.title}
            onChange={(value) => handleChange("title", value)}
            placeholder={copy.basics.fields.title.placeholder}
          />
          <Field
            label={copy.basics.fields.process.label}
            value={form.process}
            onChange={(value) => handleChange("process", value)}
            placeholder={copy.basics.fields.process.placeholder}
          />
          <Field
            label={copy.basics.fields.station.label}
            value={form.station}
            onChange={(value) => handleChange("station", value)}
            placeholder={copy.basics.fields.station.placeholder}
          />
          <Field
            label={copy.basics.fields.part.label}
            value={form.part}
            onChange={(value) => handleChange("part", value)}
            placeholder={copy.basics.fields.part.placeholder}
          />
          <Field
            label={copy.basics.fields.owner.label}
            value={form.owner}
            onChange={(value) => handleChange("owner", value)}
            placeholder={copy.basics.fields.owner.placeholder}
          />
          <Field
            label={copy.basics.fields.date.label}
            value={form.date}
            onChange={(value) => handleChange("date", value)}
            placeholder={copy.basics.fields.date.placeholder}
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
              onChange={(value) => handleChange("problem", value)}
              placeholder={copy.problem.fields.problem.placeholder}
            />
            <TextArea
              label={copy.problem.fields.failureMode.label}
              value={form.failureMode}
              onChange={(value) => handleChange("failureMode", value)}
              placeholder={copy.problem.fields.failureMode.placeholder}
            />
            <TextArea
              label={copy.problem.fields.currentControl.label}
              value={form.currentControl}
              onChange={(value) => handleChange("currentControl", value)}
              placeholder={copy.problem.fields.currentControl.placeholder}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field
                label={copy.problem.fields.severity.label}
                value={form.severity}
                onChange={(value) => handleChange("severity", value)}
                placeholder={copy.problem.fields.severity.placeholder}
              />
              <Field
                label={copy.problem.fields.occurrence.label}
                value={form.occurrence}
                onChange={(value) => handleChange("occurrence", value)}
                placeholder={copy.problem.fields.occurrence.placeholder}
              />
              <Field
                label={copy.problem.fields.detection.label}
                value={form.detection}
                onChange={(value) => handleChange("detection", value)}
                placeholder={copy.problem.fields.detection.placeholder}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{copy.idea.title}</h3>
          <div className="space-y-3">
            <TextArea
              label={copy.idea.fields.idea.label}
              value={form.idea}
              onChange={(value) => handleChange("idea", value)}
              placeholder={copy.idea.fields.idea.placeholder}
              rows={5}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label={copy.idea.ideaType.label}
                value={form.ideaType}
                onChange={(value) => handleChange("ideaType", value as IdeaType)}
                options={copy.idea.ideaType.options}
              />
              <SelectField
                label={copy.idea.principle.label}
                value={form.principle}
                onChange={(value) => handleChange("principle", value as Principle)}
                options={copy.idea.principle.options}
              />
            </div>
            <TextArea
              label={copy.idea.fields.expectedEffect.label}
              value={form.expectedEffect}
              onChange={(value) => handleChange("expectedEffect", value)}
              placeholder={copy.idea.fields.expectedEffect.placeholder}
            />
            <TextArea
              label={copy.idea.fields.feasibility.label}
              value={form.feasibility}
              onChange={(value) => handleChange("feasibility", value)}
              placeholder={copy.idea.fields.feasibility.placeholder}
            />
            <TextArea
              label={copy.idea.fields.cost.label}
              value={form.cost}
              onChange={(value) => handleChange("cost", value)}
              placeholder={copy.idea.fields.cost.placeholder}
            />
            <TextArea
              label={copy.idea.fields.risk.label}
              value={form.risk}
              onChange={(value) => handleChange("risk", value)}
              placeholder={copy.idea.fields.risk.placeholder}
            />
            <TextArea
              label={copy.idea.fields.validation.label}
              value={form.validation}
              onChange={(value) => handleChange("validation", value)}
              placeholder={copy.idea.fields.validation.placeholder}
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
                    handleActionChange(row.id, "status", event.target.value as StatusOption)
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
