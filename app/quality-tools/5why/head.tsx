import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "5 Why Kok Neden Analizi",
    description: "Kok neden analizi icin 5 Why zinciri olustur.",
  },
  en: {
    title: "5 Whys Root Cause Analysis",
    description: "Build a 5 Whys chain for root cause analysis.",
  },
};

export default async function Head() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const { title, description } = copy[locale];

  return (
    <StaticHead
      title={`${title} | ${brandContent.siteName}`}
      description={description}
      path="/quality-tools/5why"
      locale={locale}
    />
  );
}
