import AuthModalTrigger from "@/components/auth/AuthModalTrigger";
import type { Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";

type PricingTeaserSectionProps = {
  locale: Locale;
};

export default function PricingTeaserSection({ locale }: PricingTeaserSectionProps) {
  const copy = getMessages(locale).home.pricing;

  return (
    <section id="pricing-teaser" className="px-4 py-12 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{copy.kicker}</p>
          <h2 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h2>
          <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600 md:text-base">{copy.description}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr]">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <span>{copy.table.feature}</span>
                <span className="text-slate-700">{copy.free.title}</span>
                <span className="text-amber-700">{copy.pro.title}</span>
              </div>

              {copy.table.rows.map((row) => (
                <div key={row.label} className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="text-xs font-semibold text-slate-600">{row.label}</span>
                  <span className="text-xs text-slate-700">{row.free}</span>
                  <span className="text-xs font-semibold text-amber-700">{row.pro}</span>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 text-sm shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">{copy.pro.badge}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{copy.pro.title}</h3>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-700">
                  {copy.pro.price}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{copy.pro.subtitle}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {copy.pro.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <AuthModalTrigger
                label={copy.ctaPrimary}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-amber-600 hover:via-orange-600 hover:to-rose-600"
              />
              <p className="mt-3 text-[11px] text-slate-500">{copy.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
