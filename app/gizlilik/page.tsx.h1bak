import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "Gizlilik Politikası",
  description: "AI Engineers Lab’in veri işleme, çerez ve reklam teknolojileri yaklaşımı.",
  imageAlt: "Gizlilik politikası görseli",
};

const pageCopyEn = {
  title: "Privacy Policy",
  description: "How AI Engineers Lab handles data processing, cookies, and advertising technologies.",
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
    alternatesLanguages: null,
  });
}

export default async function PrivacyPolicyPage() {
  const locale = await getLocaleFromCookies();

  if (locale === "en") {
    return (
      <PageShell>
        <PageHero
          title={pageCopyEn.title}
          description={pageCopyEn.description}
          imageSrc={HERO_PLACEHOLDER}
          imageAlt={pageCopyEn.imageAlt}
        />

        <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">1. Information we collect</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Name, email, and message content shared through the contact form.</li>
              <li>Usage, device, browser, IP address, and similar technical log data.</li>
              <li>Preferences and session data collected via cookies and similar technologies.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">2. How we use data</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Respond to requests and support messages.</li>
              <li>Improve product performance and user experience.</li>
              <li>Maintain security, prevent abuse, and meet legal obligations.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">3. Google AdSense and third-party cookies</h2>
            <p>
              Advertising providers such as Google AdSense may use cookies or similar identifiers to personalize ads and measure
              performance. These are third-party cookies and may show ads based on your interests.
            </p>
            <p>
              You can manage ad personalization preferences via{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-emerald-700 hover:underline"
              >
                Google Ads Settings
              </a>
              . Alternatively, you can adjust preferences through{" "}
              <a
                href="https://www.aboutads.info/choices"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-emerald-700 hover:underline"
              >
                YourAdChoices
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">4. Data sharing</h2>
            <p>
              We do not sell personal data. Limited sharing may occur with hosting, analytics, and infrastructure providers to deliver
              the service. Information may be shared with authorities when legally required.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">5. Your rights</h2>
            <p>
              You can request access, correction, or deletion of your data by contacting us. Use the Contact page to submit your request.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">6. Updates</h2>
            <p>This policy may be updated from time to time. Updates will be published on this page.</p>
          </section>
        </article>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        title={pageCopy.title}
        description={pageCopy.description}
        imageSrc={HERO_PLACEHOLDER}
        imageAlt={pageCopy.imageAlt}
      />

      <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">1. Toplanan bilgiler</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>İletişim formu üzerinden paylaşılan ad, e-posta ve mesaj içerikleri.</li>
            <li>Site kullanımı, cihaz, tarayıcı, IP adresi ve benzeri teknik günlük verileri.</li>
            <li>Çerezler ve benzeri teknolojilerle toplanan tercih ve oturum bilgileri.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">2. Verileri nasıl kullanıyoruz?</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Talep ve destek mesajlarını yanıtlamak, hizmeti yürütmek.</li>
            <li>Ürün performansını ve deneyimi iyileştirmek.</li>
            <li>Güvenlik, kötüye kullanım önleme ve yasal yükümlülükleri yerine getirmek.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">3. Google ve üçüncü taraf reklam çerezleri</h2>
          <p>
            Google AdSense gibi reklam sağlayıcıları, reklamların kişiselleştirilmesi ve performans ölçümü için çerezler
            veya benzeri tanımlayıcılar kullanabilir. Bu çerezler üçüncü taraf çerezleridir ve ilgi alanlarına göre
            reklam gösterebilir.
          </p>
          <p>
            Reklam kişiselleştirme tercihlerini{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Google Reklam Ayarları
            </a>{" "}
            üzerinden yönetebilirsiniz. Alternatif olarak{" "}
            <a
              href="https://www.aboutads.info/choices"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-700 hover:underline"
            >
              YourAdChoices
            </a>{" "}
            üzerinden de tercihlerinizi düzenleyebilirsiniz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">4. Verilerin paylaşılması</h2>
          <p>
            Kişisel verilerinizi satmayız. Hizmetin sunumu için barındırma, analiz ve altyapı sağlayıcılarıyla sınırlı
            paylaşım yapılabilir. Yasal yükümlülükler kapsamında yetkili kurumlara bilgi sağlanabilir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">5. Haklarınız</h2>
          <p>
            Verilerinize erişim, düzeltme veya silme talepleriniz için bizimle iletişime geçebilirsiniz. Taleplerinizi
            iletmek için İletişim sayfasındaki formu kullanabilirsiniz.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">6. Güncellemeler</h2>
          <p>
            Bu politika zaman zaman güncellenebilir. Güncellemeler bu sayfa üzerinden yayınlanır.
          </p>
        </section>
      </article>
    </PageShell>
  );
}
