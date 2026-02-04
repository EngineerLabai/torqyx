// app/fixture-tools/page.tsx
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.fixtureTools;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/fixture-tools",
    locale,
  });
}

type FixtureToolStatus = "planned" | "beta";

type FixtureTool = {
  id: string;
  name: string;
  label: string;
  description: string;
  highlights: string[];
  status: FixtureToolStatus;
  href?: string;
};

const FIXTURE_TOOLS_BY_LOCALE: Record<"tr" | "en", FixtureTool[]> = {
  tr: [
    {
      id: "locating",
      name: "3-2-1 Referanslama Karti",
      label: "Konumlama",
      description:
        "3-2-1 prensibi, sabit/kayan pim secimi ve konumlama kontrol listesi.",
      highlights: ["Referans yuzeyi secimi", "Sabit/kayan pim planlama", "Hizli kontrol listesi"],
      status: "beta",
      href: "/fixture-tools/locating",
    },
    {
      id: "clamping",
      name: "Sikistirma Kuvveti Karti",
      label: "Sikistirma",
      description:
        "Hizli normal kuvvet tahmini ve kuvvet yolu icin not karti.",
      highlights: ["Kiskac sayisi planlama", "Kayma riski kontrolu", "Reaksiyon noktasi notlari"],
      status: "beta",
      href: "/fixture-tools/clamping",
    },
    {
      id: "base-plate",
      name: "Taban Plakasi Boyutlandirma",
      label: "Taban plaka",
      description:
        "Kalinlik tahmini ve standart plaka secimi icin pratik yardimci.",
      highlights: ["Hizli kalinlik hesabi", "Standart plaka onerisi", "Makine tabla uyumu"],
      status: "beta",
      href: "/fixture-tools/base-plate",
    },
  ],
  en: [
    {
      id: "locating",
      name: "3-2-1 Locating Card",
      label: "Locating",
      description:
        "3-2-1 principle, fixed/floating pin choice, and locating checklist.",
      highlights: ["Reference surface selection", "Fixed/floating pin planning", "Quick checklist"],
      status: "beta",
      href: "/fixture-tools/locating",
    },
    {
      id: "clamping",
      name: "Clamping Force Card",
      label: "Clamping",
      description:
        "Quick normal force estimate and force path notes.",
      highlights: ["Clamp count planning", "Slip risk check", "Reaction point notes"],
      status: "beta",
      href: "/fixture-tools/clamping",
    },
    {
      id: "base-plate",
      name: "Base Plate Sizing",
      label: "Base plate",
      description:
        "Practical helper for thickness estimate and standard plate selection.",
      highlights: ["Quick thickness calc", "Standard plate recommendation", "Machine table alignment"],
      status: "beta",
      href: "/fixture-tools/base-plate",
    },
  ],
};

export default async function FixtureToolsPage() {
  const locale = await getLocaleFromCookies();
  const tools = FIXTURE_TOOLS_BY_LOCALE[locale];
  const copy = getMessages(locale).pages.fixtureTools;
  const localizeHref = (href?: string) => (href ? withLocalePrefix(href, locale) : undefined);

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600 md:text-xs">
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
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {tool.label}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-slate-900 break-words">
                      {tool.name}
                    </h3>
                  </div>
                  <StatusBadge status={tool.status} activeLabel={copy.active} plannedLabel={copy.planned} />
                </div>
              </header>

              <p className="text-[11px] leading-relaxed text-slate-700 break-words">{tool.description}</p>

              <div>
                <p className="mb-1 text-[11px] font-semibold text-slate-800">{copy.focus}</p>
                <ul className="list-inside list-disc space-y-1 text-[11px] text-slate-700">
                  {tool.highlights.slice(0, 3).map((item) => (
                    <li key={item} className="break-words">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <footer className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500">
              <span className="min-w-0 break-words">
                {tool.href ? copy.footerActive : copy.footerPlanned}
              </span>

              {tool.href ? (
                <Link
                  href={localizeHref(tool.href) ?? tool.href}
                  className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-800"
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
  status: FixtureToolStatus;
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
