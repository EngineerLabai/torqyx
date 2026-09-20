import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy, SITE_CONTACT_EMAIL } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

type PolicySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const pageCopy = {
  title: "Mesafeli Satış, İade ve Teslimat Politikası",
  description:
    "TORQYX dijital hizmetleri için satın alma, elektronik teslimat, abonelik iptali, iade talebi ve destek süreçleri.",
  imageAlt: "Satış, iade ve teslimat politikası görseli",
  updated: "Son güncelleme: 28 Haziran 2026",
};

const pageCopyEn = {
  title: "Sales, Refunds and Delivery Policy",
  description:
    "Purchase, electronic delivery, subscription cancellation, refund request, and support terms for TORQYX digital services.",
  imageAlt: "Sales, refunds and delivery policy visual",
  updated: "Last updated: June 28, 2026",
};

const sectionsTr: PolicySection[] = [
  {
    title: "1. Kapsam",
    paragraphs: [
      "Bu politika, TORQYX web sitesi üzerinden sunulan mühendislik hesaplayıcıları, raporlama özellikleri, dijital içerikler, ücretsiz kullanım alanları ve ileride açılabilecek ücretli abonelik/dijital erişim hizmetleri için geçerlidir.",
      "TORQYX fiziksel ürün, kargo ile gönderilen parça veya stoklu mal satışı yapmaz. Bu nedenle bu sayfadaki teslimat hükümleri dijital hizmete erişim, hesap özelliklerinin açılması ve destek yanıtlarının iletilmesi anlamında kullanılır.",
    ],
  },
  {
    title: "2. Satın alma ve hizmetin kurulması",
    bullets: [
      "Ücretli bir plan veya dijital erişim satın alındığında kullanıcıya ödeme ekranında plan kapsamı, fiyat, vergi/masraf bilgisi, yenileme koşulu ve varsa deneme süresi gösterilir.",
      "Satın alma işlemi tamamlandıktan sonra plan hakkı, ödeme sağlayıcısından başarılı yanıt alınmasını izleyen makul teknik süre içinde hesaba tanımlanır.",
      "Teknik kesinti, ödeme sağlayıcısı gecikmesi veya kimlik doğrulama problemi oluşursa kullanıcı destek kanalından talep açabilir.",
    ],
  },
  {
    title: "3. Dijital teslimat",
    paragraphs: [
      "Teslimat elektronik ortamda yapılır. Hesaplayıcı, raporlama, kayıtlı hesap veya proje aracı gibi özellikler tarayıcı üzerinden erişime açılır; fiziksel sevkiyat, kargo takip numarası veya depo teslimi bulunmaz.",
      "Erişim problemi yaşanırsa talebinize yanıt verebilmek için hesap e-postası, işlem tarihi, kullanılan sayfa URL'si ve mümkünse ekran görüntüsü paylaşmanız istenir.",
    ],
  },
  {
    title: "4. İptal ve cayma talepleri",
    bullets: [
      "Abonelik yenilemeleri, ödeme altyapısının sunduğu hesap veya destek kanalları üzerinden iptal edilebilir.",
      "Dijital hizmetin kullanılmaya başlanması, rapor üretilmesi veya hesap özelliklerinin aktif kullanılması halinde iade değerlendirmesi hizmetin niteliğine, kullanılan süreye ve uygulanabilir mevzuata göre yapılır.",
      "Yanlış plan seçimi, mükerrer ödeme, teknik erişim problemi veya hizmetin vaat edilen temel işlevini sunamaması gibi durumlarda destek kanalına başvurarak iade incelemesi talep edebilirsiniz.",
    ],
  },
  {
    title: "5. İade değerlendirme süreci",
    paragraphs: [
      "İade talepleri olay bazında incelenir. Değerlendirmede ödeme kaydı, kullanım geçmişi, teknik hata kayıtları, destek yazışmaları ve hizmete erişim durumu dikkate alınır.",
      "Onaylanan iadeler mümkün olduğunda ilk ödeme yöntemine yapılır. Banka veya ödeme kuruluşu kaynaklı yansıma süreleri TORQYX kontrolü dışında değişebilir.",
    ],
  },
  {
    title: "6. Ücretsiz araçlar ve reklam destekli kullanım",
    paragraphs: [
      "Ücretsiz hesaplayıcılar kayıt veya ödeme gerektirmeden kullanılabilir. Ücretsiz erişim, hizmetin her zaman kesintisiz, hatasız veya belirli bir proje için yeterli olacağı anlamına gelmez.",
      "Reklam destekli sayfalarda reklam ve çerez tercihleri Gizlilik Politikası ile Çerez Politikası kapsamında yönetilir.",
    ],
  },
  {
    title: "7. Destek ve iletişim",
    paragraphs: [
      `Satış, iptal, iade, teslimat veya fatura niteliğindeki talepler için ${SITE_CONTACT_EMAIL} adresine e-posta gönderebilir ya da İletişim sayfasındaki destek formunu kullanabilirsiniz.`,
      "Başvurunuzda işlem e-postası, işlem tarihi, ilgili plan veya sayfa adı ve talebin kısa açıklaması yer alırsa inceleme daha hızlı tamamlanır.",
    ],
  },
];

const sectionsEn: PolicySection[] = [
  {
    title: "1. Scope",
    paragraphs: [
      "This policy applies to engineering calculators, reporting features, digital content, free access areas, and any paid subscription or digital access services offered through the TORQYX website.",
      "TORQYX does not sell physical goods, stocked parts, or items shipped by courier. Delivery in this policy means digital access to the service, activation of account features, and support responses.",
    ],
  },
  {
    title: "2. Purchase and service activation",
    bullets: [
      "When a paid plan or digital access product is offered, the checkout flow displays plan scope, price, tax or fee information, renewal terms, and any trial period.",
      "After a successful purchase, access is assigned to the account within a reasonable technical period after confirmation from the payment provider.",
      "If a technical outage, payment-provider delay, or authentication problem occurs, users can contact support.",
    ],
  },
  {
    title: "3. Digital delivery",
    paragraphs: [
      "Delivery is electronic. Calculator, reporting, saved calculation, or project-tool features are made available through the browser; there is no physical shipment, tracking number, or warehouse delivery.",
      "For access issues, support may ask for the account email, transaction date, page URL, and a screenshot where possible.",
    ],
  },
  {
    title: "4. Cancellation and withdrawal requests",
    bullets: [
      "Subscription renewals can be cancelled through the account or support channels provided by the payment infrastructure.",
      "When a digital service has already been accessed, reports have been generated, or account features have been actively used, refund eligibility is reviewed according to service nature, usage, and applicable law.",
      "You may request a refund review for wrong plan selection, duplicate payment, technical access failure, or failure of the service to provide its core promised function.",
    ],
  },
  {
    title: "5. Refund review process",
    paragraphs: [
      "Refund requests are reviewed case by case. Payment records, usage history, technical error logs, support correspondence, and access status may be considered.",
      "Approved refunds are issued to the original payment method where possible. Bank or payment-provider processing times are outside TORQYX control.",
    ],
  },
  {
    title: "6. Free tools and ad-supported use",
    paragraphs: [
      "Free calculators may be used without registration or payment. Free access does not mean the service will always be uninterrupted, error-free, or sufficient for a specific project.",
      "On ad-supported pages, advertising and cookie preferences are managed under the Privacy Policy and Cookie Policy.",
    ],
  },
  {
    title: "7. Support and contact",
    paragraphs: [
      `For sales, cancellation, refund, delivery, or billing-related requests, email ${SITE_CONTACT_EMAIL} or use the support form on the Contact page.`,
      "Including the transaction email, transaction date, plan or page name, and a short explanation helps us review the request faster.",
    ],
  },
];

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/satis-iade-teslimat",
    locale,
  });
}

export default async function SalesRefundDeliveryPage() {
  const locale = await getLocaleFromCookies();
  const copy = locale === "en" ? pageCopyEn : pageCopy;
  const sections = locale === "en" ? sectionsEn : sectionsTr;

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        imageSrc={getHeroImageSrc("privacy")}
        imageAlt={copy.imageAlt}
      />

      <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.updated}</p>
        {sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed">
                {paragraph}
              </p>
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
