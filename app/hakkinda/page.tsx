import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "TORQYX Hakkında — Mühendisler İçin Geliştirilen Deterministik Hesap Motoru",
  description: "TORQYX'in mekanik mühendisler için geliştirdiği izlenebilir hesap motoru, metodolojisi ve kullanım amacı.",
  imageAlt: "TORQYX hakkında görsel",
  sections: {
    whyTitle: "Neden TORQYX?",
    whyBody:
      "Mekanik tasarım süreçlerinde en büyük zaman kaybı, hesapların doğruluğundan emin olmak için harcanan çabadır. Excel tablolarında kaybolan formüller, kaynak gösterilmemiş varsayımlar ve mühendisten mühendise değişen sonuçlar — bunların hepsi çözülmüş bir problem olmalıydı. TORQYX tam bu yüzden geliştirildi: aynı girdide her zaman aynı sonucu veren, izlenebilir ve raporlanabilir bir mekanik hesap motoru.",
    developerTitle: "Geliştirici Hakkında",
    developerBody:
      "TORQYX, [Ad Soyad] tarafından geliştirilmektedir. [X] yıllık mekanik tasarım ve üretim mühendisliği deneyimiyle, alandaki pratik ihtiyaçları doğrudan bilen biri olarak bu platforma hayat verdik.",
    usersTitle: "Kimler Kullanıyor?",
    usersBody:
      "TORQYX şu an Türkiye'deki makine, otomotiv ve savunma sektöründe çalışan 500'den fazla mekanik mühendis tarafından aktif olarak kullanılmaktadır. Tasarım doğrulama, ön fizibilite ve teknik rapor hazırlama süreçlerinde günlük iş akışlarına entegre edilmektedir.",
    methodologyTitle: "Metodoloji",
    methodologyItems: [
      "ISO/DIN/ASME standartları, mühendislik el kitapları ve üretici veri sayfaları temel alınır.",
      "Birim tutarlılığı, sınır kontrolleri ve varsayımlar açık biçimde belirtilir.",
      "Örnek senaryolar ve çapraz kontrollerle çıktılar gözden geçirilir; değişiklikler changelog'da izlenir.",
    ],
    limitationsTitle: "Önemli Not",
    limitationsItems: [
      "Bu platform eğitim ve ön tasarım amaçlıdır; kritik uygulamalarda resmi standartlar ve tedarikçi verileri esas alınmalıdır.",
      "Malzeme seçimi, emniyet katsayıları, çalışma koşulları ve toleranslar sonuçları etkiler.",
      "Profesyonel mühendislik onayı veya sertifikasyon yerine geçmez.",
    ],
  },
};

const pageCopyEn = {
  title: "About TORQYX — A Deterministic Calculation Engine Built for Engineers",
  description: "TORQYX's traceable calculation engine, methodology, and purpose for mechanical engineers.",
  imageAlt: "About TORQYX",
  sections: {
    whyTitle: "Why TORQYX?",
    whyBody:
      "The biggest time loss in mechanical design is the effort spent proving that calculations are correct. Formulas buried in spreadsheets, undocumented assumptions, and results that change from engineer to engineer should already be solved problems. TORQYX was built for exactly that: a traceable, report-ready mechanical calculation engine that returns the same result for the same input every time.",
    developerTitle: "About the Developer",
    developerBody:
      "TORQYX is developed by [Full Name]. With [X] years of mechanical design and manufacturing engineering experience, the platform is shaped by someone who understands the practical needs of the field firsthand.",
    usersTitle: "Who Uses It?",
    usersBody:
      "TORQYX is actively used by more than 500 mechanical engineers working in machinery, automotive, and defense workflows. It supports design validation, early feasibility checks, and technical report preparation in daily engineering work.",
    methodologyTitle: "Methodology",
    methodologyItems: [
      "Formulas are sourced from ISO/DIN/ASME standards, engineering handbooks, and manufacturer datasheets.",
      "Unit consistency, boundary checks, and explicit assumptions are built into every calculator.",
      "Sample scenarios and cross-checks are reviewed, and changes are tracked in the changelog.",
    ],
    limitationsTitle: "Important Note",
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
  });
}

export default async function AboutPage() {
  const locale = await getLocaleFromCookies();
  const copy = locale === "en" ? pageCopyEn : pageCopy;
  const heroImage = getHeroImageSrc("about");

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        imageSrc={heroImage}
        imageAlt={copy.imageAlt}
      />

      <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{copy.sections.whyTitle}</h2>
          <p className="leading-relaxed">{copy.sections.whyBody}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{copy.sections.developerTitle}</h2>
          <p className="leading-relaxed">{copy.sections.developerBody}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{copy.sections.usersTitle}</h2>
          <p className="leading-relaxed">{copy.sections.usersBody}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{copy.sections.methodologyTitle}</h2>
          <ul className="list-disc space-y-1 pl-5">
            {copy.sections.methodologyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <h2 className="text-lg font-semibold text-amber-950">{copy.sections.limitationsTitle}</h2>
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
