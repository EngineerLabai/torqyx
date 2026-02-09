import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "Çerez Politikası",
  description: "Çerez türleri, kullanım amaçları ve tercih yönetimi.",
  imageAlt: "Çerez politikası görseli",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const isTurkish = locale === "tr";

  return buildPageMetadata({
    title: `${isTurkish ? pageCopy.title : fallbackCopy.title} | ${brandContent.siteName}`,
    description: isTurkish ? pageCopy.description : fallbackCopy.description,
    path: "/cerez-politikasi",
    locale,
    alternatesLanguages: null,
  });
}

export default async function CookiePolicyPage() {
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
