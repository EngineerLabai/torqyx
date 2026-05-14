import CookiePreferencesButton from "@/components/consent/CookiePreferencesButton";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "Çerez Politikası",
  description: "Çerez türleri, kullanım amaçları ve tercih yönetimi.",
  imageAlt: "Çerez politikası görseli",
};

const pageCopyEn = {
  title: "Cookie Policy",
  description: "Cookie types, how we use them, and how you can manage preferences.",
  imageAlt: "Cookie policy visual",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/cerez-politikasi",
    locale,
  });
}

const cookieRowsTr = [
  ["Gerekli", "ael_consent, ael_consent_prefs", "Rıza durumunu ve kategori tercihlerini saklar.", "12 ay"],
  ["Gerekli", "ael_locale, NEXT_LOCALE", "Dil tercihini ve yerelleştirilmiş yönlendirmeyi korur.", "12 ay"],
  ["Gerekli", "torqyx:favorites, torqyx:recents, tool-history:*", "Favori araçları, son kullanılan araçları ve yerel hesap geçmişini tarayıcıda tutar.", "Siz silene kadar"],
  ["Gerekli", "Proje aracı yerel kayıtları", "RFQ, parça takibi ve proje listesi gibi araçlarda yerel çalışma kayıtlarını saklar.", "Siz silene kadar"],
  ["Analitik", "/api/analytics ve analitik etiketleri", "Kullanım eğilimlerini, performansı ve ürün iyileştirme sinyallerini ölçer.", "En fazla 14 ay"],
  ["Reklam", "Google AdSense / reklam tanımlayıcıları", "Reklam gösterimi, kişiselleştirme ve performans ölçümü için kullanılır.", "Tedarikçi süresine göre"],
] as const;

const cookieRowsEn = [
  ["Necessary", "ael_consent, ael_consent_prefs", "Stores consent status and category preferences.", "12 months"],
  ["Necessary", "ael_locale, NEXT_LOCALE", "Keeps language preference and localized routing.", "12 months"],
  ["Necessary", "torqyx:favorites, torqyx:recents, tool-history:*", "Stores favorite tools, recent tools, and local calculation history in the browser.", "Until you clear it"],
  ["Necessary", "Local project-tool records", "Stores local work records for RFQ, part tracking, and project lists.", "Until you clear it"],
  ["Analytics", "/api/analytics and analytics tags", "Measures usage trends, performance, and product improvement signals.", "Up to 14 months"],
  ["Advertising", "Google AdSense / ad identifiers", "Used for ad delivery, personalization, and performance measurement.", "Vendor-dependent"],
] as const;

function CookieTable({ locale }: { locale: "tr" | "en" }) {
  const rows = locale === "tr" ? cookieRowsTr : cookieRowsEn;
  const headers =
    locale === "tr"
      ? ["Kategori", "Anahtar / teknoloji", "Amaç", "Saklama"]
      : ["Category", "Key / technology", "Purpose", "Retention"];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            {headers.map((header) => (
              <th key={header} scope="col" className="py-3 pr-4 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(([category, key, purpose, retention]) => (
            <tr key={`${category}-${key}`}>
              <th scope="row" className="py-3 pr-4 font-semibold text-slate-900">
                {category}
              </th>
              <td className="py-3 pr-4 font-mono text-xs text-slate-700">{key}</td>
              <td className="py-3 pr-4 text-slate-700">{purpose}</td>
              <td className="py-3 pr-4 text-slate-700">{retention}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CookiePolicyTr = () => (
  <>
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">1. Çerez ve benzeri teknolojiler</h2>
      <p>
        Çerezler, yerel depolama kayıtları ve benzeri teknolojiler siteyi çalıştırmak, tercihlerinizi hatırlamak,
        güvenliği korumak ve izin verdiğiniz durumlarda ölçüm veya reklam işlevlerini etkinleştirmek için kullanılır.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">2. Kullandığımız kategoriler</h2>
      <CookieTable locale="tr" />
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">3. Açık rıza ve tercih yönetimi</h2>
      <p>
        Gerekli çerezler hizmetin çalışması için kullanılır ve kapatılamaz. Analitik ve reklam kategorileri
        yalnızca çerez tercih panelinde açık rıza verdiğinizde etkinleşir. Rızanızı istediğiniz zaman geri alabilirsiniz.
      </p>
      <CookiePreferencesButton locale="tr" />
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">4. Tarayıcı ayarları</h2>
      <p>
        Tarayıcınızdan çerezleri silebilir veya engelleyebilirsiniz. Gerekli çerezleri engellemeniz bazı hesap,
        dil, tercih ve kayıt özelliklerinin çalışmasını etkileyebilir.
      </p>
    </section>
  </>
);

const CookiePolicyEn = () => (
  <>
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">1. Cookies and similar technologies</h2>
      <p>
        Cookies, local storage records, and similar technologies are used to run the site, remember preferences,
        maintain security, and enable measurement or advertising features when you allow them.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">2. Categories we use</h2>
      <CookieTable locale="en" />
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">3. Consent and preference management</h2>
      <p>
        Necessary cookies are used for the service to work and cannot be disabled in the site panel. Analytics and
        advertising categories are enabled only when you consent in the cookie preferences panel. You can withdraw
        consent at any time.
      </p>
      <CookiePreferencesButton locale="en" />
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">4. Browser settings</h2>
      <p>
        You can delete or block cookies in your browser settings. Blocking necessary cookies may affect account,
        language, preference, and saved-record features.
      </p>
    </section>
  </>
);

export default async function CookiePolicyPage() {
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

      <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{copy.title}</h2>
        {locale === "en" ? <CookiePolicyEn /> : <CookiePolicyTr />}
      </article>
    </PageShell>
  );
}
