import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "Kaizen / Sürekli İyileştirme",
    description: "Küçük ama sürekli iyileştirmeleri tanımla ve takip et.",
  },
  en: {
    title: "Kaizen / Continuous Improvement",
    description: "Define and track small, continuous improvements.",
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
      path="/quality-tools/kaizen"
      locale={locale}
    />
  );
}
