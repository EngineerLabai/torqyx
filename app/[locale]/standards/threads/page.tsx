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
  coarse: { title: string; body: string; bullets: string[] };
  fine: { title: string; body: string; bullets: string[] };
  pitch: { title: string; description: string; columns: string[] };
  drill: { title: string; formula: string; notes: string[] };
  iso: { title: string; notes: string[] };
}> = {
  tr: {
    seo: {
      title: "Metrik Dişler | Standartlar",
      description:
        "Metrik dişler için coarse/fine özet, hatve tablosu, kılavuz delik rehberi ve ISO notları.",
    },
    hero: {
      title: "Metrik Dişler: hızlı mühendis özeti",
      description:
        "Atölye ve tasarım kararlarına destek veren kısa tablo ve hatırlatmalar. Değerler tipik, kritik tasarımlar için standartları kontrol et.",
      eyebrow: "Standards",
      imageAlt: "Metric thread quick reference",
    },
    coarse: {
      title: "Coarse (standart hatve)",
      body: "Genel amaçlı, dayanımı ve toleransı daha geniştir. Çoğu cıvata bu seriyi kullanır.",
      bullets: [
        "Varsayılan seçenektir; M10 gibi yazılırsa coarse kabul edilir.",
        "Üretim ve montaj toleransları daha rahattır.",
        "Titreşimli ortamlarda lock-nut / yapıştırıcı önerilir.",
      ],
    },
    fine: {
      title: "Fine (ince hatve)",
      body: "İnce ayar ve daha fazla diş sayısı gereken durumlar için tercih edilir.",
      bullets: [
        "Aynı boyda daha yüksek sıkma hassasiyeti sağlar.",
        "İnce et kalınlıklı parçalarda daha uygundur.",
        "Kirlenmeye daha hassastır; temiz montaj ister.",
      ],
    },
    pitch: {
      title: "Hatve kısa tablosu",
      description: "Yaygın ölçüler için coarse/fine hatveler ve tipik kılavuz delik (coarse).",
      columns: ["Ölçü", "Coarse P (mm)", "Fine P (mm)", "Kılavuz delik (mm)"],
    },
    drill: {
      title: "Kılavuz delik rehberi",
      formula: "D_tap approx D_nominal - P",
      notes: [
        "Yaklaşık formülü 60-75% diş doluluğu için iyi başlangıç verir.",
        "Sert malzemede 0.1-0.2 mm büyütmek kılavuz ömrünü artırır.",
        "Kesici veri sayfası ve tolerans sınıfına göre teyit et.",
      ],
    },
    iso: {
      title: "ISO metrik diş notları",
      notes: [
        "M ifadesi 60 deg profil anlamına gelir.",
        "İç diş toleransı sıkça 6H / 6g kombinasyonudur.",
        "Hatve belirtilmezse coarse kabul edilir.",
      ],
    },
  },
  en: {
    seo: {
      title: "Metric Threads | Standards",
      description:
        "Coarse/fine overview, pitch snapshot, tap drill guidance, and ISO notes for metric threads.",
    },
    hero: {
      title: "Metric Threads: quick engineer notes",
      description:
        "Short tables and reminders for workshop checks and early design decisions. Values are typical; verify standards for critical work.",
      eyebrow: "Standards",
      imageAlt: "Metric thread quick reference",
    },
    coarse: {
      title: "Coarse (standard pitch)",
      body: "General purpose, forgiving in production and assembly. Most bolts default to coarse.",
      bullets: [
        "Default when pitch is not specified (ex: M10 means coarse).",
        "More robust to dirt and handling.",
        "Use lock features if vibration is expected.",
      ],
    },
    fine: {
      title: "Fine (smaller pitch)",
      body: "Chosen for finer adjustment, thin walls, or higher clamp sensitivity.",
      bullets: [
        "More threads engaged for the same length.",
        "Better for thin sections, but more sensitive to damage.",
        "Requires cleaner assembly conditions.",
      ],
    },
    pitch: {
      title: "Pitch snapshot",
      description: "Common sizes with coarse/fine pitches and typical tap drill for coarse.",
      columns: ["Size", "Coarse P (mm)", "Fine P (mm)", "Tap drill (mm)"],
    },
    drill: {
      title: "Tap drill guidance",
      formula: "D_tap approx D_nominal - P",
      notes: [
        "Quick rule for 60-75% thread engagement.",
        "Open up 0.1-0.2 mm in hard materials to reduce tool load.",
        "Confirm with cutter data and tolerance class.",
      ],
    },
    iso: {
      title: "ISO metric thread notes",
      notes: [
        "M indicates 60 deg metric profile.",
        "Common internal/external combo is 6H / 6g.",
        "If pitch is omitted, coarse is assumed.",
      ],
    },
  },
};

const PITCH_ROWS = [
  { size: "M6", coarse: "1.0", fine: "0.75", tap: "5.0" },
  { size: "M8", coarse: "1.25", fine: "1.0", tap: "6.8" },
  { size: "M10", coarse: "1.5", fine: "1.25", tap: "8.5" },
  { size: "M12", coarse: "1.75", fine: "1.5", tap: "10.2" },
  { size: "M16", coarse: "2.0", fine: "1.5", tap: "14.0" },
];

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const seo = COPY[locale].seo;
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/standards/threads",
    locale,
  });
}

export default async function ThreadsStandardsPage({ params }: PageProps) {
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

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.coarse.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{copy.coarse.body}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {copy.coarse.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.fine.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{copy.fine.body}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {copy.fine.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.pitch.title}</h2>
          <p className="text-sm text-slate-600">{copy.pitch.description}</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {copy.pitch.columns.map((col) => (
                  <th key={col} className="border-b border-slate-200 px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PITCH_ROWS.map((row) => (
                <tr key={row.size} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-2 text-slate-700">{row.size}</td>
                  <td className="px-4 py-2 text-slate-700">{row.coarse}</td>
                  <td className="px-4 py-2 text-slate-700">{row.fine}</td>
                  <td className="px-4 py-2 text-slate-700">{row.tap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.drill.title}</h2>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-700">
            {copy.drill.formula}
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {copy.drill.notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.iso.title}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {copy.iso.notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </PageShell>
  );
}
