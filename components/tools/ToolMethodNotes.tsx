"use client";

import type { ToolMethodNotes } from "@/lib/tool-method-notes";

type ToolMethodNotesProps = {
  notes: ToolMethodNotes;
};

export default function ToolMethodNotes({ notes }: ToolMethodNotesProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Ne işe yarar?</h2>
          {notes.intro.map((paragraph) => (
            <p key={paragraph} className="text-sm text-slate-700 md:text-base">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Girdiler</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="py-2 pr-4 font-semibold">Girdi</th>
                  <th className="py-2 pr-4 font-semibold">Birim</th>
                  <th className="py-2 pr-4 font-semibold">Tipik aralık</th>
                  <th className="py-2 font-semibold">Etkisi</th>
                </tr>
              </thead>
              <tbody>
                {notes.inputs.map((input) => (
                  <tr key={input.name} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-2 pr-4 font-semibold text-slate-900">{input.name}</td>
                    <td className="py-2 pr-4">{input.unit ?? "-"}</td>
                    <td className="py-2 pr-4">{input.range ?? "-"}</td>
                    <td className="py-2">{input.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Formül / yaklaşım</h2>
          <p className="text-sm text-slate-700 md:text-base">{notes.formula.summary}</p>
          {notes.formula.expressions.length > 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-700">
              {notes.formula.expressions.map((expression) => (
                <div key={expression}>{expression}</div>
              ))}
            </div>
          ) : null}
          {notes.formula.notes?.length ? (
            <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
              {notes.formula.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Varsayımlar &amp; Sınırlar</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {notes.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Örnek</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Girdi seti</p>
              <dl className="mt-3 space-y-2 text-xs text-slate-700">
                {Object.entries(notes.example.inputs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">{key}</dt>
                    <dd className="font-mono text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Çıktı</p>
              <dl className="mt-3 space-y-2 text-xs text-slate-700">
                {Object.entries(notes.example.outputs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">{key}</dt>
                    <dd className="font-mono text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <p className="text-sm text-slate-700 md:text-base">{notes.example.interpretation}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Sık sorulanlar (FAQ)</h2>
          <div className="space-y-4">
            {notes.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                <p className="mt-2 text-sm text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {notes.references && notes.references.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Referanslar</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              {notes.references.map((ref) => (
                <li key={ref.title}>
                  {ref.href ? (
                    <a href={ref.href} className="font-semibold text-emerald-700 hover:underline" target="_blank" rel="noreferrer">
                      {ref.title}
                    </a>
                  ) : (
                    ref.title
                  )}
                  {ref.note ? <span className="text-slate-500"> — {ref.note}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </section>
  );
}
