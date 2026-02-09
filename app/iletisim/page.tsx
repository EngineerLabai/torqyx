import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import SupportForm from "@/components/support/SupportForm";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "İletişim",
  description: "Sorular, geri bildirimler ve iş birliği talepleri için bize ulaşın.",
  imageAlt: "İletişim sayfası görseli",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const fallbackCopy = getMessages(locale).pages.contentFallback;
  const isTurkish = locale === "tr";

  return buildPageMetadata({
    title: `${isTurkish ? pageCopy.title : fallbackCopy.title} | ${brandContent.siteName}`,
    description: isTurkish ? pageCopy.description : fallbackCopy.description,
    path: "/iletisim",
    locale,
    alternatesLanguages: null,
  });
}

export default async function ContactPage() {
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-700 md:text-base">
          Teknik sorular, yeni araç talepleri veya iş birliği için aşağıdaki formu kullanabilirsiniz. Ek dosya veya
          bağlantı paylaşırsanız inceleme sürecimiz hızlanır.
        </p>
        <SupportForm />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Yanıt süresi</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Hafta içi taleplere genellikle 1-2 iş günü içinde dönüş yapıyoruz.</li>
          <li>Acil notlarınızı mesaj alanında belirtmeniz süreci hızlandırır.</li>
        </ul>
      </section>
    </PageShell>
  );
}
