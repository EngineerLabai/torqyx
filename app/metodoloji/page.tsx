import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopyTr = {
  title: "Hesaplama Metodolojisi ve Doğrulama",
  description:
    "TORQYX'in deterministik mühendislik hesaplama yaklaşımı: formül kaynakları, standart referansları, 415 vitest otomatik test kapsamı ve doğrulama süreci.",
  imageAlt: "Hesaplama metodolojisi görseli",
};

const pageCopyEn = {
  title: "Calculation Methodology & Validation",
  description:
    "TORQYX's deterministic engineering calculation approach: formula sources, standard references, 415 vitest automated test coverage, and validation process.",
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
      title: "3. Test Kapsamı (415 Otomatik Vitest Birimi)",
      paragraphs: [
        "Hesaplama doğruluğunu garanti altına almak için platform kod tabanında Vitest çerçevesiyle çalışan 415 adet otomatik birim testi bulunmaktadır. Bu testler üretim ortamına çıkan her sürümde sürekli olarak çalıştırılır.",
        "Test paketimizin kapsamı şu alanları içerir: (a) Yukarıda listelenen akademik ders kitaplarındaki çözümlü örnek problemlerin sayısal çıktılarıyla çapraz kontrol; (b) Sınır ve uç koşulları (sıfır çap, negatif yük, aşırı yüksek sıcaklık veya basınç gibi fiziksel sınır aşımları); (c) Giriş doğrulama ve kullanıcı hata yakalama mekanizmaları; (d) Çift yönlü birim dönüşüm matematiksel hassasiyeti; (e) Kod tabanında yapılan herhangi bir optimizasyonda geriye dönük tutarlılığın (regression) korunması.",
        "GitHub Actions üzerinde çalışan sürekli entegrasyon (CI/CD) boru hattı sayesinde, test paketindeki 415 testin tamamı geçmeden hiçbir kod değişikliği ana üretim dalına (main) birleştirilemez.",
      ],
    },
    {
      id: "validation",
      title: "4. Doğrulama Süreci ve Sınır Koşulları",
      paragraphs: [
        "Platformdaki tüm hesaplayıcıların doğrulama süreci doğrudan sahada uygulanan somut adımlara dayanır: Her araç kodlanırken öncelikle yayınlanmış standart örneklerine ve üniversite ders kitaplarındaki problemlere karşı elle (manuel olarak) adım adım doğrulanır.",
        "Elle doğrulanmış sayısal benchmark senaryoları Vitest test paketine otomatik birim test olarak işlenir; her yeni dağıtımda 415 otomatik test kesintisiz çalışarak matematiksel tutarlılığı kilitler.",
        "Araçlarımız ön boyutlandırma ve mühendislik fizibilite hesapları içindir. Hooke yasasının elastik sınırları, akış rejimleri veya malzeme akma eşikleri gibi fiziksel geçerlilik limitleri arayüzde açık uyarı ve bilgi notlarıyla kullanıcıya açıkça iletilir.",
        "Girdiler fiziksel gerçekçilik sınırlarını aştığında veya kritik güvenlik sınırına yaklaşıldığında araçlar koruyucu hata/uyarı mesajları üretir.",
      ],
    },
    {
      id: "authorship",
      title: "5. Kim Geliştiriyor ve Hata Bildirme Kanalı",
      paragraphs: [
        "TORQYX, bağımsız bir makine mühendisi/geliştirici tarafından hazırlanır ve sürdürülür. Temel amaç, karmaşık mühendislik el kitaplarını ve formül karmaşasını mühendisler, tasarımcılar ve teknik uygulayıcılar için şeffaf, hızlı ve güvenilir bir web aracına dönüştürmektir.",
        "Doğrulama süreci yalnızca gerçekte yapılan pratik adımlara dayanır: Yayınlanmış standart örneklerine ve ders kitabı problemlerine karşı elle doğrulama, Vitest ile otomatik testler ve hata bildirimleri için doğrudan e-posta iletişimi.",
        "Platformda yer alan herhangi bir formülde, hesap sonucunda veya birim dönüşümünde bir tutarsızlık, hata ya da iyileştirme önerisi fark eden kullanıcılarımızın bildirimlerini son derece önemsiyoruz. Teknik düzeltme bildirimlerinizi İletişim sayfamız (/iletisim) üzerinden veya doğrudan infotorqyx@gmail.com e-posta adresine iletebilirsiniz. Bildirilen her konu kaynak normlar üzerinden bizzat incelenerek gerekli güncellemeler derhal test paketine yansıtılır.",
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
      title: "3. Automated Test Coverage (415 Vitest Units)",
      paragraphs: [
        "To guarantee numerical accuracy and prevent regressions, our codebase is safeguarded by 415 automated unit tests powered by the Vitest testing framework. These tests run continuously across all production deployments.",
        "Our test suite systematically exercises: (a) Cross-validation against solved benchmark problems published in standard textbooks; (b) Boundary and edge conditions (zero values, negative inputs, extreme pressure or load thresholds); (c) User input validation and defensive error handling; (d) Bidirectional unit conversion mathematical accuracy; (e) Regression prevention across formula enhancements.",
        "Integrated within our GitHub Actions continuous integration (CI/CD) pipeline, every pull request must pass all 415 unit tests before any code can be merged into the production main branch.",
      ],
    },
    {
      id: "validation",
      title: "4. Validation Process and Application Limits",
      paragraphs: [
        "The numerical validation of all calculators on TORQYX is grounded strictly in concrete engineering practices: Every newly implemented tool is first manually verified step-by-step against published standard worked examples and university textbook benchmark problems.",
        "Once verified by hand, these benchmark numerical cases are codified into automated Vitest test specifications; 415 automated unit tests execute continuously across every deployment to prevent regressions.",
        "Our tools are intended for preliminary sizing, screening, and design feasibility verification. The physical limits of applicability (such as the linear elastic limit of Hooke's Law, transition zones in fluid flow, or yield stress thresholds in bolted joints) are explicitly communicated through interface tooltips, status badges, and contextual warnings.",
        "Whenever user inputs exceed recommended physical thresholds or yield safety factors below standard guidelines, protective warning notices are automatically generated.",
      ],
    },
    {
      id: "authorship",
      title: "5. Developer & Issue Reporting Channel",
      paragraphs: [
        "TORQYX is developed and maintained by an independent mechanical engineer and software developer. The primary objective is to translate cumbersome engineering handbooks and calculation steps into clear, accessible, and dependable deterministic digital tools.",
        "The validation workflow relies solely on what is actually performed: Step-by-step manual cross-validation against published standard worked examples and textbook benchmark problems, automated unit testing with Vitest, and an open email channel for technical bug reports.",
        "We welcome technical feedback, user reviews, and discrepancy reports from engineers and academic practitioners.",
        "If you identify a potential discrepancy, formula ambiguity, or improvement opportunity, please report it via our Contact page (/en/contact) or directly by email to infotorqyx@gmail.com. All technical reports are evaluated personally against standard literature and codified into the automated test suite.",
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
