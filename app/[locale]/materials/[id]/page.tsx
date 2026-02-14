import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { materials } from "@/src/data/materials";
import type { MaterialEntry } from "@/src/data/materials/types";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";
import { withLocalePrefix } from "@/utils/locale-path";
import { encodeToolState } from "@/utils/tool-share";
import { encodeSession } from "@/lib/sanityCheck/share";
import type { LabSession } from "@/lib/sanityCheck/types";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

const resolveLocale = (value?: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

const formatNumber = (value: number | null, locale: Locale, options?: Intl.NumberFormatOptions) => {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", options);
};

const formatWithUnit = (
  value: number | null,
  unit: string,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
) => {
  const formatted = formatNumber(value, locale, options);
  if (formatted === "—") return formatted;
  return `${formatted} ${unit}`;
};

const resolveBoltGrade = (yieldValue: number | null) => {
  if (!yieldValue || !Number.isFinite(yieldValue)) return null;
  if (yieldValue >= 1100) return "12.9";
  if (yieldValue >= 940) return "10.9";
  if (yieldValue >= 640) return "8.8";
  return null;
};

const buildSanitySession = (material: MaterialEntry, locale: Locale): LabSession => {
  const E = Math.round(material.E * 1000);
  const yieldValue = material.yield ?? null;
  const density = material.density;
  const hasYield = yieldValue !== null && Number.isFinite(yieldValue);

  const variables = [
    {
      id: "var-e",
      symbol: "E",
      name: locale === "tr" ? "Elastisite modulu" : "Young's modulus",
      description: locale === "tr" ? "Malzeme elastisite modulü" : "Material elastic modulus",
      value: E,
      unit: "MPa",
      min: Math.round(E * 0.9),
      max: Math.round(E * 1.1),
      distribution: "normal" as const,
    },
    {
      id: "var-rho",
      symbol: "rho",
      name: locale === "tr" ? "Yogunluk" : "Density",
      description: locale === "tr" ? "Malzeme yogunlugu" : "Material density",
      value: density,
      unit: "kg/m3",
      min: Math.round(density * 0.95),
      max: Math.round(density * 1.05),
      distribution: "normal" as const,
    },
  ];

  if (hasYield) {
    variables.splice(1, 0, {
      id: "var-re",
      symbol: "Re",
      name: locale === "tr" ? "Akma dayanimi" : "Yield strength",
      description: locale === "tr" ? "Malzeme akma dayanimi" : "Material yield strength",
      value: Number(yieldValue),
      unit: "MPa",
      min: Math.round(Number(yieldValue) * 0.9),
      max: Math.round(Number(yieldValue) * 1.1),
      distribution: "normal" as const,
    });
  }

  return {
    title: locale === "tr" ? `${material.name} malzeme kontrolu` : `${material.name} material check`,
    variables,
    formula: hasYield ? "sigma_allow = Re / 1.5" : "E",
    expectedUnit: "MPa",
    sweep: {
      variableId: hasYield ? "var-re" : "var-e",
      points: 50,
    },
    monteCarlo: {
      iterations: 1000,
    },
  };
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, id } = await params;
  const locale = resolveLocale(localeParam);
  const copy = getMessages(locale).pages.materials;
  const brandContent = getBrandCopy(locale);
  const material = materials.find((item) => item.id === id);

  if (!material) {
    const notFoundCopy = getMessages(locale).pages.notFound;
    return buildPageMetadata({
      title: `${notFoundCopy.title} | ${brandContent.siteName}`,
      description: notFoundCopy.description,
      path: `/materials/${id}`,
      locale,
    });
  }

  const description =
    locale === "tr"
      ? `${material.name} icin tipik malzeme ozellikleri, yogunluk, elastisite modulü ve dayanım degerleri.`
      : `Typical properties for ${material.name}, including density, modulus, and strength values.`;

  return buildPageMetadata({
    title: `${material.name} | ${copy.title}`,
    description,
    path: `/materials/${material.id}`,
    locale,
  });
}

export default async function MaterialDetailPage({ params }: PageProps) {
  const { locale: localeParam, id } = await params;
  const locale = resolveLocale(localeParam);
  const copy = getMessages(locale).pages.materials;
  const material = materials.find((item) => item.id === id);

  if (!material) {
    notFound();
  }

  const categoryLabel = copy.categories[material.category] ?? material.category;
  const backHref = withLocalePrefix("/materials", locale);

  const boltGrade = resolveBoltGrade(material.yield);
  const boltInput = boltGrade ? { grade: boltGrade } : {};
  const boltEncoded = encodeToolState(boltInput);
  const boltHref = boltEncoded
    ? `${withLocalePrefix("/tools/bolt-calculator", locale)}?input=${boltEncoded}`
    : withLocalePrefix("/tools/bolt-calculator", locale);

  const beamInput: Record<string, unknown> = {
    youngModulus: Math.round(material.E * 1000),
  };
  if (material.yield !== null && Number.isFinite(material.yield)) {
    beamInput.yieldStrength = material.yield;
  }
  const beamEncoded = encodeToolState(beamInput);
  const beamHref = beamEncoded
    ? `${withLocalePrefix("/tools/bending-stress", locale)}?input=${beamEncoded}`
    : withLocalePrefix("/tools/bending-stress", locale);

  const sanitySession = buildSanitySession(material, locale);
  const sanityEncoded = encodeSession(sanitySession);
  const sanityHref = sanityEncoded
    ? `${withLocalePrefix("/tools/sanity-check", locale)}?session=${sanityEncoded}`
    : withLocalePrefix("/tools/sanity-check", locale);

  return (
    <PageShell>
      <article className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Link href={backHref} className="text-xs font-semibold text-emerald-700 hover:underline">
            {copy.detail.back}
          </Link>
          <div className="mt-4 space-y-3">
            <div className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {copy.detail.badge}
            </div>
            <h1 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">{material.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-700">
                {copy.labels.standard}: {material.standard}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-700">
                {copy.labels.category}: {categoryLabel}
              </span>
            </div>
            <p className="text-sm text-slate-600">{copy.detail.subtitle}</p>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-900">{copy.detail.propertiesTitle}</h2>
              <p className="text-xs text-slate-600">{copy.detail.propertiesDescription}</p>
            </div>
            <dl className="mt-4 space-y-2 text-xs text-slate-600">
              <PropertyRow
                label={copy.labels.density}
                value={formatWithUnit(material.density, "kg/m3", locale, { maximumFractionDigits: 0 })}
              />
              <PropertyRow
                label={copy.labels.E}
                value={formatWithUnit(material.E, "GPa", locale, { maximumFractionDigits: 1 })}
              />
              <PropertyRow
                label={copy.labels.G}
                value={formatWithUnit(material.G, "GPa", locale, { maximumFractionDigits: 1 })}
              />
              <PropertyRow
                label={copy.labels.yield}
                value={formatWithUnit(material.yield, "MPa", locale, { maximumFractionDigits: 0 })}
              />
              <PropertyRow
                label={copy.labels.UTS}
                value={formatWithUnit(material.UTS, "MPa", locale, { maximumFractionDigits: 0 })}
              />
              <PropertyRow
                label={copy.labels.alpha}
                value={formatWithUnit(material.alpha, "um/m-K", locale, { maximumFractionDigits: 2 })}
              />
            </dl>
          </section>

          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-700 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">{copy.detail.notesTitle}</h2>
              <p className="mt-2">{material.notes || copy.detail.notesEmpty}</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-900">{copy.detail.useTitle}</h2>
                <p className="text-xs text-slate-600">{copy.detail.useDescription}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={boltHref}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {copy.detail.useBolt}
                </Link>
                <Link
                  href={beamHref}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {copy.detail.useBeam}
                </Link>
                <Link
                  href={sanityHref}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {copy.detail.useSanity}
                </Link>
              </div>
            </section>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">{copy.detail.sourcesTitle}</h2>
            <p className="text-xs text-slate-600">{copy.detail.sourcesDescription}</p>
          </div>
          {material.sources && material.sources.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-700">
              {material.sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-slate-500">{copy.detail.sourcesEmpty}</p>
          )}
        </section>
      </article>
    </PageShell>
  );
}

function PropertyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-mono text-slate-900">{value}</dd>
    </div>
  );
}
