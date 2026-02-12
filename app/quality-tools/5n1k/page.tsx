// app/quality-tools/5n1k/page.tsx
"use client";

import Link from "next/link";
import { useState, ChangeEvent } from "react";
import PageShell from "@/components/layout/PageShell";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatMessage } from "@/utils/messages";
import { assertNoTurkish } from "@/utils/i18n-assert";
import { withLocalePrefix } from "@/utils/locale-path";
import { fiveN1kCopy } from "@/data/quality-tools/5n1k";

type FiveN1KForm = {
  what: string;
  where: string;
  when: string;
  who: string;
  why: string;
  how: string;
};

type SavedSummary = {
  id: number;
  summary: string;
  form: FiveN1KForm;
};

type SummaryCopy = typeof fiveN1kCopy.tr.summary;
type SavedCopy = typeof fiveN1kCopy.tr.saved;
type PremiumCopy = typeof fiveN1kCopy.tr.premium;

const INITIAL_FORM: FiveN1KForm = {
  what: "",
  where: "",
  when: "",
  who: "",
  why: "",
  how: "",
};

export default function FiveN1KPage() {
  const { locale } = useLocale();
  const copy = fiveN1kCopy[locale];
  assertNoTurkish(locale, copy, "quality-tools/5n1k");
  const premiumHref = withLocalePrefix("/pricing", locale);

  const [form, setForm] = useState<FiveN1KForm>(INITIAL_FORM);
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([]);
  const [filterText, setFilterText] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleChange(
    key: keyof FiveN1KForm,
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function handleSave() {
    setSaveError(null);

    if (Object.values(form).every((value) => !value.trim())) {
      setSaveError(copy.saveErrorEmpty);
      return;
    }

    const summary = buildOneLineSummary(form, copy.summary);
    setSavedSummaries((prev) => [...prev, { id: prev.length + 1, summary, form }]);
    setForm(INITIAL_FORM);
  }

  const isEmpty = Object.values(form).every((value) => !value.trim());

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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-800"
              >
                {copy.buttons.save}
              </button>
              <button
                type="button"
                onClick={() => setForm(INITIAL_FORM)}
                className="rounded-full border border-slate-300 px-3 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
              >
                {copy.buttons.clear}
              </button>
            </div>
          </div>

          {saveError && <p className="mb-2 text-[11px] text-red-600">{saveError}</p>}

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700">{copy.fields.what.label}</label>
              <textarea
                rows={2}
                value={form.what}
                onChange={(e) => handleChange("what", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder={copy.fields.what.placeholder}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">{copy.fields.where.label}</label>
              <textarea
                rows={2}
                value={form.where}
                onChange={(e) => handleChange("where", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder={copy.fields.where.placeholder}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">{copy.fields.when.label}</label>
              <textarea
                rows={2}
                value={form.when}
                onChange={(e) => handleChange("when", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder={copy.fields.when.placeholder}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">{copy.fields.who.label}</label>
              <textarea
                rows={2}
                value={form.who}
                onChange={(e) => handleChange("who", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder={copy.fields.who.placeholder}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700">{copy.fields.why.label}</label>
              <textarea
                rows={2}
                value={form.why}
                onChange={(e) => handleChange("why", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder={copy.fields.why.placeholder}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700">{copy.fields.how.label}</label>
              <textarea
                rows={2}
                value={form.how}
                onChange={(e) => handleChange("how", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder={copy.fields.how.placeholder}
              />
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            {copy.sessionNote.prefix}{" "}
            <Link href={premiumHref} className="font-semibold text-amber-700 hover:underline">
              {copy.sessionNote.link}
            </Link>
            {copy.sessionNote.suffix}
          </p>
        </div>

        <div className="space-y-4">
          <FiveN1KSummaryCard form={form} isEmpty={isEmpty} copy={copy.summary} tips={copy.summaryTips} />
          <SavedSummariesList
            items={savedSummaries}
            filterText={filterText}
            onFilterTextChange={setFilterText}
            copy={copy.saved}
          />
          <PremiumExportNotice copy={copy.premium} premiumHref={premiumHref} />
        </div>
      </section>
    </PageShell>
  );
}

type SummaryProps = {
  form: FiveN1KForm;
  isEmpty: boolean;
  copy: SummaryCopy;
  tips: string[];
};

function FiveN1KSummaryCard({ form, isEmpty, copy, tips }: SummaryProps) {
  const { what, where, when, who, why, how } = form;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-slate-900">{copy.title}</h2>

      {isEmpty ? (
        <p className="text-[11px] text-slate-500">{copy.empty}</p>
      ) : (
        <div className="space-y-2 text-[11px] text-slate-700">
          {what && (
            <p>
              <span className="font-semibold">{copy.labels.what}</span> {what}
            </p>
          )}
          {where && (
            <p>
              <span className="font-semibold">{copy.labels.where}</span> {where}
            </p>
          )}
          {when && (
            <p>
              <span className="font-semibold">{copy.labels.when}</span> {when}
            </p>
          )}
          {who && (
            <p>
              <span className="font-semibold">{copy.labels.who}</span> {who}
            </p>
          )}
          {why && (
            <p>
              <span className="font-semibold">{copy.labels.why}</span> {why}
            </p>
          )}
          {how && (
            <p>
              <span className="font-semibold">{copy.labels.how}</span> {how}
            </p>
          )}

          <div className="mt-3 rounded-lg bg-slate-50 p-3">
            <p className="mb-1 font-semibold text-slate-900">{copy.oneLine.title}</p>
            <p className="font-mono text-[11px] text-slate-800">{buildOneLineSummary(form, copy)}</p>
          </div>
        </div>
      )}

      <hr className="my-3 border-slate-200" />

      <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-600">
        {tips.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

type SavedSummariesProps = {
  items: SavedSummary[];
  filterText: string;
  onFilterTextChange: (value: string) => void;
  copy: SavedCopy;
};

function SavedSummariesList({ items, filterText, onFilterTextChange, copy }: SavedSummariesProps) {
  const normalizedQuery = filterText.trim().toLowerCase();
  const filtered =
    normalizedQuery.length === 0
      ? items
      : items.filter((item) => {
          const haystack = [
            item.summary,
            item.form.what,
            item.form.where,
            item.form.when,
            item.form.who,
            item.form.why,
            item.form.how,
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(normalizedQuery);
        });

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{copy.title}</h3>
        <input
          type="text"
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
          placeholder={copy.searchPlaceholder}
          className="w-40 rounded-lg border border-slate-300 px-2 py-1 text-[11px] text-slate-700 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-[11px] text-slate-500">{copy.empty}</p>
      ) : (
        <ol className="space-y-2 text-[11px] text-slate-700">
          {filtered.map((item, idx) => (
            <li
              key={item.id}
              className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                {idx + 1}
              </span>
              <div className="space-y-1">
                <p className="font-medium text-slate-900">{item.summary}</p>
                <p className="text-[10px] text-slate-500">
                  {formatMessage(copy.metaTemplate, {
                    what: item.form.what || copy.emptyValue,
                    where: item.form.where || copy.emptyValue,
                    when: item.form.when || copy.emptyValue,
                    who: item.form.who || copy.emptyValue,
                  })}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

function PremiumExportNotice({ copy, premiumHref }: { copy: PremiumCopy; premiumHref: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[11px] text-amber-900 shadow-sm">
      <h3 className="mb-1 text-sm font-semibold">{copy.title}</h3>
      <p className="mb-2">
        {copy.prefix}{" "}
        <Link href={premiumHref} className="font-semibold text-amber-700 hover:underline">
          {copy.link}
        </Link>
        {copy.suffix}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled
          className="flex-1 rounded-full border border-amber-300 px-3 py-1.5 font-semibold text-amber-700 opacity-60"
        >
          {copy.pdf}
        </button>
        <button
          type="button"
          disabled
          className="flex-1 rounded-full border border-amber-300 px-3 py-1.5 font-semibold text-amber-700 opacity-60"
        >
          {copy.excel}
        </button>
      </div>
    </div>
  );
}

function buildOneLineSummary(form: FiveN1KForm, copy: SummaryCopy): string {
  const parts: string[] = [];

  if (form.what.trim()) {
    parts.push(form.what.trim());
  }

  if (form.where.trim()) {
    parts.push(`${copy.oneLine.prefixes.where}: ${form.where.trim()}`);
  }

  if (form.when.trim()) {
    parts.push(`${copy.oneLine.prefixes.when}: ${form.when.trim()}`);
  }

  if (form.who.trim()) {
    parts.push(`${copy.oneLine.prefixes.who}: ${form.who.trim()}`);
  }

  if (form.why.trim()) {
    parts.push(`${copy.oneLine.prefixes.why}: ${form.why.trim()}`);
  }

  if (form.how.trim()) {
    parts.push(`${copy.oneLine.prefixes.how}: ${form.how.trim()}`);
  }

  if (parts.length === 0) {
    return copy.oneLine.empty;
  }

  return parts.join(" | ");
}
