import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { buildPageMetadata } from "@/utils/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

type TermsSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const pageCopy = {
  title: "Kullanım Şartları",
  description: "TORQYX hizmetlerinin kullanımına ilişkin koşullar.",
  imageAlt: "Kullanım şartları görseli",
};

const pageCopyEn = {
  title: "Terms of Use",
  description: "Terms and conditions for using TORQYX services.",
  imageAlt: "Terms of use visual",
};

const termsSectionsTr: TermsSection[] = [
  {
    title: "Tanımlar",
    bullets: [
      "\"Platform\" veya \"Hizmet\": TORQYX internet sitesi, hesaplama araçları, içerikler, raporlama ekranları ve bağlantılı dijital bileşenlerin tamamı.",
      "\"Kullanıcı\": Platforma erişen, kullanan veya Platform üzerinden veri giren gerçek ya da tüzel kişi.",
      "\"İçerik\": Metin, tablo, görsel, hesaplama notu, teknik açıklama, kontrol listesi, örnek veri ve benzeri tüm materyaller.",
      "\"Araç Çıktısı\": Kullanıcı girdilerine bağlı olarak hesaplayıcılar tarafından üretilen tüm sonuç, öneri, özet ve raporlar.",
      "\"Profesyonel Doğrulama\": Yetkili mühendis, teknik sorumlu veya ilgili mesleki otorite tarafından yapılan bağımsız teknik kontrol.",
    ],
  },
  {
    title: "Hizmetin Kapsamı",
    paragraphs: [
      "Platform, mühendislik ve üretim süreçlerinde yardımcı olması amacıyla teknik hesaplama araçları, referans içerikler ve raporlama şablonları sunar. Platformun sunduğu içerik ve araç çıktıları bilgilendirme niteliğindedir.",
      "Platform, belirli bir projenin tüm teknik ihtiyaçlarını eksiksiz karşılama, resmi standartlara mutlak uyum sağlama veya belirli bir sonucun gerçekleşeceğini taahhüt etmez.",
    ],
  },
  {
    title: "Kullanıcı Yükümlülükleri",
    bullets: [
      "Kullanıcı, Platformu yürürlükteki mevzuata, mesleki etik ilkelere ve iş güvenliği kurallarına uygun kullanmayı kabul eder.",
      "Kullanıcı, Platforma girdiği verilerin doğruluğundan, güncelliğinden ve hukuka uygunluğundan münhasıran sorumludur.",
      "Kullanıcı, araç çıktılarının nihai proje kararı olarak kullanılmasından önce uygun teknik doğrulama süreçlerini yürütmekle yükümlüdür.",
      "Kullanıcı, Platformun güvenliğini, performansını veya diğer kullanıcıların deneyimini olumsuz etkileyecek işlem ve girişimlerde bulunamaz.",
    ],
  },
  {
    title: "Doğruluk / Garanti Reddi",
    paragraphs: [
      "Platformdaki hesaplayıcılar ve içerikler \"olduğu gibi\" ve \"mevcut olduğu şekilde\" sunulmaktadır. Açık veya zımni hiçbir garanti verilmez.",
      "Hesaplama araçlarının doğruluğunu ve güncelliğini sağlamak için makul çaba gösterilmekle birlikte; veri kaynağı, kullanıcı girdisi, model varsayımları, standart güncellemeleri, uygulama koşulları ve çevresel etkiler nedeniyle sonuçların her durumda doğru, tam ve güncel olacağı garanti edilmez.",
      "Platform; kesintisiz çalışma, hatasız çıktı, belirli bir amaca uygunluk, satılabilirlik veya üçüncü taraf haklarını ihlal etmeme yönünde garanti vermez.",
    ],
  },
  {
    title: "Sorumluluk Sınırlandırması",
    paragraphs: [
      "TORQYX, sunulan hesaplama araçlarının doğruluğunu ve güncelliğini sağlamak için makul çabayı göstermektedir. Bununla birlikte, araç çıktılarının ve içeriklerin doğruluğu, eksiksizliği, güncelliği veya belirli bir amaca uygunluğu garanti edilmemektedir.",
      "Kullanıcı, Platformu kendi riskiyle kullandığını; hesaplama sonuçlarının, tasarım kararlarının ve uygulama çıktılarının yetkili bir profesyonel tarafından teyit edilmesinin kendi sorumluluğunda olduğunu kabul eder.",
      "Yürürlükteki hukukun izin verdiği azami ölçüde TORQYX; doğrudan, dolaylı, arızi, özel, cezai veya sonuç olarak doğan zararlardan; veri kaybı, kâr kaybı, iş kaybı, üretim duruşu, ürün geri çağırma maliyeti, tasarım hatası, kalite sorunu, sözleşmesel ceza veya üçüncü taraf taleplerinden sorumlu tutulamaz.",
      "Yasal olarak sorumluluğun tamamen bertaraf edilemediği hallerde TORQYX'in toplam sorumluluğu, yalnızca doğrudan zararlarla sınırlı olup, ilgili zarara konu talep tarihinden önceki son on iki (12) ay içinde Kullanıcının Platform için fiilen ödediği toplam bedeli aşamaz. Kullanıcı tarafından herhangi bir bedel ödenmemişse, azami sorumluluk tutarı sıfır (0) kabul edilir.",
    ],
  },
  {
    title: "Profesyonel Doğrulama Zorunluluğu",
    paragraphs: [
      "Platformdan elde edilen tüm mühendislik çıktıları; imalat, satın alma, devreye alma, test, saha uygulaması veya güvenlik açısından kritik kararlar öncesinde yetkili bir mühendis veya ilgili teknik sorumlu tarafından doğrulanmalıdır.",
      "Kullanıcı; uygulanabilir standartlar, yönetmelikler, müşteri şartnameleri, tolerans gereklilikleri ve iş güvenliği yükümlülükleriyle uyumu bağımsız olarak kontrol etmekle yükümlüdür.",
    ],
  },
  {
    title: "Fikri Mülkiyet",
    paragraphs: [
      "Platformdaki yazılım, tasarım, metin, görsel, veri düzeni, marka unsurları ve diğer tüm içerikler üzerindeki fikri ve sınai mülkiyet hakları TORQYX'e veya hak sahiplerine aittir.",
    ],
    bullets: [
      "İçeriklerin izinsiz kopyalanması, çoğaltılması, dağıtılması, yeniden yayımlanması veya ticari amaçla kullanılması yasaktır.",
      "Kullanıcıya yalnızca kişisel/kurumsal iç kullanım amacıyla, sınırlı ve devredilemez bir kullanım izni tanınır.",
    ],
  },
  {
    title: "Üçüncü Taraf Bağlantılar",
    paragraphs: [
      "Platform, üçüncü taraf sitelere, dokümantasyonlara veya servis sağlayıcılara bağlantılar içerebilir. Bu bağlantılar yalnızca kolaylık sağlamak amacıyla sunulur.",
      "Üçüncü taraf içeriklerin doğruluğu, güvenliği, güncelliği veya hukuka uygunluğu TORQYX'in kontrolünde değildir ve bu içeriklerden doğan sonuçlardan TORQYX sorumlu değildir.",
    ],
  },
  {
    title: "Hizmet Değişiklikleri",
    paragraphs: [
      "TORQYX, Platformun tamamında veya bir bölümünde, önceden bildirimde bulunmaksızın değişiklik yapma, geçici olarak askıya alma veya sonlandırma hakkını saklı tutar.",
      "Kullanım Şartları'ndaki güncellemeler bu sayfada yayımlandığı tarihte yürürlüğe girer. Kullanıcının Platformu kullanmaya devam etmesi, güncel şartların kabulü anlamına gelir.",
    ],
  },
  {
    title: "Uygulanacak Hukuk ve Yetkili Mahkeme",
    paragraphs: [
      "Bu Kullanım Şartları, kanunlar ihtilafı kuralları dikkate alınmaksızın Türkiye Cumhuriyeti hukukuna tabidir.",
      "Bu şartlardan doğan veya bunlarla bağlantılı her türlü uyuşmazlığın çözümünde İstanbul (Merkez) Mahkemeleri ve İcra Daireleri yetkilidir.",
    ],
  },
  {
    title: "İletişim",
    paragraphs: [
      "Kullanım Şartları ile ilgili sorularınız için Platform üzerindeki destek/iletişim kanallarını kullanabilirsiniz.",
      "Destek sayfası: /support",
    ],
  },
];

const termsSectionsEn: TermsSection[] = [
  {
    title: "Definitions",
    bullets: [
      "\"Platform\" or \"Service\" means the TORQYX website, calculators, content modules, reporting interfaces, and all related digital components.",
      "\"User\" means any natural person or legal entity accessing, using, or submitting data through the Platform.",
      "\"Content\" means all text, tables, visuals, technical notes, checklists, sample data, and related materials available on the Platform.",
      "\"Tool Output\" means any result, recommendation, summary, or report generated by calculators based on User inputs.",
      "\"Professional Verification\" means an independent technical review performed by a competent engineer, technical authority, or other duly authorized professional.",
    ],
  },
  {
    title: "Scope of Service",
    paragraphs: [
      "The Platform provides technical calculators, reference content, and reporting templates intended to support engineering and manufacturing workflows. All content and outputs are provided for informational and support purposes.",
      "The Platform does not warrant that it will satisfy all technical requirements of a specific project, provide absolute compliance with all standards, or guarantee any particular engineering or business outcome.",
    ],
  },
  {
    title: "User Obligations",
    bullets: [
      "The User shall use the Platform in compliance with applicable laws, professional ethics, and occupational safety requirements.",
      "The User is solely responsible for the accuracy, completeness, legality, and timeliness of all data entered into the Platform.",
      "The User must conduct appropriate technical validation before treating any Tool Output as a final engineering decision.",
      "The User shall not engage in any action that may impair platform security, performance, or the experience of other users.",
    ],
  },
  {
    title: "Accuracy / Warranty Disclaimer",
    paragraphs: [
      "The Platform and all Tool Outputs are provided on an \"as is\" and \"as available\" basis, without warranties of any kind, whether express or implied.",
      "While TORQYX uses reasonable efforts to maintain accuracy and currency, no guarantee is given that outputs are accurate, complete, current, or suitable for a particular purpose in all cases. Results may vary due to input quality, model assumptions, standards updates, implementation conditions, and environmental factors.",
      "TORQYX disclaims all implied warranties, including merchantability, fitness for a particular purpose, non-infringement, uninterrupted availability, and error-free operation.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "TORQYX makes reasonable efforts to maintain the accuracy and timeliness of its calculators and content. However, no guarantee is made regarding the accuracy, completeness, currency, or fitness of any Tool Output or content for a specific use case.",
      "The User acknowledges and agrees that use of the Platform is at the User's own risk, and that all engineering outcomes and implementation decisions must be independently verified by a competent professional.",
      "To the maximum extent permitted by law, TORQYX shall not be liable for any direct, indirect, incidental, special, punitive, or consequential damages, including but not limited to data loss, loss of profit, business interruption, production downtime, product recall costs, design defects, quality failures, contractual penalties, or third-party claims.",
      "Where liability cannot be fully excluded by law, TORQYX's aggregate liability shall be limited to direct damages only and shall not exceed the total amount actually paid by the User for the Platform in the twelve (12) months preceding the claim. If no fees were paid, the maximum aggregate liability shall be zero (0).",
    ],
  },
  {
    title: "Mandatory Professional Verification",
    paragraphs: [
      "All engineering outputs obtained from the Platform must be reviewed and verified by a qualified engineer or responsible technical professional before any manufacturing, procurement, commissioning, testing, site deployment, or safety-critical decision.",
      "The User remains responsible for independent compliance checks against applicable standards, regulations, customer specifications, tolerance requirements, and occupational safety obligations.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      "All intellectual and industrial property rights in the Platform, including software, design, text, graphics, data structures, and branding elements, belong to TORQYX or the relevant rights holders.",
    ],
    bullets: [
      "Unauthorized copying, reproduction, redistribution, republication, or commercial exploitation of Platform content is prohibited.",
      "Users are granted a limited, non-exclusive, non-transferable license for personal or internal business use only.",
    ],
  },
  {
    title: "Third-Party Links",
    paragraphs: [
      "The Platform may contain links to third-party websites, documentation, or service providers for convenience purposes only.",
      "TORQYX does not control and is not responsible for the accuracy, security, timeliness, legality, or performance of third-party content or services.",
    ],
  },
  {
    title: "Service Modifications",
    paragraphs: [
      "TORQYX reserves the right to modify, suspend, or discontinue any part of the Platform at any time, with or without prior notice.",
      "Updates to these Terms become effective upon publication on this page. Continued use of the Platform constitutes acceptance of the updated Terms.",
    ],
  },
  {
    title: "Governing Law and Jurisdiction",
    paragraphs: [
      "These Terms are governed by the laws of the Republic of Turkiye, without regard to conflict-of-law principles.",
      "Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the Istanbul (Central) Courts and Enforcement Offices.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "For questions regarding these Terms, please use the support/contact channels available on the Platform.",
      "Support page: /support",
    ],
  },
];

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const brandContent = getBrandCopy(locale as "tr" | "en");
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/kullanim-sartlari",
    locale: locale as "tr" | "en",
    alternatesLanguages: null,
  });
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  const copy = locale === "en" ? pageCopyEn : pageCopy;
  const sections = locale === "en" ? termsSectionsEn : termsSectionsTr;

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        imageSrc="/images/industrial-facility.webp"
        imageAlt={copy.imageAlt}
      />

      <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
        {sections.map((section, index) => (
          <section key={section.title} className="space-y-2">

            <h2 className="text-lg font-semibold text-slate-900">
              {index + 1}. {section.title}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
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
