import WebPageJsonLd from "@/components/seo/WebPageJsonLd";
import HeroSection from "@/sections/home/HeroSection";
import PopularToolsSection from "@/sections/home/PopularToolsSection";
import PricingTeaserSection from "@/sections/home/PricingTeaserSection";
import ValuePropsSection from "@/sections/home/ValuePropsSection";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).home.seo;
  const description =
    locale === "tr"
      ? "ISO/DIN/VDI standartlarına dayalı deterministik mühendislik hesaplayıcıları. Tahmin değil standart temelli sonuç. 500+ mühendis kullanıyor."
      : copy.description;
  const baseTitle = locale === "tr" ? "Mekanik Mühendislik Hesaplayıcıları" : "Mechanical Engineering Calculators";
  const base = buildPageMetadata({
    title: baseTitle,
    description,
    path: "/",
    locale,
    openGraph: {
      siteName: brandContent.siteName,
    },
  });

  if (locale !== "tr") {
    return base;
  }

  return {
    ...base,
    title: "TORQYX — Mekanik Mühendislik Hesaplayıcıları",
    description,
    openGraph: {
      ...(base.openGraph ?? {}),
      title: "TORQYX — Mekanik Mühendislik Hesaplayıcıları",
      description,
    },
    twitter: {
      ...(base.twitter ?? {}),
      title: "TORQYX — Mekanik Mühendislik Hesaplayıcıları",
      description,
    },
  };
}

export default async function Home() {
  const locale = await getLocaleFromCookies();
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <h1 className="sr-only">
        {locale === "tr"
          ? "TORQYX — Mekanik Mühendislik Hesaplayıcıları"
          : "TORQYX — Mechanical Engineering Calculators"}
      </h1>

      <WebPageJsonLd />
      <HeroSection locale={locale} />
      <ValuePropsSection locale={locale} />
      <PopularToolsSection locale={locale} />
      <PricingTeaserSection locale={locale} />
    </main>
  );
}
