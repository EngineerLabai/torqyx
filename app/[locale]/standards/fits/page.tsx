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
      title: "Gecmeler | Standartlar",
      description: "ISO gecme sistemi icin hizli aciklama, H7/g6 gibi ornekler ve kisa tablo.",
    },
    hero: {
      title: "ISO gecmeler: hizli yorumlama",
      description:
        "H7/g6, H7/h6, H7/p6 gibi yaygin gecmeleri kisa yorumlar ve uygulama notlariyla toparlar.",
      eyebrow: "Standards",
      imageAlt: "ISO fits quick reference",
    },
    intro: {
      title: "Temel mantik",
      body: "Harf sapma konumunu, sayi ise tolerans sinifini (IT) gosterir.",
      bullets: [
        "Buyuk harf delik, kucuk harf mil icindir.",
        "H deligi alt sapmasi 0 kabul edilir; h milin ust sapmasi 0 kabul edilir.",
        "Sayi kuculdukce tolerans daha siki olur (IT6, IT7 gibi).",
      ],
    },
    table: {
      title: "Hizli gecme tablosu",
      description: "Uygulama ornekleri: bosluklu, gecis ve sik gecmeler.",
      columns: ["Gecme", "Tip", "Tipik kullanim"],
    },
    notes: {
      title: "Yorumlama ipuclari",
      items: [
        "H7/g6 genelde bosluklu gecmedir, kayar parcalar icin uygun.",
        "H7/h6 hizli konumlandirma icin hafif bosluk verir.",
        "H7/k6 gecis, H7/p6 sik gecme olarak kullanilir.",
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
  { fit: "H7/g6", type: { tr: "Bosluklu", en: "Clearance" }, use: { tr: "Kayar yuzeyler", en: "Sliding parts" } },
  { fit: "H7/h6", type: { tr: "Bosluklu", en: "Clearance" }, use: { tr: "Konumlama", en: "Location" } },
  { fit: "H7/k6", type: { tr: "Gecis", en: "Transition" }, use: { tr: "Hafif press", en: "Light press" } },
  { fit: "H7/p6", type: { tr: "Sik", en: "Interference" }, use: { tr: "Sabit baglanti", en: "Permanent joint" } },
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
