import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "5N1K Problem Tanimlama",
    description: "Problem tanimi icin 5N1K sorularini hizlica topla.",
  },
  en: {
    title: "5W1H Problem Definition",
    description: "Capture problem definition quickly with 5W1H questions.",
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
      path="/quality-tools/5n1k"
      locale={locale}
    />
  );
}
