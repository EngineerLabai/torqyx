import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "Taban Plakası",
    description: "Taban plaka kalınlığı, cıvata yerleşimi ve tabla uyumu için hızlı kart.",
  },
  en: {
    title: "Base Plate",
    description: "Quick card for base plate thickness, bolt layout, and table fit.",
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
      path="/fixture-tools/base-plate"
      locale={locale}
    />
  );
}
