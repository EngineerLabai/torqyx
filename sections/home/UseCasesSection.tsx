import type { Locale } from "@/utils/locale";

type UseCasesSectionProps = {
  locale: Locale;
};

const useCasesByLocale: Record<
  Locale,
  { title: string; description: string }[]
> = {
  tr: [
    {
      title: "Hesaplama yap",
      description: "Disli, tork, gerilme ve malzeme hesaplarini hizlica tamamla.",
    },
    {
      title: "Gorsel destekle ogren",
      description: "Formulleri diyagramlar ve kisa notlarla kolayca takip et.",
    },
    {
      title: "Proje akisi hazirla",
      description: "Part-tracking, RFQ ve devreye alma akisini netlestir.",
    },
    {
      title: "Kalite kontrol listeleri",
      description: "8D, 5Why, Kaizen gibi kalite araclarini uygula.",
    },
  ],
  en: [
    {
      title: "Run calculations",
      description: "Complete gear, torque, stress, and material checks quickly.",
    },
    {
      title: "Learn with visuals",
      description: "Follow formulas with diagrams and short notes.",
    },
    {
      title: "Plan project flow",
      description: "Clarify part tracking, RFQ, and commissioning flows.",
    },
    {
      title: "Quality checklists",
      description: "Apply 8D, 5 Why, and Kaizen quality tools.",
    },
  ],
};

export default function UseCasesSection({ locale }: UseCasesSectionProps) {
  const copy =
    locale === "en"
      ? {
          kicker: "What can I do?",
          title: "A fast start based on your need",
          lead:
            "Pick your goal, open the right tool, and validate results quickly. Everything is mobile-first and smooth.",
          ctaPrimary: "Go to Calculators",
          ctaSecondary: "Explore Tools",
        }
      : {
          kicker: "Ne yapabilirim?",
          title: "Ihtiyacina gore hizli bir baslangic",
          lead: "Amacini sec, ilgili araca git, sonucu hemen test et. Her sey mobile-first ve akici.",
          ctaPrimary: "Hesaplamalara Git",
          ctaSecondary: "Araclari Kesfet",
        };

  return (
    <section id="use-cases" className="relative z-10 px-4 pb-16 md:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">{copy.kicker}</p>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{copy.title}</h2>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">{copy.lead}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCasesByLocale[locale].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-black/50 p-5 text-sm text-slate-200 shadow-[6px_6px_0px_rgba(74,222,128,0.12)] backdrop-blur"
            >
              <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/tools"
            className="inline-flex items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-500/30"
          >
            {copy.ctaPrimary}
          </a>
          <a
            href="/quality-tools"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
          >
            {copy.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
