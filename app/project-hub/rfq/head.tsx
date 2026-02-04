import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "RFQ / Teknik Sartname Ozeti",
    description: "RFQ ve teknik sartname maddelerini net bir ozetle takip et.",
  },
  en: {
    title: "RFQ / Technical Specification",
    description: "Track RFQ and technical specification items with a clear summary.",
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
      path="/project-hub/rfq"
      locale={locale}
    />
  );
}
