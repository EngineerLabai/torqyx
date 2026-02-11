import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import SupportForm from "@/components/support/SupportForm";
import { getBrandCopy } from "@/config/brand";
import { HERO_PLACEHOLDER } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

const pageCopy = {
  title: "İletişim",
  description: "Sorular, geri bildirimler ve iş birliği talepleri için bize ulaşın.",
  imageAlt: "İletişim sayfası görseli",
};

const pageCopyEn = {
  title: "Contact",
  description: "Reach out for questions, feedback, or collaboration requests.",
  imageAlt: "Contact page visual",
};

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = locale === "en" ? pageCopyEn : pageCopy;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/iletisim",
    locale,
    alternatesLanguages: null,
  });
}

export default async function ContactPage() {
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

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700 md:text-base">
            Use the form below for technical questions, new tool requests, or collaboration ideas. If you can share inputs, units, and
            expected results, we can review faster.
          </p>
          <SupportForm />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Support guidance</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Include the calculator name or page URL.</li>
            <li>Share input values, units, and the expected outcome.</li>
            <li>If it is urgent, mention it at the top of your message.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Response time</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>We typically respond to weekday requests within 1-2 business days.</li>
            <li>Providing context and attachments helps us resolve issues faster.</li>
          </ul>
        </section>
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
