import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getHeroImageSrc } from "@/lib/assets";
import { buildPageMetadata } from "@/utils/metadata";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const resolveLocale = (value?: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

const COPY: Record<Locale, {
  seo: { title: string; description: string };
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  props: { title: string; description: string; columns: string[] };
  darcy: { title: string; formula: string; notes: string[] };
}> = {
  tr: {
    seo: {
      title: "Akışkanlar | Standartlar",
      description: "Akışkan özellikleri için hızlı referans tablosu ve Darcy-Weisbach özet.",
    },
    hero: {
      title: "Akışkanlar: hızlı özellik tablosu",
      description:
        "Hızlı debi ve basınç düşümü hesapları için tipik yoğunluk ve viskozite aralıkları.",
      eyebrow: "Standards",
      imageAlt: "Fluids quick reference",
    },
    props: {
      title: "Tipik özellikler (20C civarı)",
      description: "Değerler referans aralığıdır; proses şartları ile değişir.",
      columns: ["Akışkan", "Yoğunluk (kg/m3)", "Dinamik viskozite (mPa.s)", "Not"],
    },
    darcy: {
      title: "Darcy-Weisbach hızlı özet",
      formula: "DeltaP = f * (L/D) * (rho * v^2 / 2)",
      notes: [
        "Re < 2300: f = 64 / Re (laminer).",
        "2300-4000: geçiş bölgesi, dikkatli yorumla.",
        "Re > 4000: Moody / Swamee-Jain ile f hesapla.",
        "Bağıl pürüzlülük (epsilon/D) f değerini etkiler.",
      ],
    },
  },
  en: {
    seo: {
      title: "Fluids | Standards",
      description: "Quick fluid property table and Darcy-Weisbach reference for pressure drop.",
    },
    hero: {
      title: "Fluids: quick property reference",
      description:
        "Typical density and viscosity ranges to support early flow and pressure drop checks.",
      eyebrow: "Standards",
      imageAlt: "Fluids quick reference",
    },
    props: {
      title: "Typical properties (around 20C)",
      description: "Reference ranges only; process conditions can shift them.",
      columns: ["Fluid", "Density (kg/m3)", "Dynamic viscosity (mPa.s)", "Note"],
    },
    darcy: {
      title: "Darcy-Weisbach quick reference",
      formula: "DeltaP = f * (L/D) * (rho * v^2 / 2)",
      notes: [
        "Re < 2300: f = 64 / Re (laminar).",
        "2300-4000: transition region, use caution.",
        "Re > 4000: compute f via Moody / Swamee-Jain.",
        "Relative roughness (epsilon/D) shifts f.",
      ],
    },
  },
};

const FLUID_ROWS = [
  {
    name: { tr: "Su", en: "Water" },
    density: "998",
    viscosity: "1.0",
    note: { tr: "Temiz su, 20C", en: "Clean water, 20C" },
  },
  {
    name: { tr: "Hava", en: "Air" },
    density: "1.2",
    viscosity: "0.018",
    note: { tr: "1 atm", en: "1 atm" },
  },
  {
    name: { tr: "Hidrolik yağ", en: "Hydraulic oil" },
    density: "860-900",
    viscosity: "40-80",
    note: { tr: "ISO VG 46 civarı", en: "Around ISO VG 46" },
  },
  {
    name: { tr: "Hafif mineral yağ", en: "Light mineral oil" },
    density: "830-870",
    viscosity: "10-30",
    note: { tr: "Genel referans", en: "General reference" },
  },
];

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const seo = COPY[locale].seo;
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/standards/fluids",
    locale,
  });
}

export default async function FluidsStandardsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const copy = COPY[locale];
  const heroImage = getHeroImageSrc("tools");

  return (
    <PageShell>
      <PageHero
        title={copy.hero.title}
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        imageSrc={heroImage}
        imageAlt={copy.hero.imageAlt}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.props.title}</h2>
          <p className="text-sm text-slate-600">{copy.props.description}</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {copy.props.columns.map((col) => (
                  <th key={col} className="border-b border-slate-200 px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FLUID_ROWS.map((row) => (
                <tr key={row.name.en} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-2 text-slate-700">{row.name[locale]}</td>
                  <td className="px-4 py-2 text-slate-700">{row.density}</td>
                  <td className="px-4 py-2 text-slate-700">{row.viscosity}</td>
                  <td className="px-4 py-2 text-slate-700">{row.note[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{copy.darcy.title}</h2>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-700">
          {copy.darcy.formula}
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
          {copy.darcy.notes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
