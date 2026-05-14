import CookiePreferencesButton from "@/components/consent/CookiePreferencesButton";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "Gizlilik Politikası",
  description: "TORQYX'in veri işleme, çerez ve reklam teknolojileri yaklaşımı.",
  imageAlt: "Gizlilik politikası görseli",
};

const pageCopyEn = {
  title: "Privacy Policy",
  description: "How TORQYX handles data processing, cookies, and advertising technologies.",
  imageAlt: "Privacy policy visual",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/gizlilik",
    locale,
  });
}

const PrivacyContentTr = () => (
  <>
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">1. Veri sorumlusu ve kapsam</h2>
      <p>
        Veri sorumlusu TORQYX platform işletmecisidir. Bu metin, TORQYX web sitesi, hesaplayıcılar,
        hesap alanı, destek formları, çerez tercihleri ve raporlama yüzeylerinde işlenen kişisel verileri kapsar.
        Başvuru ve iletişim talepleri için İletişim sayfasını kullanabilirsiniz.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">2. İşlenen veri kategorileri</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Destek ve iletişim formlarında paylaştığınız ad, e-posta, mesaj içeriği ve ek dosya bilgileri.</li>
        <li>Hesap kullanıyorsanız kimlik doğrulama, tercih, favori araç ve son kullanılan araç bilgileri.</li>
        <li>Tarayıcıda tutulan dil, çerez tercihi, yerel hesap geçmişi ve proje aracı kayıtları.</li>
        <li>Güvenlik ve performans için IP adresi, cihaz, tarayıcı, zaman damgası ve teknik günlük verileri.</li>
        <li>Açık rıza verdiğinizde analitik ve reklam ölçüm verileri.</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">3. Amaç ve hukuki sebep</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Hesaplayıcıları, raporları ve kaydedilen tercihleri sunmak: sözleşmenin kurulması/ifası ve meşru menfaat.</li>
        <li>Destek taleplerini yanıtlamak: talebinizin yerine getirilmesi, sözleşmenin ifası ve meşru menfaat.</li>
        <li>Güvenliği sağlamak, kötüye kullanımı önlemek ve günlük kayıtlarını tutmak: meşru menfaat ve hukuki yükümlülük.</li>
        <li>Analitik ölçüm ve deneyim iyileştirme: yalnızca çerez panelinde verdiğiniz açık rıza.</li>
        <li>Reklam gösterimi, kişiselleştirme ve reklam performansı: yalnızca çerez panelinde verdiğiniz açık rıza.</li>
      </ul>
      <p>
        Aydınlatma metni, açık rıza yerine geçmez. Zorunlu çerezler hizmet için gerekli olduğu ölçüde çalışır;
        analitik ve reklam teknolojileri tercih panelinden izin verilmeden yüklenmez.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">4. Saklama süreleri</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Çerez rızası ve dil tercihleri: en fazla 12 ay veya tercihinizi değiştirene kadar.</li>
        <li>Yerel hesap geçmişi, favoriler ve proje aracı kayıtları: tarayıcıda siz silene kadar.</li>
        <li>Destek talepleri: talebin kapanmasından sonra en fazla 24 ay.</li>
        <li>Hesap ve senkronize kullanıcı durumu: hesap aktif olduğu sürece; silme talebinden sonra makul teknik süre içinde.</li>
        <li>Güvenlik günlükleri: kötüye kullanım incelemesi ve yasal yükümlülükler için en fazla 12 ay.</li>
        <li>Analitik ölçümler: toplulaştırılmış raporlarda en fazla 14 ay.</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">5. Aktarım ve üçüncü taraflar</h2>
      <p>
        Kişisel verilerinizi satmayız. Hizmetin işletilmesi için barındırma, güvenlik, kimlik doğrulama,
        veritabanı, dosya depolama, destek, analitik ve reklam tedarikçileriyle sınırlı aktarım yapılabilir.
        Analitik ve reklam tedarikçileri yalnızca ilgili çerez kategorisine izin verdiğinizde çalışır.
        Yurt dışı aktarım gerektiren tedarikçilerde uygulanabilir güvenceler ve ilgili mevzuat şartları dikkate alınır.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">6. Haklarınız ve tercih yönetimi</h2>
      <p>
        Verilerinize erişme, düzeltme, silme, işlemeyi sınırlandırma, itiraz etme ve uygulanabilir olduğu ölçüde
        veri taşınabilirliği haklarınızı kullanabilirsiniz. Taleplerinizi İletişim sayfasından iletebilirsiniz.
      </p>
      <CookiePreferencesButton locale="tr" />
    </section>
  </>
);

const PrivacyContentEn = () => (
  <>
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">1. Controller and scope</h2>
      <p>
        The controller is the TORQYX platform operator. This notice covers personal data processed on the TORQYX
        website, calculators, account area, support forms, cookie preferences, and reporting surfaces. Use the Contact
        page for privacy requests.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">2. Data categories</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Name, email, message content, and attachment data submitted through support or contact forms.</li>
        <li>Authentication, preference, favorite tool, and recently used tool data if you use an account.</li>
        <li>Language, cookie consent, local calculation history, and project-tool records stored in your browser.</li>
        <li>IP address, device, browser, timestamp, and technical logs for security and performance.</li>
        <li>Analytics and advertising measurement data when you consent to those categories.</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">3. Purposes and legal bases</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Provide calculators, reports, and saved preferences: contract performance and legitimate interests.</li>
        <li>Respond to support requests: requested service, contract performance, and legitimate interests.</li>
        <li>Maintain security, prevent abuse, and keep logs: legitimate interests and legal obligations.</li>
        <li>Analytics measurement and experience improvement: your consent in the cookie panel.</li>
        <li>Ad delivery, personalization, and ad performance: your consent in the cookie panel.</li>
      </ul>
      <p>
        This notice is not a consent request. Necessary cookies run only as needed for the service; analytics and
        advertising technologies do not load until you allow them in the preferences panel.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">4. Retention</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Cookie consent and language preferences: up to 12 months or until changed.</li>
        <li>Local calculation history, favorites, and project-tool records: until you clear browser storage.</li>
        <li>Support requests: up to 24 months after closure.</li>
        <li>Account and synced user state: while the account is active, then within a reasonable technical deletion period.</li>
        <li>Security logs: up to 12 months for abuse review and legal requirements.</li>
        <li>Analytics measurements: up to 14 months in aggregated reports.</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">5. Sharing and transfers</h2>
      <p>
        We do not sell personal data. Limited sharing may occur with hosting, security, authentication, database,
        file storage, support, analytics, and advertising providers. Analytics and advertising providers are used only
        after you consent to the relevant category. Where vendors involve international transfers, we consider applicable
        safeguards and legal requirements.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">6. Your rights and preference management</h2>
      <p>
        You can request access, correction, deletion, restriction, objection, and data portability where applicable.
        Submit requests through the Contact page.
      </p>
      <CookiePreferencesButton locale="en" />
    </section>
  </>
);

export default async function PrivacyPolicyPage() {
  const locale = await getLocaleFromCookies();
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        imageSrc={getHeroImageSrc("privacy")}
        imageAlt={copy.imageAlt}
      />

      <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{copy.title}</h2>
        {locale === "en" ? <PrivacyContentEn /> : <PrivacyContentTr />}
      </article>
    </PageShell>
  );
}
