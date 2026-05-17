"use client";

import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import ToolFavoriteButton from "@/components/tools/ToolFavoriteButton";
import { toolCatalog } from "@/tools/_shared/catalog";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { withLocalePrefix } from "@/utils/locale-path";
import { getBlueprintImageSrc } from "@/lib/assets";

type CalcCard = {
  name: string;
  description: string;
  status: "active" | "soon";
  href: string;
  badge: string;
};

const t = (locale: "tr" | "en", tr: string, en: string) => (locale === "tr" ? tr : en);

const resolveToolId = (href: string) => toolCatalog.find((tool) => tool.href === href)?.id ?? "";

const getCalculators = (locale: "tr" | "en"): CalcCard[] => [
  {
    name: t(locale, "Modül Hesaplayıcı", "Module Calculator"),
    description: t(locale, "Dişli boyutu, diş sayısı ve kaliteye göre modül önerisi ve kontrolü.", "Module recommendation and checks based on gear size, tooth count, and quality."),
    status: "active",
    href: "/tools/gear-design/calculators/module-calculator",
    badge: t(locale, "Modül", "Module"),
  },
  {
    name: t(locale, "Dişli Oranı Hesaplayıcı", "Gear Ratio Calculator"),
    description: t(locale, "z1/z2 veya d1/d2 ile oran, rpm ve tork ilişkisi.", "Ratio, rpm, and torque relation from z1/z2 or d1/d2."),
    status: "active",
    href: "/tools/gear-design/calculators/ratio-calculator",
    badge: t(locale, "Oran", "Ratio"),
  },
  {
    name: t(locale, "Çevresel Kuvvet / Tork Hesaplayıcı", "Tangential Force / Torque Calculator"),
    description: t(locale, "Ft = 2·π·T/d ve Fr/Fa (helis) otomatik hesap.", "Automatic Ft = 2·π·T/d and Fr/Fa (helix) calculation."),
    status: "active",
    href: "/tools/gear-design/calculators/force-torque-calculator",
    badge: t(locale, "Kuvvet", "Force"),
  },
  {
    name: t(locale, "Helis Aksiyel Kuvvet Hesaplayıcı", "Helical Axial Force Calculator"),
    description: t(locale, "Helis açısı ve basınç açısıyla Fa hesaplar; yatak yük tahmini.", "Calculates Fa using helix and pressure angles; bearing load estimate."),
    status: "active",
    href: "/tools/gear-design/calculators/helix-axial-calculator",
    badge: t(locale, "Helis", "Helix"),
  },
  {
    name: t(locale, "Kontak Oranı Hesaplayıcı", "Contact Ratio Calculator"),
    description: t(locale, "e_alpha + e_beta (profil + overlap) ile temas sırasını tahmin eder.", "Estimates contact sequence with e_alpha + e_beta (profile + overlap)."),
    status: "active",
    href: "/tools/gear-design/calculators/contact-ratio-calculator",
    badge: t(locale, "Kontak", "Contact"),
  },
  {
    name: t(locale, "Yağ Viskozitesi Seçici", "Lubricant Viscosity Selector"),
    description: t(locale, "ks ve v değerlerine göre ISO VG ve yağlama yöntemi önerisi.", "ISO VG and lubrication method recommendation from ks and v values."),
    status: "active",
    href: "/tools/gear-design/calculators/viscosity-selector",
    badge: t(locale, "Yağlama", "Lubrication"),
  },
  {
    name: t(locale, "Dişli Ağırlığı / Gövde Optimizasyonu", "Gear Weight / Body Optimization"),
    description: t(locale, "Geometri + boşaltma/kaburga bilgisiyle ağırlık ve tasarruf tahmini.", "Weight and savings estimate using geometry + pocket/rib data."),
    status: "active",
    href: "/tools/gear-design/calculators/weight-optimization",
    badge: t(locale, "Ağırlık", "Weight"),
  },
  {
    name: t(locale, "Backlash Hesaplayıcı", "Backlash Calculator"),
    description: t(locale, "Min/nom/max backlash; modül, merkez mesafesi, sıcaklık girdisi.", "Min/nom/max backlash with module, center distance, and temperature input."),
    status: "active",
    href: "/tools/gear-design/calculators/backlash-calculator",
    badge: "Backlash",
  },
];

type GearCalculatorsClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function GearCalculatorsPage({ initialDocs }: GearCalculatorsClientProps) {
  const { locale } = useLocale();
  const calculators = getCalculators(locale);

  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators" initialDocs={initialDocs}>
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute right-0 top-0 hidden h-full w-1/3 md:block opacity-20 pointer-events-none mix-blend-multiply">
            <Image
              src={getBlueprintImageSrc("gear")}
              alt="Makine Montaj Blueprint"
              fill
              className="object-cover object-right"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
          <div className="relative space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                {t(locale, "Dişli Online Hesaplayıcılar", "Online Gear Calculators")}
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {t(locale, "Karttan seç, hesaplamaya başla", "Pick a card and start calculating")}
              </span>
            </div>
            <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
              {t(locale, "Hesaplayıcı kartlarını seç, “Kullan” ile ilgili sayfayı aç", "Choose a calculator card and open its page with “Use”")}
            </h1>
            <p className="text-sm leading-relaxed text-slate-700">
              {t(
                locale,
                "Her hesaplayıcı için bir kart var. “Kullan” butonu o aracın detayına gider; hesaplamaya başlayıp gerekirse açıklama veya görseller ekleyebilirsin.",
                "Each calculator has its own card. The “Use” button opens that tool page where you can start calculations and add notes or visuals if needed.",
              )}
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {calculators.map((calc) => (
            <article
              key={calc.name}
              className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="break-words text-sm font-semibold leading-snug text-slate-900">{calc.name}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      calc.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {calc.status === "active" ? t(locale, "Aktif", "Active") : t(locale, "Yakında", "Soon")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">{calc.badge}</span>
                </div>
                <p className="break-words text-[12px] leading-relaxed text-slate-700">{calc.description}</p>
                {calc.status === "active" && resolveToolId(calc.href) ? (
                  <ToolFavoriteButton toolId={resolveToolId(calc.href)} toolTitle={calc.name} size="sm" />
                ) : null}
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>{calc.status === "active" ? "" : t(locale, "Hazırlanacak", "Planned")}</span>
                {calc.status === "active" ? (
                  <Link
                    href={withLocalePrefix(calc.href, locale)}
                    className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                  >
                    {t(locale, "Kullan", "Use")}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500"
                  >
                    {t(locale, "Yakında", "Soon")}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      </ToolDocTabs>
    </PageShell>
  );
}
