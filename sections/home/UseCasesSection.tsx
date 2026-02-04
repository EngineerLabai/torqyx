import type { Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";

type UseCasesSectionProps = {
  locale: Locale;
};

export default function UseCasesSection({ locale }: UseCasesSectionProps) {
  const copy = getMessages(locale).home.useCases;

  return (
    <section id="use-cases" className="px-4 py-12 md:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{copy.kicker}</p>
          <h2 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{copy.title}</h2>
          <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600 md:text-base">{copy.lead}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {copy.items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="mb-2 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
