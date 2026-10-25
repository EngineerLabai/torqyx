import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import JsonLd from "@/components/seo/JsonLd";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";
import { BookOpen, CheckCircle2, Cpu, FileText, Layers, ShieldCheck, Users } from "lucide-react";

const pageCopy = {
  title: "TORQYX Hakkında — Mühendisler İçin Geliştirilen Deterministik Hesap Motoru",
  description:
    "TORQYX'in makine mühendisliği hesaplama metodolojisi, E-E-A-T kalite güvence protokolü, akademik kaynakları ve kurumsal vizyonu.",
  imageAlt: "TORQYX hakkında görsel",
  sections: {
    whyTitle: "Neden TORQYX? — Deterministik Mühendislik Vizyonu",
    whyBody:
      "Mekanik tasarım ve ürün geliştirme süreçlerinde en kritik zaman kaybı, hesaplamaların doğruluğundan ve izlenebilirliğinden emin olmak için harcanan çabadır. Karmaşık Excel tablolarında gizlenmiş formüller, kaynak gösterilmemiş varsayımlar ve mühendisten mühendise farklılık gösteren sonuçlar, modern endüstride tasarım hatalarına ve maliyetli prototip revizyonlarına yol açmaktadır. TORQYX, mekanik hesaplama süreçlerini şeffaf, tekrarlanabilir ve bağımsız biçimde doğrulanabilir hale getirmek için geliştirildi: aynı girdide her zaman aynı fiziksel sonucu veren, uluslararası normlara dayalı deterministik bir hesaplama altyapısı.",

    editorialTitle: "Mühendislik Kurulu ve Editoryal İnceleme Süreci",
    editorialBody:
      "TORQYX üzerindeki tüm araçlar, formüller ve teknik rehberler; makine mühendisliği, mekanik tasarım, imalat yöntemleri ve yazılım güvenilirliği alanlarında uzmanlaşmış çalışma gruplarımız tarafından geliştirilir ve denetlenir.",
    editorialDesks: [
      {
        title: "Mekanik Tasarım ve Mukavemet Masası",
        description:
          "Makine elemanları (cıvata, şaft, kama, yay, dişli), statik ve yorulma mukavemeti analizleri, analitik gerilme ve şekil değiştirme hesaplarının normlara uygunluğu denetlenir.",
      },
      {
        title: "İmalat ve Tolerans Masası",
        description:
          "ISO tolerans sistemleri (ISO 286), genel toleranslar (ISO 2768), kaynak hesapları (Eurocode 3) ve yüzey işleme standartları değerlendirilir.",
      },
      {
        title: "Termal ve Akışkan Sistemleri Masası",
        description:
          "Boru sürtünme kayıpları (Darcy-Weisbach), hidrolik/pnömatik silindir güçleri, ısı yalıtımı ve termal genleşme hesapları kontrol edilir.",
      },
      {
        title: "Yazılım ve Algoritma Doğrulama Masası",
        description:
          "Her formül 250'den fazla otomatik birim test (Vitest) ile CI/CD ortamında test edilir; birim dönüşümleri ve sınır şartları deterministik olarak kilitlenir.",
      },
    ],

    methodologyTitle: "Kalite Güvence ve Hesaplama Metodolojisi",
    methodologyItems: [
      {
        title: "Açık Formül ve İzlenebilirlik",
        text: "Hiçbir araçta formüller kapalı kutu değildir; uygulanan fiziksel eşitlikler ve ara adımlar matematiksel notasyonla açıkça gösterilir.",
      },
      {
        title: "250+ Otomatik Birim Test",
        text: "Tüm hesaplayıcılar, akademik literatürdeki çözümlü örnek senaryolarla kod seviyesinde test edilerek sürüm güncellemelerinde geriye dönük tutarlılık korunur.",
      },
      {
        title: "Çift Yönlü Birim Tutarlılığı",
        text: "SI (metrik) ve US Customary (inç, pound) birim sistemleri arasındaki dönüşümler ISO standart katsayılarıyla mutlak hassasiyette yürütülür.",
      },
      {
        title: "Sınır Şartları ve Güvenlik Limitleri",
        text: "Girdiler fiziksel gerçekçilik sınırlarını veya emniyet katsayısı eşiklerini aştığında kullanıcılara mühendislik uyarıları sunulur.",
      },
      {
        title: "Şeffaf Sürüm Günlüğü (Changelog)",
        text: "Formül optimizasyonları, yeni araç eklemeleri ve standart güncellemeleri tarih ve versiyon bazında kamuya açık şekilde belgelenir.",
      },
    ],

    literatureTitle: "Referans Alınan Uluslararası Standartlar ve Akademik Literatür",
    literatureDescription:
      "Hesaplama modellerimiz aşağıdaki temel normlar ve mühendislik literatürü esas alınarak inşa edilmiştir:",
    literatureItems: [
      "Shigley's Mechanical Engineering Design — Richard G. Budynas, J. Keith Nisbett",
      "VDI 2230: Systematic calculation of high duty bolted joints (VDI Standartları)",
      "ISO 898-1 / DIN 931 / DIN 933: Cıvata Mekanik Özellikleri ve Geometrileri",
      "ISO 281 & ISO 76: Rulman Dinamik ve Statik Yük Kapasiteleri, Nominal Ömür (L10h)",
      "DIN 6885: Paralel Kama ve Kama Kanalı Boyutlandırma ve Ezilme Gerilmesi",
      "EN 1993-1-8 (Eurocode 3): Çelik Yapılarda Kaynaklı ve Cıvatalı Birleşimlerin Tasarımı",
      "Darcy-Weisbach & Colebrook-White: Boru Hatlarında Sürtünme Faktörü ve Basınç Kaybı",
      "ISO 12241 & ASTM C547: Endüstriyel Tesisatta Isı Yalıtımı ve Termal Genleşme",
    ],

    limitationsTitle: "Mühendislik Sorumluluk Reddi ve Kullanım Kapsamı",
    limitationsItems: [
      "TORQYX platformundaki araçlar ve rehberler; mühendislik ön tasarımı, tasarım doğrulama, akademik çalışma ve fizibilite kontrollerini hızlandırmak amacıyla sunulmaktadır.",
      "Kritik endüstriyel, havacılık, medikal veya can güvenliği taşıyan projelerde; resmi ulusal/uluslararası standartların tam metni, onaylı malzeme test sertifikaları ve yetkili profesyonel mühendis (PE) incelemesi esas alınmalıdır.",
      "İşletme sıcaklığı, dinamik şok yükler, korozyon, montaj tork toleransları ve çevresel faktörler nihai mekanik davranışı etkiler.",
    ],
  },
};

const pageCopyEn = {
  title: "About TORQYX — A Deterministic Calculation Engine Built for Engineers",
  description:
    "TORQYX's mechanical engineering calculation methodology, E-E-A-T quality assurance protocol, academic references, and platform vision.",
  imageAlt: "About TORQYX visual",
  sections: {
    whyTitle: "Why TORQYX? — Deterministic Engineering Vision",
    whyBody:
      "The most significant bottleneck in mechanical design and product development is the effort required to verify the accuracy and traceability of calculations. Complex spreadsheets with hidden formulas, uncited assumptions, and results that vary from engineer to engineer lead to design errors and expensive prototype revisions in modern industry. TORQYX was engineered to make mechanical calculation transparent, repeatable, and independently verifiable: a deterministic computing platform rooted in international engineering standards that delivers identical results for identical inputs every time.",

    editorialTitle: "Engineering Board & Editorial Review Process",
    editorialBody:
      "All calculation tools, formulas, and technical guides on TORQYX are developed and peer-reviewed by specialized engineering working groups spanning mechanical design, manufacturing processes, and software reliability.",
    editorialDesks: [
      {
        title: "Mechanical Design & Strength Desk",
        description:
          "Oversees machine elements (fasteners, shafts, keys, springs, gears), static and fatigue strength evaluations, and analytical stress/deflection modeling.",
      },
      {
        title: "Manufacturing & Tolerancing Desk",
        description:
          "Evaluates ISO tolerance systems (ISO 286), general manufacturing tolerances (ISO 2768), weld sizing (Eurocode 3), and surface finish criteria.",
      },
      {
        title: "Thermal & Fluid Systems Desk",
        description:
          "Validates pipe friction losses (Darcy-Weisbach), hydraulic/pneumatic cylinder force & power sizing, thermal insulation, and thermal expansion algorithms.",
      },
      {
        title: "Software & Algorithm Verification Desk",
        description:
          "Enforces over 250 automated unit tests (Vitest) in continuous integration pipelines, locking dimensional units and boundary condition integrity.",
      },
    ],

    methodologyTitle: "Quality Assurance & Calculation Methodology",
    methodologyItems: [
      {
        title: "Transparent Formulas & Traceability",
        text: "Calculations are never black boxes; governing physical equations and intermediate variables are published with clear mathematical notation.",
      },
      {
        title: "250+ Automated Unit Tests",
        text: "Every calculator is continuously tested against textbook benchmark problems and boundary conditions to ensure zero regression across deployments.",
      },
      {
        title: "Bidirectional Dimensional Consistency",
        text: "Unit conversions between SI metric and US Customary systems strictly adhere to ISO conversion factors with validated floating-point precision.",
      },
      {
        title: "Boundary Checks & Safety Alerts",
        text: "When inputs violate physical realism or yield factors of safety below recommended standards, proactive engineering warnings are triggered.",
      },
      {
        title: "Transparent Changelog & Versioning",
        text: "Formula enhancements, new tool implementations, and standard updates are documented publicly with precise version logs.",
      },
    ],

    literatureTitle: "Governing International Standards & Academic Literature",
    literatureDescription:
      "Our calculation architectures are built upon recognized academic literature and international engineering codes:",
    literatureItems: [
      "Shigley's Mechanical Engineering Design — Richard G. Budynas, J. Keith Nisbett",
      "VDI 2230: Systematic calculation of high duty bolted joints (VDI Standards)",
      "ISO 898-1 / DIN 931 / DIN 933: Mechanical Properties and Dimensions of Fasteners",
      "ISO 281 & ISO 76: Dynamic and Static Load Ratings and Basic Rating Life of Bearings",
      "DIN 6885: Parallel Keys and Keyways — Dimensions and Allowable Bearing Pressure",
      "EN 1993-1-8 (Eurocode 3): Design of Steel Structures — Design of Joints",
      "Darcy-Weisbach & Colebrook-White: Pipe Friction Factor and Hydraulic Head Loss Analysis",
      "ISO 12241 & ASTM C547: Thermal Insulation for Industrial Piping and Thermal Expansion",
    ],

    limitationsTitle: "Engineering Disclaimer & Scope of Application",
    limitationsItems: [
      "Tools and technical guides on TORQYX are provided to support preliminary mechanical engineering design, validation, academic study, and feasibility reviews.",
      "For critical industrial, aerospace, life-safety, or regulated structural applications, full official standard texts, verified material test reports (MTR), and certified Professional Engineer (PE) approval are mandatory.",
      "Service temperature, shock loads, corrosion rates, tightening torque scatter, and environmental factors influence real-world mechanical behavior.",
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

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: copy.title,
    description: copy.description,
    url: "https://torqyx.com/hakkinda",
    mainEntity: {
      "@type": "Organization",
      name: "TORQYX",
      alternateName: "TORQYX Engineering Platform",
      url: "https://torqyx.com",
      description: copy.sections.whyBody,
      email: "infotorqyx@gmail.com",
      knowsAbout: [
        "Mechanical Engineering",
        "Deterministic Engineering Calculations",
        "Bolted Joint Design (VDI 2230, ISO 898-1)",
        "Bearing Life Rating (ISO 281)",
        "Shaft Torsion and Power Transmission",
        "Pipe Pressure Loss (Darcy-Weisbach)",
        "Manufacturing Tolerances (ISO 286, ISO 2768)",
      ],
    },
  };

  return (
    <PageShell>
      <JsonLd id="about-page-jsonld" data={aboutJsonLd} />

      <PageHero
        title={copy.title}
        description={copy.description}
        imageSrc={heroImage}
        imageAlt={copy.imageAlt}
      />

      <article className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:p-8 md:text-base">
        {/* Neden TORQYX */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-primary-600">
            <Cpu className="h-6 w-6" />
            <h2 className="text-xl font-bold text-slate-900">{copy.sections.whyTitle}</h2>
          </div>
          <p className="leading-relaxed text-slate-600">{copy.sections.whyBody}</p>
        </section>

        {/* Editoryal Kurul ve Masalar */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary-600">
            <Users className="h-6 w-6" />
            <h2 className="text-xl font-bold text-slate-900">{copy.sections.editorialTitle}</h2>
          </div>
          <p className="leading-relaxed text-slate-600">{copy.sections.editorialBody}</p>

          <div className="grid gap-4 md:grid-cols-2">
            {copy.sections.editorialDesks.map((desk) => (
              <div
                key={desk.title}
                className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 transition-colors hover:border-slate-300"
              >
                <h3 className="font-semibold text-slate-900">{desk.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">
                  {desk.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Metodoloji ve QA */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary-600">
            <CheckCircle2 className="h-6 w-6" />
            <h2 className="text-xl font-bold text-slate-900">{copy.sections.methodologyTitle}</h2>
          </div>

          <div className="space-y-3">
            {copy.sections.methodologyItems.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500" />
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600 md:text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Kaynakça ve Standartlar */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary-600">
            <BookOpen className="h-6 w-6" />
            <h2 className="text-xl font-bold text-slate-900">{copy.sections.literatureTitle}</h2>
          </div>
          <p className="text-sm text-slate-600">{copy.sections.literatureDescription}</p>

          <ul className="grid gap-2 sm:grid-cols-2">
            {copy.sections.literatureItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs font-medium text-slate-700 md:text-sm"
              >
                <FileText className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Sorumluluk Reddi / Limitations */}
        <section className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-amber-900">
          <div className="flex items-center gap-2 text-amber-800">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-lg font-bold">{copy.sections.limitationsTitle}</h2>
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-amber-900 md:text-sm">
            {copy.sections.limitationsItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </article>
    </PageShell>
  );
}
