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
    alternatesLanguages: null,
  });
}

export default async function CookiePolicyPage() {
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
            <h2 className="text-lg font-semibold text-slate-900">1. What are cookies?</h2>
            <p>
              Cookies are small data files stored in your browser that help us improve the site experience and remember your preferences.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">2. Cookie categories we use</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-semibold text-slate-900">Essential:</span> Required for session management, security, and core
                functionality.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Analytics:</span> Helps us understand usage and improve performance.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Advertising:</span> May be used for ad personalization and performance
                measurement.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">3. How to manage preferences</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>You can update consent from the Cookie Preferences panel on the site.</li>
              <li>You can delete or block cookies from your browser settings.</li>
            </ul>
            <p>If you decline analytics or advertising cookies, those tags will not load.</p>
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
          <h2 className="text-lg font-semibold text-slate-900">1. Çerez nedir?</h2>
          <p>
            Çerezler, tarayıcınızda saklanan ve site deneyimini iyileştirmemize yardımcı olan küçük veri dosyalarıdır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">2. Kullandığımız çerez kategorileri</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold text-slate-900">Zorunlu:</span> Oturum yönetimi, güvenlik ve temel işlevler
              için gereklidir.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Analitik:</span> Site kullanımını anlamamıza ve
              performansı geliştirmemize yardımcı olur.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Reklam:</span> Reklamların kişiselleştirilmesi ve
              performans ölçümü için kullanılabilir.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">3. Tercihlerinizi nasıl değiştirirsiniz?</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Site üzerindeki Çerez Tercihleri panelinden izinlerinizi güncelleyebilirsiniz.</li>
            <li>Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz.</li>
          </ul>
          <p>
            Analitik veya reklam çerezlerini reddetmeniz halinde ilgili etiketler yüklenmez.
          </p>
        </section>
      </article>
    </PageShell>
  );
}
