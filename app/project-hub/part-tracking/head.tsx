import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "Parca Durumu Takip Panosu",
    description: "Kick-off'tan SOP'a kadar parca durumlarini takip et.",
  },
  en: {
    title: "Part Status Tracking",
    description: "Track part statuses from kick-off to SOP.",
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
      path="/project-hub/part-tracking"
      locale={locale}
    />
  );
}
