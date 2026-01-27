// app/quality-tools/page.tsx
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { getLocaleFromCookies } from "@/utils/locale-server";

type QualityToolStatus = "planned" | "beta";
type QualityToolLevel = "basic" | "advanced";

type QualityTool = {
  id: string;
  name: string;
  label: string;
  description: string;
  useCases: string[];
  status: QualityToolStatus;
  level: QualityToolLevel;
  href?: string;
  premium?: boolean;
};

const QUALITY_TOOLS_BY_LOCALE: Record<"tr" | "en", QualityTool[]> = {
  tr: [
    {
      id: "5n1k",
      name: "5N1K Problem Tanimi",
      label: "5N1K",
      description:
        "Problemi netlestirmek icin Ne, Nerede, Ne zaman, Nasil, Neden ve Kim sorularini sistematik sekilde doldurmayi saglar.",
      useCases: ["Kalite problemi ilk tanimlama", "Musteri sikayeti analizi oncesi", "8D ve kok neden analizine giris"],
      status: "beta",
      level: "basic",
      href: "/quality-tools/5n1k",
    },
    {
      id: "5why",
      name: "5 Why (5 Neden) Analizi",
      label: "5 Why",
      description:
        "Bir problemin kok nedenine ulasmak icin ardisik 'Neden?' sorularinin yapilandirilmis sekilde sorulmasini saglar.",
      useCases: ["Tekrarlayan ariza analizi", "Musteri sikayetinde kok neden arayisi", "Ic kalite uygunsuzluklari"],
      status: "planned",
      level: "basic",
      href: "/quality-tools/5why",
    },
    {
      id: "8d",
      name: "8D Rapor Iskeleti",
      label: "8D",
      description:
        "8D metodolojisine gore ekip, problem tanimi, kok neden ve kalici aksiyonlari iceren rapor iskeleti sunar.",
      useCases: ["Otomotiv musteri sikayetleri", "Ciddi ic uygunsuzluklar", "Kalici aksiyon gerektiren problemler"],
      status: "beta",
      level: "advanced",
      href: "/quality-tools/8d",
    },
    {
      id: "kaizen",
      name: "Kaizen / Surekli Iyilestirme Karti",
      label: "Kaizen",
      description:
        "Kucuk ama surekli iyilestirmeleri takip etmek icin problem-hedef-aksiyon-sonuc yapisinda kayit tutmani saglar.",
      useCases: ["Atolye/hat iyilestirmeleri", "Verimlilik ve ergonomi iyilestirmeleri", "Kayip azaltma calismalari"],
      status: "beta",
      level: "basic",
      href: "/quality-tools/kaizen",
    },
    {
      id: "poka-yoke",
      name: "Poka-Yoke Fikir Karti",
      label: "Poka-Yoke",
      description: "Hata onleyici (poka-yoke) fikirleri tanimlayip uygulanabilirlik ve etki derecesini degerlendirir.",
      useCases: ["Montaj hatalarinda hata onleme", "Yanlis parca montajinin engellenmesi", "Operator hatalarini sistemle onleme"],
      status: "beta",
      level: "advanced",
      href: "/quality-tools/poka-yoke",
    },
  ],
  en: [
    {
      id: "5n1k",
      name: "5W1H Problem Definition",
      label: "5W1H",
      description:
        "Structure the problem by filling What, Where, When, How, Why, and Who questions systematically.",
      useCases: ["Initial quality issue definition", "Before customer complaint analysis", "Entry to 8D and root cause work"],
      status: "beta",
      level: "basic",
      href: "/quality-tools/5n1k",
    },
    {
      id: "5why",
      name: "5 Why Analysis",
      label: "5 Why",
      description:
        "Reach root cause by asking structured 'Why?' questions in sequence.",
      useCases: ["Recurring failure analysis", "Root cause in customer complaints", "Internal quality nonconformities"],
      status: "planned",
      level: "basic",
      href: "/quality-tools/5why",
    },
    {
      id: "8d",
      name: "8D Report Template",
      label: "8D",
      description:
        "Provides a report skeleton for team, problem definition, root cause, and permanent actions.",
      useCases: ["Automotive customer complaints", "Critical internal nonconformities", "Issues requiring permanent action"],
      status: "beta",
      level: "advanced",
      href: "/quality-tools/8d",
    },
    {
      id: "kaizen",
      name: "Kaizen / Continuous Improvement Card",
      label: "Kaizen",
      description:
        "Track small, continuous improvements in a problem-goal-action-result format.",
      useCases: ["Shopfloor improvements", "Productivity and ergonomics gains", "Loss reduction initiatives"],
      status: "beta",
      level: "basic",
      href: "/quality-tools/kaizen",
    },
    {
      id: "poka-yoke",
      name: "Poka-Yoke Idea Card",
      label: "Poka-Yoke",
      description: "Define error-proofing ideas and evaluate feasibility and impact.",
      useCases: ["Preventing assembly errors", "Avoiding wrong part installation", "Reducing operator mistakes"],
      status: "beta",
      level: "advanced",
      href: "/quality-tools/poka-yoke",
    },
  ],
};

export default async function QualityToolsPage() {
  const locale = await getLocaleFromCookies();
  const tools = QUALITY_TOOLS_BY_LOCALE[locale];

  const copy =
    locale === "en"
      ? {
          badge: "Quality tools: 5W1H · 5 Why · 8D · Kaizen · Poka-Yoke",
          title: "Digital templates for problem definition and root cause actions",
          description: "Simple quality templates for definition, root cause, and action follow-up.",
          typical: "Typical use",
          free: "Free",
          active: "Active (Beta)",
          planned: "Planned",
          basic: "Basic level",
          advanced: "Advanced level",
          openTool: "Open tool",
          comingSoon: "Coming soon",
          footerActive: "Interactive form available (draft).",
          footerPlanned: "Template and form design in progress.",
        }
      : {
          badge: "Kalite araclari: 5N1K · 5 Why · 8D · Kaizen · Poka-Yoke",
          title: "Problem tanimi, kok neden analizi ve kalici aksiyonlar icin dijital sablonlar",
          description: "Problem tanimi, kok neden ve aksiyon takibi icin sade kalite sablonlari.",
          typical: "Tipik kullanim:",
          free: "Free",
          active: "Aktif (Beta)",
          planned: "Planlandi",
          basic: "Temel seviye",
          advanced: "Ileri seviye",
          openTool: "Araci Ac",
          comingSoon: "Yakinda",
          footerActive: "Etkilesimli form ile calisilabilir (taslak).",
          footerPlanned: "Sablon ve form tasarimi uzerinde calisiliyor.",
        };

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] text-sky-700 md:text-xs">
            <span className="font-semibold">{copy.badge}</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
            {copy.title}
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">{copy.description}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <article
            key={tool.id}
            className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 text-xs shadow-sm hover:border-slate-300 hover:shadow-md"
          >
            <div className="space-y-2">
              <header className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="inline-flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                      {tool.label}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-slate-900 break-words">{tool.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={tool.status} activeLabel={copy.active} plannedLabel={copy.planned} />
                    {tool.premium && (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </header>

              <p className="text-[11px] leading-relaxed text-slate-700 break-words">{tool.description}</p>

              <div>
                <p className="mb-1 text-[11px] font-semibold text-slate-800">{copy.typical}</p>
                <ul className="list-inside list-disc space-y-1 text-[11px] text-slate-700">
                  {tool.useCases.slice(0, 2).map((u) => (
                    <li key={u} className="break-words">
                      {u}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                <LevelBadge level={tool.level} basicLabel={copy.basic} advancedLabel={copy.advanced} />
                {!tool.premium && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    {copy.free}
                  </span>
                )}
              </div>
            </div>

            <footer className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500">
              <span className="min-w-0 break-words">
                {tool.href ? copy.footerActive : copy.footerPlanned}
              </span>

              {tool.href ? (
                <Link
                  href={tool.href}
                  className="rounded-full bg-sky-600 px-3 py-1 text-[10px] font-semibold text-white hover:bg-sky-500"
                >
                  {copy.openTool}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[10px] font-medium text-slate-500"
                >
                  {copy.comingSoon}
                </button>
              )}
            </footer>
          </article>
        ))}
      </section>
    </PageShell>
  );
}

function StatusBadge({
  status,
  activeLabel,
  plannedLabel,
}: {
  status: QualityToolStatus;
  activeLabel: string;
  plannedLabel: string;
}) {
  if (status === "beta") {
    return (
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
        {activeLabel}
      </span>
    );
  }

  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
      {plannedLabel}
    </span>
  );
}

function LevelBadge({
  level,
  basicLabel,
  advancedLabel,
}: {
  level: QualityToolLevel;
  basicLabel: string;
  advancedLabel: string;
}) {
  if (level === "basic") {
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
        {basicLabel}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
      {advancedLabel}
    </span>
  );
}
