import { Star } from "lucide-react";
import type { Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";

type TestimonialSectionProps = {
  locale: Locale;
};

export default function TestimonialSection({ locale }: TestimonialSectionProps) {
  const copy = getMessages(locale).home.testimonials;

  return (
    <section className="w-full py-12">
      <div className="site-container space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">{copy.kicker}</p>
          <h2 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h2>
          <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600 md:text-base">{copy.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {copy.items.map((item) => (
            <article key={item.author} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-1 text-brand" aria-label="5/5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">{item.quote}</p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-sm font-semibold text-slate-900">{item.author}</p>
                <p className="text-xs text-slate-500">{item.context}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
