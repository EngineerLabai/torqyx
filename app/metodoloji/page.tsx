import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopyTr = {
  title: "Hesaplama Metodolojisi ve Doğrulama",
  description:
    "TORQYX'in deterministik mühendislik hesaplama yaklaşımı: formül kaynakları, standart referansları, otomatik test kapsamı ve doğrulama süreci.",
  imageAlt: "Hesaplama metodolojisi görseli",
};

const pageCopyEn = {
  title: "Calculation Methodology & Validation",
  description:
    "TORQYX's deterministic engineering calculation approach: formula sources, standard references, automated test coverage, and validation process.",
  imageAlt: "Calculation methodology visual",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = locale === "en" ? pageCopyEn : pageCopyTr;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/metodoloji",
    locale,
  });
}

const contentTr = {
  updated: "Son güncelleme: Kasım 2026",
  intro:
    "TORQYX, makine mühendisliği hesaplamalarında şeffaflık, tekrarlanabilirlik ve bağımsız doğrulanabilirlik ilkelerini temel alır. Bu sayfa, platformdaki tüm hesaplayıcıların nasıl geliştirildiğini, hangi standartlara dayandığını ve nasıl doğrulandığını açıklamaktadır.",
  sections: [
    {
      id: "approach",
      title: "1. Hesaplama Yaklaşımı",
      paragraphs: [
        "Tüm TORQYX araçları deterministik algoritmalar üzerine kuruludur: aynı girdiler her zaman aynı fiziksel çıktıyı üretir. Olasılıksal veya yaklaşımlı yöntemler kullanılmaz; her hesaplama adımı analitik fizik denklemlerine dayanır.",
        "Formüller kapalı kutu değildir. Kullanılan fiziksel eşitlikler ve ara hesaplama adımları, her araçta matematiksel notasyonla açıkça gösterilir. Kullanıcı, sonuca nasıl ulaşıldığını adım adım izleyebilir.",
        "Birim tutarlılığı platform genelinde zorunlu kılınmıştır. SI (metrik) ve US Customary (inç, pound) sistemleri arasındaki dönüşümler ISO standart katsayılarıyla yürütülür; birim hatalarından kaynaklanan hesaplama hataları sistematik olarak önlenir.",
      ],
    },
    {
      id: "sources",
      title: "2. Formül ve Standart Kaynakları",
      paragraphs: [
        "TORQYX'teki her formül, uluslararası kabul görmüş standartlara ve akademik kaynaklara dayandırılmaktadır. Başlıca referans kaynakları şunlardır:",
      ],
      bullets: [
        "ISO 286 — Tolerans sistemleri ve uyumlar (IT dereceleri, temel sapma)",
        "ISO 2768 — Genel toleranslar (doğrusal ve açısal boyutlar)",
        "ISO 898 / DIN 267 — Bağlantı elemanları mekanik özellikleri ve cıvata hesabı",
        "Eurocode 3 / DIN 18800 — Kaynaklı bağlantılar ve yapısal çelik hesabı",
        "ASME B1.1 / B18.2 — İnç vida dizisi ve bağlantı elemanı standartları",
        "VDI 2230 — Yüksek mukavemetli cıvatalı bağlantıların hesabı",
        "Darcy-Weisbach denklemi — Boru sürtünme kayıpları",
        "Shigley's Mechanical Engineering Design — Şaft, yay ve makine elemanı hesapları",
        "Roark's Formulas for Stress and Strain — Gerilme ve şekil değiştirme referansı",
        "Beer & Johnston: Mechanics of Materials — Temel mukavemet formülleri",
      ],
    },
    {
      id: "testing",
      title: "3. Test Kapsamı (412+ Vitest Birimi)",
      paragraphs: [
        "Her hesaplayıcı, Vitest çerçevesiyle yazılmış otomatik birim testleriyle kapsanmaktadır. Kasım 2026 itibarıyla test paketinde 412'den fazla bireysel test bulunmaktadır.",
        "Testler şu senaryoları kapsar: (a) akademik literatürdeki çözümlü örnek problemlerle çapraz doğrulama, (b) sınır koşulları (sıfır, negatif, aşırı büyük değerler), (c) birim dönüşüm doğruluğu, (d) giriş validasyonu ve hata işleme, (e) sürüm güncellemelerinde geriye dönük tutarlılık.",
        "CI/CD boru hattında (GitHub Actions) her pull request otomatik olarak testlerden geçirilir. Test paketi başarısız olan hiçbir değişiklik `main` dalına birleştirilmez.",
      ],
    },
    {
      id: "validation",
      title: "4. Doğrulama Süreci",
      paragraphs: [
        "Hesaplayıcıların doğrulanması iki aşamalıdır. İlk aşamada, geliştirici tarafından formüller akademik veya standart kaynaktaki referans çözümle manuel olarak karşılaştırılır ve kod seviyesinde birim testi yazılır.",
        "İkinci aşamada, ilgili mühendislik masasındaki uzmanlar (Mekanik Tasarım, İmalat ve Tolerans, Termal ve Akışkan Sistemleri, Yazılım Algoritma) sonuçları gerçek proje değerleriyle ya da ticari simülasyon yazılımı çıktılarıyla karşılaştırarak bağımsız doğrulama gerçekleştirir.",
        "Hesaplama kapsamını aşan veya doğrulanmamış sonuçlar kullanıcıya açıkça uyarı mesajıyla bildirilir.",
      ],
    },
    {
      id: "editorial",
      title: "5. Yazar ve Editör Bilgisi",
      paragraphs: [
        "TORQYX platformundaki tüm araçlar, rehberler ve teknik içerikler; makine mühendisliği, mekanik tasarım, imalat yöntemleri ve yazılım güvenilirliği alanlarında uzmanlaşmış mühendislik çalışma grupları tarafından geliştirilir ve denetlenir.",
        "İçerik güncellemeleri, formül değişiklikleri veya yeni standartların eklenmesi süreçlerinde en az iki bağımsız teknik gözden geçirme yapılır. Yazar ve editörler mühendislik alanında lisans veya lisansüstü eğitim almış, endüstriyel tasarım deneyimine sahip kişilerdir.",
        "Kullanıcılar, hatalı hesap veya formül bulduklarını düşündüklerinde iletişim sayfamız üzerinden bildirimde bulunabilir. Bildirilen her sorun 10 iş günü içinde incelenir.",
      ],
    },
    {
      id: "versioning",
      title: "6. Sürüm ve Güncelleme Politikası",
      paragraphs: [
        "TORQYX sürekli gelişen bir platformdur. Her araç için formül değişiklikleri, standart güncellemeleri veya test kapsamı genişletmesi gerçekleştiğinde ilgili sayfada değişiklik tarihi güncellenir.",
        "Geriye dönük uyumsuz bir hesaplama değişikliği (örneğin farklı bir standart benimsenmesi) yapılması durumunda, değişiklik açıkça belgelenir ve önceki davranış en az 90 gün boyunca yayın notlarında kayıt altında tutulur.",
        "Platform sürüm geçmişi ve önemli değişiklikler GitHub üzerindeki açık kaynak deposunda commit geçmişi aracılığıyla izlenebilir.",
      ],
    },
  ],
};

const contentEn = {
  updated: "Last updated: November 2026",
  intro:
    "TORQYX is built on the principles of transparency, repeatability, and independent verifiability in mechanical engineering calculations. This page explains how all calculators on the platform are developed, what standards they are based on, and how they are validated.",
  sections: [
    {
      id: "approach",
      title: "1. Calculation Approach",
      paragraphs: [
        "All TORQYX tools are built on deterministic algorithms: the same inputs always produce the same physical output. No probabilistic or approximate methods are used; every calculation step is based on analytical physics equations.",
        "Formulas are not black boxes. The physical equations used and intermediate calculation steps are explicitly shown with mathematical notation in each tool. Users can trace how results are reached step by step.",
        "Unit consistency is enforced platform-wide. Conversions between SI (metric) and US Customary (inch, pound) systems are performed with ISO standard conversion factors; calculation errors due to unit mistakes are systematically prevented.",
      ],
    },
    {
      id: "sources",
      title: "2. Formula and Standard Sources",
      paragraphs: [
        "Every formula in TORQYX is grounded in internationally recognized standards and academic references. Primary reference sources include:",
      ],
      bullets: [
        "ISO 286 — Tolerance systems and fits (IT grades, fundamental deviation)",
        "ISO 2768 — General tolerances (linear and angular dimensions)",
        "ISO 898 / DIN 267 — Fastener mechanical properties and bolt calculations",
        "Eurocode 3 / DIN 18800 — Welded connections and structural steel design",
        "ASME B1.1 / B18.2 — Inch thread series and fastener standards",
        "VDI 2230 — Calculation of high-strength bolted joints",
        "Darcy-Weisbach equation — Pipe friction losses",
        "Shigley's Mechanical Engineering Design — Shaft, spring, and machine element calculations",
        "Roark's Formulas for Stress and Strain — Stress and deformation reference",
        "Beer & Johnston: Mechanics of Materials — Fundamental strength formulas",
      ],
    },
    {
      id: "testing",
      title: "3. Test Coverage (412+ Vitest Units)",
      paragraphs: [
        "Every calculator is covered by automated unit tests written with the Vitest framework. As of November 2026, the test suite contains more than 412 individual tests.",
        "Tests cover: (a) cross-validation against solved example problems from academic literature, (b) boundary conditions (zero, negative, extremely large values), (c) unit conversion accuracy, (d) input validation and error handling, (e) backward consistency across version updates.",
        "In the CI/CD pipeline (GitHub Actions), every pull request is automatically run through the test suite. No change that fails the test suite is merged into the `main` branch.",
      ],
    },
    {
      id: "validation",
      title: "4. Validation Process",
      paragraphs: [
        "Calculator validation is a two-stage process. In the first stage, the developer manually compares formulas against reference solutions from academic or standard sources and writes unit-level tests in code.",
        "In the second stage, subject-matter experts in the relevant engineering desk (Mechanical Design, Manufacturing & Tolerance, Thermal & Fluid Systems, Software Algorithms) independently validate results against real project values or commercial simulation software outputs.",
        "Results that exceed the calculation scope or have not been validated are explicitly flagged to users with a warning message.",
      ],
    },
    {
      id: "editorial",
      title: "5. Author and Editor Information",
      paragraphs: [
        "All tools, guides, and technical content on the TORQYX platform are developed and reviewed by engineering working groups specialized in mechanical engineering, mechanical design, manufacturing methods, and software reliability.",
        "Content updates, formula changes, or additions of new standards undergo at least two independent technical reviews. Authors and editors hold undergraduate or postgraduate degrees in engineering fields and have industrial design experience.",
        "Users who believe they have found an erroneous calculation or formula can report it through our contact page. Every reported issue is reviewed within 10 business days.",
      ],
    },
    {
      id: "versioning",
      title: "6. Version and Update Policy",
      paragraphs: [
        "TORQYX is a continuously evolving platform. When formula changes, standard updates, or test coverage expansions occur for any tool, the change date on the relevant page is updated.",
        "If a backward-incompatible calculation change is made (e.g., adopting a different standard), the change is explicitly documented and the previous behavior is recorded in release notes for at least 90 days.",
        "Platform version history and significant changes can be traced through the commit history in the open-source repository on GitHub.",
      ],
    },
  ],
};

export default async function MetodolojiPage() {
  const locale = await getLocaleFromCookies();
  const content = locale === "en" ? contentEn : contentTr;

  return (
    <PageShell>
      <PageHero
        title={locale === "en" ? pageCopyEn.title : pageCopyTr.title}
        description={locale === "en" ? pageCopyEn.description : pageCopyTr.description}
        imageSrc={getHeroImageSrc("about")}
        imageAlt={locale === "en" ? pageCopyEn.imageAlt : pageCopyTr.imageAlt}
      />

      <article className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {content.updated}
        </p>
        <p className="leading-relaxed text-slate-600">{content.intro}</p>

        {content.sections.map((section) => (
          <section key={section.id} id={section.id} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
            {"bullets" in section && section.bullets ? (
              <ul className="list-disc space-y-1 pl-5">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </article>
    </PageShell>
  );
}
