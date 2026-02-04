import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "Sikma / Baglama Planlama",
    description: "Sikma noktalarini, reaksiyonlari ve kuvvet yolunu planla.",
  },
  en: {
    title: "Clamping Plan",
    description: "Plan clamping points, reactions, and load paths.",
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
      path="/fixture-tools/clamping"
      locale={locale}
    />
  );
}
