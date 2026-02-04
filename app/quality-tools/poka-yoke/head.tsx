import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "Poka-Yoke Fikir Karti",
    description: "Hata onleyici fikirleri tanimla, uygulanabilirligini degerlendir.",
  },
  en: {
    title: "Poka-Yoke Idea Card",
    description: "Capture error-proofing ideas and track actions.",
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
      path="/quality-tools/poka-yoke"
      locale={locale}
    />
  );
}
