import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "Hakkında",
  description: "Metodoloji odaklı mühendislik hesapları, notlar ve pratik araçlar.",
  imageAlt: "AI Engineers Lab hakkında görsel",
};

const pageCopyEn = {
  title: "About",
  description: "Methodology-first engineering calculations, notes, and practical tools.",
  imageAlt: "About AI Engineers Lab",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/hakkinda",
    locale,
    alternatesLanguages: null,
  });
}

export default async function AboutPage() {
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

        <article className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm md:text-base">
          <p>
            AI Engineers Lab is an engineering workspace built for mechanical design and manufacturing decisions. We bring calculators,
            reference tables, and guides together so quick checks are clear and repeatable.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Repeatable calculation flows with methodology notes</li>
            <li>Clear input/output structure for fast verification</li>
            <li>Practical templates for project, quality, and fixture workflows</li>
          </ul>
          <p>
            Our goal is to support critical decisions with a reliable, concise reference. Share your feedback or requests from the
            Contact page.
          </p>
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
