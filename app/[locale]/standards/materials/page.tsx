import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getHeroImageSrc } from "@/lib/assets";
import { buildPageMetadata } from "@/utils/metadata";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

type MaterialCard = {
  name: string;
  details: string;
  properties: Array<{ label: string; value: string }>;
};

const resolveLocale = (value?: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

const COPY: Record<Locale, {
  seo: { title: string; description: string };
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  note: string;
  groups: Array<{ id: string; title: string; cards: MaterialCard[] }>;
}> = {
  tr: {
    seo: {
      title: "Malzemeler | Standartlar",
      description: "Çelik, alüminyum ve paslanmaz için hızlı karşılaştırma kartları ve tipik özellikler.",
    },
    hero: {
      title: "Malzeme karşılaştırma: hızlı notlar",
      description:
        "Taslak seçim için tipik malzeme aralıkları. Nihai tasarımda tedarikçi veri sayfasını kontrol et.",
      eyebrow: "Standards",
      imageAlt: "Materials quick comparison",
    },
    note: "Değerler oda sıcaklığında tipiktir. Isıl işlem, kesit ve standartlara göre değişebilir.",
    groups: [
      {
        id: "steel",
        title: "Çelik (yapısal ve genel)",
        cards: [
          {
            name: "S235JR",
            details: "Genel yapı çeliği, kaynaklanabilir.",
            properties: [
              { label: "Akma (MPa)", value: "235" },
              { label: "Çekme (MPa)", value: "360-510" },
              { label: "Yoğunluk (g/cm3)", value: "7.85" },
            ],
          },
          {
            name: "S355JR",
            details: "Daha yüksek dayanımlı yapısal çelik.",
            properties: [
              { label: "Akma (MPa)", value: "355" },
              { label: "Çekme (MPa)", value: "470-630" },
              { label: "Yoğunluk (g/cm3)", value: "7.85" },
            ],
          },
          {
            name: "C45 (1045)",
            details: "İşlemeye uygun orta karbon.",
            properties: [
              { label: "Akma (MPa)", value: "310-450" },
              { label: "Çekme (MPa)", value: "570-700" },
              { label: "Yoğunluk (g/cm3)", value: "7.85" },
            ],
          },
        ],
      },
      {
        id: "aluminum",
        title: "Alüminyum",
        cards: [
          {
            name: "6061-T6",
            details: "Genel amaç, iyi işlenebilirlik.",
            properties: [
              { label: "Akma (MPa)", value: "240-275" },
              { label: "Çekme (MPa)", value: "290-310" },
              { label: "Yoğunluk (g/cm3)", value: "2.70" },
            ],
          },
          {
            name: "6082-T6",
            details: "Avrupa yaygın, yapısal profil.",
            properties: [
              { label: "Akma (MPa)", value: "250-260" },
              { label: "Çekme (MPa)", value: "300-320" },
              { label: "Yoğunluk (g/cm3)", value: "2.70" },
            ],
          },
          {
            name: "7075-T6",
            details: "Yüksek dayanım, havacılık.",
            properties: [
              { label: "Akma (MPa)", value: "500-540" },
              { label: "Çekme (MPa)", value: "560-610" },
              { label: "Yoğunluk (g/cm3)", value: "2.81" },
            ],
          },
        ],
      },
      {
        id: "stainless",
        title: "Paslanmaz",
        cards: [
          {
            name: "304",
            details: "Genel amaç, iyi korozyon direnci.",
            properties: [
              { label: "Akma (MPa)", value: "200-215" },
              { label: "Çekme (MPa)", value: "500-700" },
              { label: "Yoğunluk (g/cm3)", value: "7.9" },
            ],
          },
          {
            name: "316",
            details: "Klorlu ortamlar için daha iyi.",
            properties: [
              { label: "Akma (MPa)", value: "200-205" },
              { label: "Çekme (MPa)", value: "500-700" },
              { label: "Yoğunluk (g/cm3)", value: "8.0" },
            ],
          },
          {
            name: "430",
            details: "Ferritik, düşük maliyetli.",
            properties: [
              { label: "Akma (MPa)", value: "170-230" },
              { label: "Çekme (MPa)", value: "450-600" },
              { label: "Yoğunluk (g/cm3)", value: "7.7" },
            ],
          },
        ],
      },
    ],
  },
  en: {
    seo: {
      title: "Materials | Standards",
      description: "Quick comparison cards for steels, aluminum, and stainless with typical properties.",
    },
    hero: {
      title: "Material comparison: quick notes",
      description:
        "Typical ranges for early selection. For final design, always check supplier data sheets.",
      eyebrow: "Standards",
      imageAlt: "Materials quick comparison",
    },
    note: "Values are typical at room temperature. Heat treatment and standards can shift them.",
    groups: [
      {
        id: "steel",
        title: "Steel (structural and general)",
        cards: [
          {
            name: "S235JR",
            details: "General structural steel, weldable.",
            properties: [
              { label: "Yield (MPa)", value: "235" },
              { label: "Tensile (MPa)", value: "360-510" },
              { label: "Density (g/cm3)", value: "7.85" },
            ],
          },
          {
            name: "S355JR",
            details: "Higher strength structural steel.",
            properties: [
              { label: "Yield (MPa)", value: "355" },
              { label: "Tensile (MPa)", value: "470-630" },
              { label: "Density (g/cm3)", value: "7.85" },
            ],
          },
          {
            name: "C45 (1045)",
            details: "Medium carbon, good machinability.",
            properties: [
              { label: "Yield (MPa)", value: "310-450" },
              { label: "Tensile (MPa)", value: "570-700" },
              { label: "Density (g/cm3)", value: "7.85" },
            ],
          },
        ],
      },
      {
        id: "aluminum",
        title: "Aluminum",
        cards: [
          {
            name: "6061-T6",
            details: "General purpose, good machinability.",
            properties: [
              { label: "Yield (MPa)", value: "240-275" },
              { label: "Tensile (MPa)", value: "290-310" },
              { label: "Density (g/cm3)", value: "2.70" },
            ],
          },
          {
            name: "6082-T6",
            details: "Common in EU, structural profiles.",
            properties: [
              { label: "Yield (MPa)", value: "250-260" },
              { label: "Tensile (MPa)", value: "300-320" },
              { label: "Density (g/cm3)", value: "2.70" },
            ],
          },
          {
            name: "7075-T6",
            details: "High strength, aerospace.",
            properties: [
              { label: "Yield (MPa)", value: "500-540" },
              { label: "Tensile (MPa)", value: "560-610" },
              { label: "Density (g/cm3)", value: "2.81" },
            ],
          },
        ],
      },
      {
        id: "stainless",
        title: "Stainless",
        cards: [
          {
            name: "304",
            details: "General purpose corrosion resistance.",
            properties: [
              { label: "Yield (MPa)", value: "200-215" },
              { label: "Tensile (MPa)", value: "500-700" },
              { label: "Density (g/cm3)", value: "7.9" },
            ],
          },
          {
            name: "316",
            details: "Better in chloride environments.",
            properties: [
              { label: "Yield (MPa)", value: "200-205" },
              { label: "Tensile (MPa)", value: "500-700" },
              { label: "Density (g/cm3)", value: "8.0" },
            ],
          },
          {
            name: "430",
            details: "Ferritic, cost-effective.",
            properties: [
              { label: "Yield (MPa)", value: "170-230" },
              { label: "Tensile (MPa)", value: "450-600" },
              { label: "Density (g/cm3)", value: "7.7" },
            ],
          },
        ],
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const seo = COPY[locale].seo;
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/standards/materials",
    locale,
  });
}

export default async function MaterialsStandardsPage({ params }: PageProps) {
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        {copy.note}
      </section>

      {copy.groups.map((group) => (
        <section key={group.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{group.title}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {group.cards.map((card) => (
              <article
                key={card.name}
                className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-slate-900">{card.name}</h3>
                  <p className="text-sm text-slate-600">{card.details}</p>
                </div>
                <dl className="mt-4 space-y-2 text-xs text-slate-700">
                  {card.properties.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                      <dt className="text-slate-500">{item.label}</dt>
                      <dd className="font-mono text-slate-900">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
