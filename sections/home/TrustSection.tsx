import type { Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";

type TrustSectionProps = {
  locale: Locale;
};

export default function TrustSection({ locale }: TrustSectionProps) {
  const copy = getMessages(locale).home.trust;

  return (
    <section id="trust" className="px-4 pb-16 pt-10 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{copy.kicker}</p>
          <h2 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h2>
          <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600 md:text-base">{copy.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {copy.testimonials.map((item) => (
            <figure key={item.quote} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <blockquote className="text-sm text-slate-700">“{item.quote}”</blockquote>
              <figcaption className="mt-4 text-xs font-semibold text-slate-900">
                {item.name}
                <span className="block text-[11px] font-medium text-slate-500">{item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {copy.logos.length > 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{copy.logosTitle}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {copy.logos.map((logo) => (
                <span
                  key={logo}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold text-slate-600"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 text-sm text-emerald-900 shadow-sm">
          <h3 className="text-base font-semibold">{copy.guarantee.title}</h3>
          <p className="mt-2 text-sm text-emerald-800">{copy.guarantee.body}</p>
        </div>
      </div>
    </section>
  );
}
