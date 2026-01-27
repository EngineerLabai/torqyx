import type { Locale } from "@/utils/locale";

type AboutSectionProps = {
  locale: Locale;
};

export default function AboutSection({ locale }: AboutSectionProps) {
  const copy =
    locale === "en"
      ? {
          kicker: "About",
          title: "AI is not a tool here; it is a mindset.",
          lead:
            "There is no AI integration on this platform. AI is positioned as thinking and methodology; calculations stay manual and visually supported.",
          cardOneTitle: "Thinking / Guidance",
          cardOneBody:
            "AI helps break down problems, ask the right questions, and choose the method.",
          cardTwoTitle: "Manual + Visual",
          cardTwoBody:
            "Results are produced with manual math, formulas, and visual explanations so the process stays readable.",
        }
      : {
          kicker: "Hakkinda",
          title: "AI burada arac degil, yaklasimdir.",
          lead:
            "Bu platformda AI entegrasyonu yok. AI, dusunce ve metodoloji olarak konumlanir; hesaplamalar ise manuel ve gorsel destekli ilerler.",
          cardOneTitle: "Dusunce / Yonlendirme",
          cardOneBody:
            "AI, problemi parcalama, sorulari dogru sorma ve metodoloji secimi icin yol gosterir.",
          cardTwoTitle: "Manuel + Gorsel",
          cardTwoBody:
            "Sonuclar; manuel hesap, formuller ve gorsel anlatimla uretilir. Bu sayede surec okunur kalir.",
        };

  return (
    <section id="about" className="relative z-10 px-4 pb-16 md:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">{copy.kicker}</p>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{copy.title}</h2>
          <p className="text-sm text-slate-300 md:text-base">{copy.lead}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-5 text-sm text-slate-200 backdrop-blur">
            <h3 className="mb-2 text-base font-semibold text-white">{copy.cardOneTitle}</h3>
            <p className="text-sm text-slate-300">{copy.cardOneBody}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-5 text-sm text-slate-200 backdrop-blur">
            <h3 className="mb-2 text-base font-semibold text-white">{copy.cardTwoTitle}</h3>
            <p className="text-sm text-slate-300">{copy.cardTwoBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
