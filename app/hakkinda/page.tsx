import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import DeterministicDisclaimer from "@/components/shared/DeterministicDisclaimer";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "Hakkında",
  description: "Deterministik mühendislik hesaplayıcılar, standartlar ve raporlama altyapısı.",
  imageAlt: "TORQYX hakkında görsel",
  sections: {
    storyTitle: "Hikaye ve yaklaşım",
    storyBody: [
      "TORQYX, mekanik tasarım ve üretim kararları için mühendisler tarafından geliştirilen deterministik bir araç setidir.",
      "Amacımız; aynı girdilerle her zaman aynı sonucu veren, izlenebilir ve raporlanabilir hesaplar sunmak ve mühendislik kararlarını güvenle hızlandırmaktır.",
    ],
    methodologyTitle: "Metodoloji & Doğrulama",
    methodologyItems: [
      "ISO/DIN/ASME standartları, mühendislik el kitapları ve üretici veri sayfaları temel alınır.",
      "Birim tutarlılığı, sınır kontrolleri ve varsayımlar açık biçimde belirtilir.",
      "Örnek senaryolar ve çapraz kontrollerle çıktılar gözden geçirilir; değişiklikler changelog'da izlenir.",
    ],
    limitationsTitle: "Sınırlamalar & Sorumluluk Reddi",
    limitationsItems: [
      "Bu platform eğitim ve ön tasarım amaçlıdır; kritik uygulamalarda resmi standartlar ve tedarikçi verileri esas alınmalıdır.",
      "Malzeme seçimi, emniyet katsayıları, çalışma koşulları ve toleranslar sonuçları etkiler.",
      "Profesyonel mühendislik onayı veya sertifikasyon yerine geçmez.",
    ],
  },
};

const pageCopyEn = {
  title: "About",
  description: "Deterministic engineering calculators, standards, and reporting infrastructure.",
  imageAlt: "About TORQYX",
  sections: {
    storyTitle: "Story and approach",
    storyBody: [
      "TORQYX is a deterministic toolkit built by mechanical and manufacturing engineers.",
      "Our goal is to deliver repeatable, traceable calculations and report-ready outputs that accelerate real engineering decisions.",
    ],
    methodologyTitle: "Methodology & Validation",
    methodologyItems: [
      "Formulas are sourced from ISO/DIN/ASME standards, engineering handbooks, and manufacturer datasheets.",
      "Unit consistency, boundary checks, and explicit assumptions are built into every calculator.",
      "Sample scenarios and cross-checks are reviewed, and changes are tracked in the changelog.",
    ],
    limitationsTitle: "Limitations & Disclaimer",
    limitationsItems: [
      "This platform is for education and preliminary design; use official standards and supplier data for critical work.",
      "Materials, safety factors, operating conditions, and tolerances can change results.",
      "It does not replace professional engineering approval or certification.",
    ],
  },
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/hakkinda",
    locale,
    alternatesLanguages: null,
  });
}

export default async function AboutPage() {
  const locale = await getLocaleFromCookies();
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        imageSrc={HERO_PLACEHOLDER}
        imageAlt={copy.imageAlt}
      />

      <DeterministicDisclaimer locale={locale} />

      <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
        <section className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            {copy.title}
          </h1>
          <h2 className="text-lg font-semibold text-slate-900">{copy.sections.storyTitle}</h2>
          {copy.sections.storyBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{copy.sections.methodologyTitle}</h2>
          <ul className="list-disc space-y-1 pl-5">
            {copy.sections.methodologyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{copy.sections.limitationsTitle}</h2>
          <ul className="list-disc space-y-1 pl-5">
            {copy.sections.limitationsItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </article>
    </PageShell>
  );
}
