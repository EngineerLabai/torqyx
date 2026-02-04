import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "8D Raporu",
    description: "8D adimlarini doldurmak icin etkilesimli rapor taslagi.",
  },
  en: {
    title: "8D Report",
    description: "Interactive draft to fill in the 8D steps.",
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
      path="/quality-tools/8d"
      locale={locale}
    />
  );
}
