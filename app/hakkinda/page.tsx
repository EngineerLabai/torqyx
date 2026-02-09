import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "Hakkında",
  description: "Metodoloji odaklı mühendislik hesapları, notlar ve pratik araçlar.",
  imageAlt: "AI Engineers Lab hakkında görsel",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const isTurkish = locale === "tr";

  return buildPageMetadata({
    title: `${isTurkish ? pageCopy.title : fallbackCopy.title} | ${brandContent.siteName}`,
    description: isTurkish ? pageCopy.description : fallbackCopy.description,
    path: "/hakkinda",
    locale,
    alternatesLanguages: null,
  });
}

export default async function AboutPage() {
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

      <article className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
        <p>
          AI Engineers Lab, mekanik tasarım ve üretim kararlarında hızlı, okunur ve güvenilir hesaplar sunmayı hedefleyen
          bir mühendislik laboratuvarıdır. Hesaplayıcılar, referans tabloları ve rehberler; kısa doğrulama adımlarını
          standart hale getirmek için tasarlanmıştır.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Tekrarlanabilir hesap akışları ve metodoloji notları</li>
          <li>Net giriş/çıkış yapısıyla hızlı doğrulama</li>
          <li>Projeler, kalite ve fikstür çalışmalarına yönelik pratik şablonlar</li>
        </ul>
        <p>
          Amacımız, kritik kararları desteklemek için güvenilir bir yardımcı kaynak sunmaktır. Geri bildirimlerinizi
          İletişim sayfasından paylaşabilirsiniz.
        </p>
      </article>
    </PageShell>
  );
}
