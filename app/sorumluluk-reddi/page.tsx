import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopyTr = {
  title: "Sorumluluk Reddi Beyanı",
  description:
    "TORQYX hesaplama araçlarının kullanım kapsamı ve sınırlamaları: sonuçlar ön boyutlandırma içindir; kritik tasarımlarda standart ve uzman kontrolü zorunludur.",
  imageAlt: "Sorumluluk reddi görseli",
};

const pageCopyEn = {
  title: "Disclaimer",
  description:
    "Scope and limitations of TORQYX calculation tools: results are for preliminary sizing only; critical designs require standard compliance and expert review.",
  imageAlt: "Disclaimer visual",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = locale === "en" ? pageCopyEn : pageCopyTr;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/sorumluluk-reddi",
    locale,
  });
}

const contentTr = {
  updated: "Son güncelleme: Kasım 2026",
  sections: [
    {
      id: "scope",
      title: "Kullanım Kapsamı ve Sınırlamaları",
      paragraphs: [
        "TORQYX platformundaki tüm hesaplama araçları, mekanik tasarım ve makine mühendisliği süreçlerinin kavramsal tasarım, ön boyutlandırma ve fizibilite (feasibility) aşamaları için geliştirilmiştir. Bu araçlardan elde edilen çıktılar, tasarım parametrelerinin ilk tahmini, alternatif konfigürasyonların karşılaştırılması ve mühendislik değerlendirmeleri için yol gösterici niteliktedir.",
        "Hesaplama sonuçları hiçbir koşulda nihai tasarım verisi, imalat resmi onayı, montaj talimatı veya yapısal uygunluk sertifikası olarak doğrudan kullanılamaz. Kritik güvenlik bileşenleri, basınçlı kaplar, kaldırma ve iletme makineleri, taşıyıcı çelik yapılar, dönen yüksek hızlı şaftlar ve insan can güvenliğini doğrudan veya dolaylı etkileyen tüm endüstriyel uygulamalarda yürürlükteki normlara uygunluk ve yetkili başmühendis onayı zorunludur.",
      ],
    },
    {
      id: "engineering-judgment",
      title: "Mühendislik Değerlendirmesi ve Uzman Kontrolü Zorunluluğu",
      paragraphs: [
        "Her gerçek dünya mühendislik problemi; malzeme özelliklerindeki istatistiksel dağılımlar, dinamik ve darbeli yükleme koşulları, çevre sıcaklığı ve korozyon etkileri, çentik faktörleri, yorulma ömrü geçmişi, imalat tolerans birikimi ve montaj sıkma hataları gibi projeye özgü karmaşık değişkenler içerir.",
        "TORQYX araçları bu proje bağlamını ve saha koşullarını bilemez; yalnızca kullanıcı tarafından sağlanan teorik girdi parametrelerini deterministik denklemlerle işler. Bu sebeple kullanıcının, TORQYX çıktılarını kendi mühendislik yargısı, şirket içi güvenlik katsayıları ve sahaya özgü çalışma koşulları ışığında eleştirel bir gözle değerlendirmesi, bağımsız olarak doğrulaması ve nihai tasarıma uygunluğuna karar vermesi yasal ve mesleki bir zorunluluktur.",
        "Basit bir veri giriş hatası, yanlış birim seçimi (örneğin MPa yerine bar veya N·m yerine lbf·in), eksik güvenlik katsayısı tanımlaması veya gerçek çalışma yükünün yanlış modellenmesi gibi etkenler sahada katastrofik mekanik hasarlara yol açabilir. Bu nedenle tüm hesap çıktıları kalifiye ve yetkili bir mekanik tasarım mühendisi tarafından gözden geçirilip onaylanmalıdır.",
      ],
    },
    {
      id: "standards",
      title: "Standartlara Uygunluk Kontrolü",
      paragraphs: [
        "TORQYX, pek çok hesaplamada uluslararası standartlara (ISO, DIN, Eurocode, ASME, VDI vb.) atıfta bulunur ve bu standartların formüllerini uygular. Ancak standartlar düzenli olarak güncellenmektedir; kullanıcı, geçerli standart baskısını ve yerel mevzuatın ek gereksinimlerini bağımsız olarak doğrulamalıdır.",
        "Bazı hesaplayıcılarda standart kapsamının dışında kalan veya basitleştirme yapılan durumlar mevcuttur; bu durumlar ilgili araç sayfasında açıkça belirtilmektedir. Kullanıcı bu uyarıları dikkate almakla yükümlüdür.",
      ],
    },
    {
      id: "liability",
      title: "Sorumluluk Reddi",
      paragraphs: [
        "TORQYX ve içerik sağlayıcıları; bu platformdaki hesaplama araçlarının kullanımından doğabilecek doğrudan, dolaylı, tesadüfi, özel veya sonuçsal zararlardan (kâr kaybı, üretim durması, yapısal hasar, kişisel yaralanma dahil ancak bunlarla sınırlı olmamak kaydıyla) sorumlu tutulamaz.",
        "Platform, içeriklerin doğruluğu ve güncelliği konusunda makul özen göstermekle birlikte, belirli bir amaç için uygunluk veya hatasızlık garantisi vermemektedir. Kullanıcı, araçları kendi sorumluluğunda kullanmayı kabul eder.",
        "Bu sorumluluk reddi beyanı, yürürlükteki tüketici koruma veya ürün sorumluluğu mevzuatından doğan yasal haklarınızı sınırlamaz veya ortadan kaldırmaz.",
      ],
    },
    {
      id: "contact",
      title: "İletişim ve Bildirim",
      paragraphs: [
        "Hesaplama sonuçlarında hata veya tutarsızlık tespit ettiğinizde lütfen iletişim sayfamız üzerinden bildirin. Her bildirim 10 iş günü içinde incelenir ve gerektiğinde düzeltme yapılır.",
        "Bu sorumluluk reddi beyanının güncel sürümü her zaman bu sayfada yayımlanmaktadır.",
      ],
    },
  ],
};

const contentEn = {
  updated: "Last updated: November 2026",
  sections: [
    {
      id: "scope",
      title: "Scope and Limitations of Use",
      paragraphs: [
        "All calculation tools on the TORQYX platform are developed for the preliminary sizing and feasibility phase of the mechanical engineering design process. Results obtained from these tools serve as guidance for conceptual design, initial selection, and engineering discussions.",
        "Calculation results must not be used as final design data, manufacturing documentation, or structural approval documents. For safety-critical components, pressure vessels, lifting equipment, load-bearing structures, and all applications that directly affect human safety, compliance with applicable standards and approval by a competent engineer are mandatory.",
      ],
    },
    {
      id: "engineering-judgment",
      title: "Engineering Judgment Requirement",
      paragraphs: [
        "Every engineering calculation contains conditions specific to the project context (material property tolerances, actual loading conditions, environmental effects, fatigue history, assembly errors, etc.). TORQYX tools cannot know this project context; they process user-provided values and produce deterministic output.",
        "Users are required to evaluate TORQYX outputs within the framework of their own engineering judgment, project requirements, and applicable standards, verify them, and decide on their applicability.",
        "Even simple mistakes (wrong unit selection, incorrect loading scenario, neglecting a safety factor) can lead to serious consequences in real applications. Therefore TORQYX outputs must always be reviewed and approved by a qualified engineer.",
      ],
    },
    {
      id: "standards",
      title: "Standards Compliance Verification",
      paragraphs: [
        "TORQYX references international standards (ISO, DIN, Eurocode, ASME, VDI, etc.) in many calculations and applies their formulas. However, standards are regularly updated; users must independently verify the current standard edition and any additional requirements of local regulations.",
        "Some calculators contain cases where simplifications are made or where the scope of the standard is exceeded; these cases are explicitly noted on the relevant tool page. Users are obligated to take these warnings into account.",
      ],
    },
    {
      id: "liability",
      title: "Disclaimer of Liability",
      paragraphs: [
        "TORQYX and its content providers cannot be held liable for any direct, indirect, incidental, special, or consequential damages (including but not limited to loss of profit, production downtime, structural damage, personal injury) arising from the use of calculation tools on this platform.",
        "While the platform exercises reasonable care regarding the accuracy and currency of content, it does not warrant fitness for a particular purpose or freedom from errors. Users agree to use the tools at their own risk.",
        "This disclaimer does not limit or exclude any legal rights you have under applicable consumer protection or product liability legislation.",
      ],
    },
    {
      id: "contact",
      title: "Contact and Reporting",
      paragraphs: [
        "If you detect an error or inconsistency in calculation results, please report it through our contact page. Every report is reviewed within 10 business days and corrections are made where necessary.",
        "The current version of this disclaimer is always published on this page.",
      ],
    },
  ],
};

export default async function SorumlulukReddiPage() {
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

        {content.sections.map((section) => (
          <section key={section.id} id={section.id} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </PageShell>
  );
}
