import { CheckCircle2, Clock, ShieldCheck, XCircle } from "lucide-react";
import type { Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";

type ValuePropsSectionProps = {
  locale: Locale;
};

export default function ValuePropsSection({ locale }: ValuePropsSectionProps) {
  const copy = getMessages(locale).home.valueProps;

  return (
    <section id="value-props" className="px-4 py-12 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{copy.kicker}</p>
          <h2 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h2>
          <p className="max-w-[70ch] text-sm leading-relaxed text-slate-600 md:text-base">{copy.description}</p>
        </div>

        <div className="grid gap-6">
          <article className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                <Clock size={14} />
                {copy.excel.badge}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{copy.excel.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{copy.excel.body}</p>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {copy.excel.metricLabel}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{copy.excel.metricValue}</p>
                <p className="mt-1 text-xs text-slate-500">{copy.excel.metricNote}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <XCircle size={16} className="text-amber-500" />
                    {copy.excel.excelLabel}
                  </div>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    {copy.excel.excelPoints.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={16} />
                    {copy.excel.toolLabel}
                  </div>
                  <ul className="mt-3 space-y-2 text-xs text-emerald-700">
                    {copy.excel.toolPoints.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>

          <article className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {copy.accuracy.formulaLabel}
                </p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-700">
                  {copy.accuracy.formulaExample}
                </div>
                <div className="grid gap-2 text-xs text-slate-600">
                  {copy.accuracy.formulaNotes.map((item) => (
                    <div key={item} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
                <ShieldCheck size={14} className="text-emerald-600" />
                {copy.accuracy.badge}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{copy.accuracy.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{copy.accuracy.body}</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {copy.accuracy.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
                {copy.library.badge}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{copy.library.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{copy.library.body}</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {copy.library.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-3">
                {copy.library.cards.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
