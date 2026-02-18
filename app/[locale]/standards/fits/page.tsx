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
  intro: { title: string; body: string; bullets: string[] };
  table: { title: string; description: string; columns: string[] };
  notes: { title: string; items: string[] };
}> = {
  tr: {
    seo: {
      title: "Geçmeler | Standartlar",
      description: "ISO geçme sistemi için hızlı açıklama, H7/g6 gibi örnekler ve kısa tablo.",
    },
    hero: {
      title: "ISO geçmeler: hızlı yorumlama",
      description:
        "H7/g6, H7/h6, H7/p6 gibi yaygın geçmeleri kısa yorumlar ve uygulama notlarıyla toparlar.",
      eyebrow: "Standards",
      imageAlt: "ISO fits quick reference",
    },
    intro: {
      title: "Temel mantık",
      body: "Harf sapma konumunu, sayı ise tolerans sınıfını (IT) gösterir.",
      bullets: [
        "Büyük harf delik, küçük harf mil içindir.",
        "H deliği alt sapması 0 kabul edilir; h milin üst sapması 0 kabul edilir.",
        "Sayı küçüldükçe tolerans daha sıkı olur (IT6, IT7 gibi).",
      ],
    },
    table: {
      title: "Hızlı geçme tablosu",
      description: "Uygulama örnekleri: boşluklu, geçiş ve sıkı geçmeler.",
      columns: ["Geçme", "Tip", "Tipik kullanım"],
    },
    notes: {
      title: "Yorumlama ipuçları",
      items: [
        "H7/g6 genelde boşluklu geçmedir, kayar parçalar için uygun.",
        "H7/h6 hızlı konumlandırma için hafif boşluk verir.",
        "H7/k6 geçiş, H7/p6 sıkı geçme olarak kullanılır.",
      ],
    },
  },
  en: {
    seo: {
      title: "Fits | Standards",
      description: "ISO fit system quick guide with H7/g6 style examples and a small reference table.",
    },
    hero: {
      title: "ISO fits: quick interpretation",
      description:
        "Short notes for common fits like H7/g6, H7/h6, and H7/p6 with usage guidance.",
      eyebrow: "Standards",
      imageAlt: "ISO fits quick reference",
    },
    intro: {
      title: "Core idea",
      body: "The letter sets the fundamental deviation, the number is the tolerance grade (IT).",
      bullets: [
        "Uppercase = hole, lowercase = shaft.",
        "H hole has zero lower deviation; h shaft has zero upper deviation.",
        "Smaller IT number means tighter tolerance (IT6 vs IT7).",
      ],
    },
    table: {
      title: "Quick fit table",
      description: "Common clearance, transition, and interference examples.",
      columns: ["Fit", "Type", "Typical use"],
    },
    notes: {
      title: "Interpretation tips",
      items: [
        "H7/g6 is usually a clearance fit for sliding parts.",
        "H7/h6 gives small clearance for accurate location.",
        "H7/k6 is transition; H7/p6 is interference.",
      ],
    },
  },
};

const FIT_ROWS = [
  { fit: "H7/g6", type: { tr: "Boşluklu", en: "Clearance" }, use: { tr: "Kayar yüzeyler", en: "Sliding parts" } },
  { fit: "H7/h6", type: { tr: "Boşluklu", en: "Clearance" }, use: { tr: "Konumlama", en: "Location" } },
  { fit: "H7/k6", type: { tr: "Geçiş", en: "Transition" }, use: { tr: "Hafif press", en: "Light press" } },
  { fit: "H7/p6", type: { tr: "Sıkı", en: "Interference" }, use: { tr: "Sabit bağlantı", en: "Permanent joint" } },
];

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const seo = COPY[locale].seo;
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/standards/fits",
    locale,
  });
}

export default async function FitsStandardsPage({ params }: PageProps) {
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
        <h2 className="text-lg font-semibold text-slate-900">{copy.intro.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{copy.intro.body}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
          {copy.intro.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.table.title}</h2>
          <p className="text-sm text-slate-600">{copy.table.description}</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {copy.table.columns.map((col) => (
                  <th key={col} className="border-b border-slate-200 px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIT_ROWS.map((row) => (
                <tr key={row.fit} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-2 text-slate-700">{row.fit}</td>
                  <td className="px-4 py-2 text-slate-700">{row.type[locale]}</td>
                  <td className="px-4 py-2 text-slate-700">{row.use[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{copy.notes.title}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
          {copy.notes.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
