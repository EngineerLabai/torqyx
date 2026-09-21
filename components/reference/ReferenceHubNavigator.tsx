import Link from "next/link";
import type { Locale } from "@/utils/locale";
import { withLocalePrefix } from "@/utils/locale-path";

type LocalizedCopy = { tr: string; en: string };

type HubLink = {
  href: string;
  title: LocalizedCopy;
  description: LocalizedCopy;
};

const referenceLinks: HubLink[] = [
  {
    href: "/reference#threads",
    title: { tr: "Dişler ve cıvata delikleri", en: "Threads and bolt holes" },
    description: {
      tr: "Metrik hatve, gerilme alanı, kılavuz deliği ve boşluk deliği özetleri.",
      en: "Metric pitch, stress area, tap drill, and clearance-hole summaries.",
    },
  },
  {
    href: "/reference#fits",
    title: { tr: "Geçmeler ve toleranslar", en: "Fits and tolerances" },
    description: {
      tr: "H7/g6, H7/k6 ve diğer yaygın geçmeler için seçim odaklı notlar.",
      en: "Selection notes for H7/g6, H7/k6, and other common fits.",
    },
  },
  {
    href: "/reference#materials",
    title: { tr: "Malzemeler", en: "Materials" },
    description: {
      tr: "Tipik malzeme özellikleri; teslim durumu ve standartla değişebilecek değerler açıkça işaretlenir.",
      en: "Typical material properties, with values that vary by delivery condition and standard clearly marked.",
    },
  },
  {
    href: "/reference#hardness",
    title: { tr: "Sertlik", en: "Hardness" },
    description: {
      tr: "Mevcut dönüşüm ve karşılaştırma tablosuna hızlı erişim.",
      en: "Quick access to the available conversion and comparison table.",
    },
  },
  {
    href: "/reference#surface-finish",
    title: { tr: "Yüzey kalitesi", en: "Surface finish" },
    description: {
      tr: "Ra ve yüzey işleme notları için pratik referans.",
      en: "Practical reference for Ra and surface-finishing notes.",
    },
  },
  {
    href: "/standards",
    title: { tr: "Standartlar", en: "Standards" },
    description: {
      tr: "Mevcut standart özetleri ve ilgili teknik tablolar.",
      en: "Available standards overviews and related technical tables.",
    },
  },
];

const toolLinks: HubLink[] = [
  {
    href: "/tools/tolerance-lab",
    title: { tr: "Tolerance Lab", en: "Tolerance Lab" },
    description: {
      tr: "Doğrusal tolerans zincirini worst-case, RSS ve hassasiyet görünümüyle inceleyin.",
      en: "Inspect linear tolerance stacks with worst-case, RSS, and sensitivity views.",
    },
  },
  {
    href: "/tools/bolt-calculator",
    title: { tr: "Cıvata boyut ve tork", en: "Bolt size and torque" },
    description: {
      tr: "Metrik diş referanslarını ön yük ve tork hesabına bağlayın.",
      en: "Connect metric thread references to preload and torque calculations.",
    },
  },
  {
    href: "/tools/bearing-life",
    title: { tr: "Rulman ömrü", en: "Bearing life" },
    description: {
      tr: "C, P, devir ve rulman tipinden L10/L10h hesaplayın.",
      en: "Calculate L10/L10h from C, P, speed, and bearing type.",
    },
  },
  {
    href: "/tools/material-cards",
    title: { tr: "Malzeme kartları", en: "Material cards" },
    description: {
      tr: "Referans verisini malzeme karşılaştırma ve seçim akışına taşıyın.",
      en: "Move from reference data into material comparison and selection.",
    },
  },
];

const copy = {
  tr: {
    eyebrow: "REFERANS YOLLARI",
    title: "Veriden doğru hesap aracına ilerleyin",
    description:
      "Tablodan başlayın, ilgili aracı açın ve karar öncesinde proje koşullarını doğrulayın. Yalnızca TORQYX’te mevcut olan veri ve araçlar gösterilir.",
    referenceTitle: "Hızlı referanslar",
    toolsTitle: "İlgili hesap araçları",
  },
  en: {
    eyebrow: "REFERENCE PATHS",
    title: "Move from data to the right calculation tool",
    description:
      "Start with a table, open the related tool, and verify project conditions before making a decision. Only data and tools available in TORQYX are shown.",
    referenceTitle: "Quick references",
    toolsTitle: "Related calculation tools",
  },
} satisfies Record<Locale, Record<string, string>>;

function LinkGrid({ links, locale }: { links: HubLink[]; locale: Locale }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={withLocalePrefix(link.href, locale)}
          className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          <h2 className="text-sm font-semibold text-slate-900">{link.title[locale]}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{link.description[locale]}</p>
        </Link>
      ))}
    </div>
  );
}

export default function ReferenceHubNavigator({ locale }: { locale: Locale }) {
  const localizedCopy = copy[locale];

  return (
    <section className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="max-w-3xl space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{localizedCopy.eyebrow}</p>
        <h2 className="text-2xl font-semibold text-slate-900">{localizedCopy.title}</h2>
        <p className="text-sm leading-relaxed text-slate-600">{localizedCopy.description}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{localizedCopy.referenceTitle}</h2>
        <LinkGrid links={referenceLinks} locale={locale} />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{localizedCopy.toolsTitle}</h2>
        <LinkGrid links={toolLinks} locale={locale} />
      </div>
    </section>
  );
}
