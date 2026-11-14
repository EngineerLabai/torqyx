import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopyTr = {
  title: "Hesaplama Metodolojisi ve Doğrulama",
  description:
    "TORQYX'in deterministik mühendislik hesaplama yaklaşımı: formül kaynakları, standart referansları, 412+ vitest otomatik test kapsamı ve doğrulama süreci.",
  imageAlt: "Hesaplama metodolojisi görseli",
};

const pageCopyEn = {
  title: "Calculation Methodology & Validation",
  description:
    "TORQYX's deterministic engineering calculation approach: formula sources, standard references, 412+ vitest automated test coverage, and validation process.",
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
    "TORQYX, makine mühendisliği hesaplamalarında şeffaflık, tekrarlanabilirlik ve analitik doğruluk ilkeleri üzerine inşa edilmiştir. Bu sayfa, platformdaki tüm hesaplayıcıların nasıl geliştirildiğini, formüllerin hangi kaynaklara dayandığını, otomatik test altyapımızı ve doğrulama yaklaşımımızı eksiksiz ve şeffaf biçimde açıklamaktadır.",
  sections: [
    {
      id: "approach",
      title: "1. Hesaplama Yaklaşımı ve Deterministik Mimari",
      paragraphs: [
        "TORQYX platformundaki tüm hesaplayıcılar deterministik algoritmalarla çalışır: aynı girdi değerleri her zaman aynı fiziksel ve matematiksel çıktıyı üretir. Sistemde yapay zeka tahminleri, olasılıksal yaklaşımlar veya heuristik kestirimler kullanılmaz; her hesaplama adımı analitik fizik ve mühendislik mekaniği denklemlerine dayanır.",
        "Formüller kapalı kutu (black box) mantığıyla saklanmaz. Hesaplamada kullanılan tüm temel denklemler, kabuller ve ara işlem basamakları araç sayfalarında ve rapor çıktılarında açık matematiksel notasyonla sunulur. Böylece mühendisler, elde edilen nihai sonucun her adımını kendi hesap tabloları veya el hesaplarıyla doğrudan denetleyebilir.",
        "Birim tutarlılığı platform genelinde tavizsiz bir kuraldır. SI metrik (mm, N, MPa, m/s, bar) ve US Customary (inç, lbf, psi, gpm) birim sistemleri arasındaki dönüşümler ISO standart dönüşüm katsayılarıyla çift yönlü yürütülür. Yuvarlama ve kayan nokta (floating point) hassasiyeti standart sayısal yöntemlerle korunur.",
      ],
    },
    {
      id: "sources",
      title: "2. Formül ve Standart Kaynakları",
      paragraphs: [
        "Platformda yer alan formüller, makine mühendisliği eğitiminde ve uluslararası endüstriyel tasarımda temel kabul edilen akademik kaynaklardan ve uluslararası standart normlarından doğrudan derlenmiştir. Başlıca kaynaklarımız şunlardır:",
      ],
      bullets: [
        "ISO 286-1 / ISO 286-2 — Tolerans sistemleri, IT kalite sınıfları ve şaft/delik geçme boşlukları",
        "ISO 2768-1 / ISO 2768-2 — Talaşlı imalat için genel doğrusal, açısal ve geometrik toleranslar",
        "ISO 898-1 — Karbon ve alaşımlı çelik cıvataların mekanik özellikleri, gerilme alanı (As) ve akma dayanımı (Re)",
        "ISO 68-1 — ISO genel amaçlı metrik vida diş profili ve temel hatve ilişkileri",
        "VDI 2230 (Blatt 1) — Yüksek mukavemetli cıvatalı bağlantıların analizi ve tork-ön yük ilişkisi prensipleri",
        "AWS D1.1 & EN 1993-1-8 (Eurocode 3) — Çelik yapılarda köşe kaynak boyutlandırması ve boğaz kalınlığı (throat thickness) hesapları",
        "Darcy-Weisbach & Swamee-Jain — Dairesel borularda sürtünme faktörü, akış rejimleri (laminar/türbülans) ve hidrolik basınç kaybı",
        "Shigley's Mechanical Engineering Design (Budynas & Nisbett) — Şaft burulması, eğilme gerilmesi, helisel yay boyutlandırması ve makine elemanları teorisi",
        "Beer & Johnston: Mechanics of Materials — Temel mukavemet, gerilme gerinim ilişkileri ve kesit modülleri",
        "Roark's Formulas for Stress and Strain — Elastik şekil değiştirme ve kiriş gerilme analizleri",
      ],
    },
    {
      id: "testing",
      title: "3. Test Kapsamı (412+ Otomatik Vitest Birimi)",
      paragraphs: [
        "Hesaplama doğruluğunu garanti altına almak için platform kod tabanında Vitest çerçevesiyle çalışan 412'den fazla otomatik birim testi bulunmaktadır. Bu testler üretim ortamına çıkan her sürümde sürekli olarak çalıştırılır.",
        "Test paketimizin kapsamı şu alanları içerir: (a) Yukarıda listelenen akademik ders kitaplarındaki çözümlü örnek problemlerin sayısal çıktılarıyla çapraz kontrol; (b) Sınır ve uç koşulları (sıfır çap, negatif yük, aşırı yüksek sıcaklık veya basınç gibi fiziksel sınır aşımları); (c) Giriş doğrulama ve kullanıcı hata yakalama mekanizmaları; (d) Çift yönlü birim dönüşüm matematiksel hassasiyeti; (e) Kod tabanında yapılan herhangi bir optimizasyonda geriye dönük tutarlılığın (regression) korunması.",
        "GitHub Actions üzerinde çalışan sürekli entegrasyon (CI/CD) boru hattı sayesinde, test paketindeki 412 testin tamamı geçmeden hiçbir kod değişikliği ana üretim dalına (main) birleştirilemez.",
      ],
    },
    {
      id: "validation",
      title: "4. Doğrulama Süreci ve Sınır Koşulları",
      paragraphs: [
        "Kodlanan her araç, önce kaynak standart veya ders kitabındaki çözümlü örnek senaryolarla adım adım manuel olarak karşılaştırılır. Ardından bu senaryolar sayısal toleranslarla Vitest test kütüphanesine birim test olarak eklenir.",
        "Araçlarımız, ön boyutlandırma ve mühendislik fizibilite hesapları için tasarlanmıştır. Hesaplamanın geçerlilik sınırları (örneğin Hooke yasasının geçerli olduğu elastik bölge, akış rejiminin türbülansa geçiş sınırları veya cıvatanın akma sınırına yaklaşma oranı) hem arayüzde bilgi panelleriyle hem de sonuç uyarılarıyla kullanıcıya açıkça iletilir.",
        "Girdiler fiziksel gerçekçilik sınırlarını aştığında veya kritik güvenlik sınırına yaklaşıldığında araçlar koruyucu hata/uyarı mesajları üretir.",
      ],
    },
    {
      id: "authorship",
      title: "5. Kim Geliştiriyor ve Hata Bildirme Kanalı",
      paragraphs: [
        "TORQYX, makine mühendisliği temelli yazılım geliştiriciler (TORQYX Engineering Team) tarafından tasarlanmakta, kodlanmakta ve bakımı yapılmaktadır. Amacımız, karmaşık el kitapları ve formül karmaşasını mühendisler ve teknik ekipler için şeffaf, hızlı ve güvenilir bir web aracına dönüştürmektir.",
        "Platformda yer alan herhangi bir formülde, hesap sonucunda veya birim dönüşümünde bir tutarsızlık, hata ya da iyileştirme önerisi fark eden kullanıcılarımızın geri bildirimlerini son derece önemsiyoruz.",
        "Teknik hata bildirimlerinizi İletişim sayfamız (/iletisim) üzerinden veya doğrudan infotorqyx@gmail.com e-posta adresine iletebilirsiniz. Bildirilen her teknik konu referans literatür ve test paketi üzerinden incelenerek gerekli güncellemeler derhal işleme alınır.",
      ],
    },
    {
      id: "versioning",
      title: "6. Sürüm, Güncelleme ve İzlenebilirlik Politikası",
      paragraphs: [
        "TORQYX sürekli geliştirilen dinamik bir mühendislik kütüphanesidir. Araçlarda yapılan formül optimizasyonları, yeni eklenen hesaplayıcılar ve standart revizyonları Changelog sayfamızda sürüm numaralarıyla kayıt altına alınır.",
        "Tüm değişiklik geçmişi, GitHub üzerindeki sürüm kontrol deposunda şeffaf ve denetlenebilir commit kayıtlarıyla takip edilebilir. Kritik bir formül güncellemesi yapıldığında değişiklik gerekçesi ve eski hesap davranışı yayın notlarında belgelenir.",
      ],
    },
  ],
};

const contentEn = {
  updated: "Last updated: November 2026",
  intro:
    "TORQYX is built upon the foundational principles of transparency, repeatability, and analytical rigor in mechanical engineering calculations. This page openly documents how all calculators on the platform are developed, what literature and standards they reference, our automated testing infrastructure, and our validation practices.",
  sections: [
    {
      id: "approach",
      title: "1. Calculation Approach & Deterministic Architecture",
      paragraphs: [
        "All calculation tools on TORQYX operate on deterministic algorithms: identical input values consistently yield the exact same physical and mathematical output. No probabilistic models, AI estimations, or heuristic guesswork are used; every computational step is rooted in analytical physics and engineering mechanics equations.",
        "Formulas are never treated as black boxes. Governing physical equations, underlying assumptions, and intermediate calculation stages are published directly within each tool and in generated technical reports using clear mathematical notation. This empowers engineers to verify and cross-check every step against their own spreadsheets or hand calculations.",
        "Dimensional consistency is strictly enforced across the entire platform. Conversions between SI metric units (mm, N, MPa, m/s, bar) and US Customary units (in, lbf, psi, gpm) are performed using ISO standard conversion factors with rigorous floating-point precision.",
      ],
    },
    {
      id: "sources",
      title: "2. Formula and Standard Sources",
      paragraphs: [
        "Formulas implemented across TORQYX are directly derived from established international standards and foundational mechanical engineering university textbooks. Key sources include:",
      ],
      bullets: [
        "ISO 286-1 / ISO 286-2 — ISO system of limits and fits, standard tolerance grades (IT), and limit deviations for holes and shafts",
        "ISO 2768-1 / ISO 2768-2 — General geometrical and linear manufacturing tolerances for machined parts",
        "ISO 898-1 — Mechanical properties of fasteners made of carbon steel and alloy steel (tensile stress area As, yield strength Re, proof load)",
        "ISO 68-1 — ISO general-purpose metric screw thread basic profile and pitch relations",
        "VDI 2230 (Part 1) — Systematic calculation of high-duty bolted joints and torque-preload principles",
        "AWS D1.1 & EN 1993-1-8 (Eurocode 3) — Design of welded joints, fillet weld sizing, and effective throat thickness calculations",
        "Darcy-Weisbach & Swamee-Jain Equations — Friction factor determination, laminar and turbulent flow regimes, and hydraulic pipe pressure loss",
        "Shigley's Mechanical Engineering Design (Budynas & Nisbett) — Shaft torsion, bending stress, helical compression springs, and machine components theory",
        "Beer & Johnston: Mechanics of Materials — Fundamental strength of materials, stress-strain behavior, and section moduli",
        "Roark's Formulas for Stress and Strain — Elastic deformation and beam stress reference equations",
      ],
    },
    {
      id: "testing",
      title: "3. Automated Test Coverage (412+ Vitest Units)",
      paragraphs: [
        "To guarantee numerical accuracy and prevent regressions, our codebase is safeguarded by more than 412 automated unit tests powered by the Vitest testing framework. These tests run continuously across all production deployments.",
        "Our test suite systematically exercises: (a) Cross-validation against solved benchmark problems published in standard textbooks; (b) Boundary and edge conditions (zero values, negative inputs, extreme pressure or load thresholds); (c) User input validation and defensive error handling; (d) Bidirectional unit conversion mathematical accuracy; (e) Regression prevention across formula enhancements.",
        "Integrated within our GitHub Actions continuous integration (CI/CD) pipeline, every pull request must pass all 412 unit tests before any code can be merged into the production main branch.",
      ],
    },
    {
      id: "validation",
      title: "4. Validation Process and Application Limits",
      paragraphs: [
        "Each newly implemented tool is first manually verified step-by-step against published standard worked examples and textbook problems. Once verified, these numerical benchmarks are codified into automated Vitest test specifications.",
        "Our tools are intended for preliminary sizing, screening, and design feasibility verification. The physical limits of applicability (such as the linear elastic limit of Hooke's Law, transition zones in fluid flow, or yield stress thresholds in bolted joints) are explicitly communicated through interface tooltips, status badges, and contextual warnings.",
        "Whenever user inputs exceed recommended physical thresholds or yield safety factors below standard guidelines, protective warning notices are automatically generated.",
      ],
    },
    {
      id: "authorship",
      title: "5. Development Team & Issue Reporting Channel",
      paragraphs: [
        "TORQYX is engineered and maintained by a dedicated engineering software team (TORQYX Engineering Team) with background in mechanical design and software development. Our objective is to translate cumbersome engineering handbooks and calculation steps into clear, accessible, and dependable digital tools.",
        "We welcome technical feedback, peer reviews, and discrepancy reports from engineers and academic practitioners.",
        "If you identify a potential discrepancy, formula ambiguity, or improvement opportunity, please report it via our Contact page (/en/contact) or directly by email to infotorqyx@gmail.com. All technical reports are evaluated against standard literature and verified within our test suite.",
      ],
    },
    {
      id: "versioning",
      title: "6. Versioning, Updates, and Traceability Policy",
      paragraphs: [
        "TORQYX is a continuously improving engineering platform. All algorithm optimizations, new calculator additions, and standard references are documented with version numbers on our Changelog page.",
        "Full revision history is maintained transparently through Git commit logs in our version control repository. Whenever a governing equation or standard edition is updated, the rationale and historical calculation behavior are preserved in release notes.",
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
