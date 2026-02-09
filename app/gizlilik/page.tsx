import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "Gizlilik Politikası",
  description: "AI Engineers Lab’in veri işleme, çerez ve reklam teknolojileri yaklaşımı.",
  imageAlt: "Gizlilik politikası görseli",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const isTurkish = locale === "tr";

  return buildPageMetadata({
    title: `${isTurkish ? pageCopy.title : fallbackCopy.title} | ${brandContent.siteName}`,
    description: isTurkish ? pageCopy.description : fallbackCopy.description,
    path: "/gizlilik",
    locale,
    alternatesLanguages: null,
  });
}

export default async function PrivacyPolicyPage() {
  const locale = await getLocaleFromCookies();
  const fallbackCopy = getMessages(locale).pages.contentFallback;

  if (locale !== "tr") {
    return (
      <PageShell>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">{fallbackCopy.title}</h1>
          <p className="mt-3">{fallbackCopy.description}</p>
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
