import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import { getHeroImageSrc } from "@/lib/assets";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.faq;
  const title = locale === "tr" ? "Sık Sorulan Sorular" : copy.title;
  const description =
    locale === "tr"
      ? "AI Engineers Lab hesaplayıcıları hakkında merak edilenler. Hesap motoru nasıl çalışır, sonuçlar güvenilir mi, premium ne sunar?"
      : copy.description;

  return buildPageMetadata({
    title,
    description,
    path: "/faq",
    locale,
  });
}

export default async function FaqPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.faq;
  const heroImage = getHeroImageSrc("support");
  const imageAlt = "Torqyx Engineering - Support Hero";

  return (
    <PageShell>
      <PageHero
        title={copy.title}
        description={copy.description}
        eyebrow={copy.badge}
        imageSrc={heroImage}
        imageAlt={imageAlt}
      />

      {copy.categories.map((category) => (
        <section key={category.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold tracking-tight">
        FAQ
      </h1>

          <h2 className="text-lg font-semibold text-slate-900">{category.title}</h2>
          <dl className="mt-4 grid gap-3">
            {category.items.map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <dt className="text-sm font-semibold text-slate-900">{item.q}</dt>
                <dd className="mt-2 text-sm text-slate-700">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </PageShell>
  );
}
